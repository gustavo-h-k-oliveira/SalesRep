package org.company.service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.company.analytics.ClienteAnalytics;
import org.company.dto.ClientePerfilDto;
import org.company.dto.ClientePrioritarioDto;
import org.company.entity.Cliente;
import org.company.mapper.ClienteDtoMapper;
import org.company.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteAnalyticsService {

    private final ClienteRepository clienteRepository;
    
    private final ClienteAnalytics clienteAnalytics;
    
    private final ClienteDtoMapper clienteDtoMapper;

    public List<ClientePrioritarioDto> buscarClientesPrioritarios() {
        return buscarClientesPrioritarios(null);
    }

    public List<ClientePrioritarioDto> buscarClientesPrioritarios(Long representanteId) {
        return (representanteId == null
            ? clienteRepository.findAll()
            : clienteRepository.findByRepresentanteId(representanteId)).stream()
            .map(cliente -> new ClienteScore(cliente, clienteAnalytics.calcularScore(cliente)))
            .sorted(Comparator.comparingDouble((ClienteScore clienteScore) -> clienteScore.score).reversed())
            .map(clienteScore -> clienteDtoMapper.toClientePrioritarioDto(
                clienteScore.cliente,
                clienteScore.score,
                clienteAnalytics.calcularTicketMedio(clienteScore.cliente),
                clienteAnalytics.calcularTotalPedidos(clienteScore.cliente)
            ))
            .collect(Collectors.toList());
    }

    public ClientePerfilDto buscarPerfil(Long clienteId, Long representanteId) {
        return clienteRepository.findById(clienteId)
            .filter(cliente -> representanteId == null || (cliente.getRepresentante() != null && representanteId.equals(cliente.getRepresentante().getId())))
            .map(cliente -> clienteDtoMapper.toClientePerfilDto(
                cliente,
                clienteAnalytics.calcularTicketMedio(cliente),
                clienteAnalytics.calcularTotalPedidos(cliente),
                clienteAnalytics.calcularFaturamentoTotal(cliente)
            ))
            .orElse(null);
    }

    public ClientePerfilDto buscarPerfil(Long clienteId) {
        
        return clienteRepository.findById(clienteId)
            .map(cliente -> clienteDtoMapper.toClientePerfilDto(
                cliente,
                clienteAnalytics.calcularTicketMedio(cliente),
                clienteAnalytics.calcularTotalPedidos(cliente),
                clienteAnalytics.calcularFaturamentoTotal(cliente)
            ))
            .orElse(null);
    }

    private record ClienteScore(Cliente cliente, double score) {}
}
