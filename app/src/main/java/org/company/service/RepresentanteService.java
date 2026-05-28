package org.company.service;

import java.util.List;

import org.company.entity.Cliente;
import org.company.entity.Pedido;
import org.company.entity.Representante;
import org.company.repository.ClienteRepository;
import org.company.repository.PedidoRepository;
import org.company.repository.RepresentanteRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RepresentanteService {
    
    private final ClienteRepository clienteRepository;

    private final RepresentanteRepository representanteRepository;
    
    private final PedidoRepository pedidoRepository;

    // Métodos de consulta
    public List<Representante> encontrarTodos() {
        return representanteRepository.findAll();
    }

    public Representante encontrarPorId(Long id) {
        return representanteRepository.findById(id).orElse(null);
    }

    public Representante salvar(Representante representante) {
        return representanteRepository.save(representante);
    }

    public void deletar(Long id) {
        representanteRepository.deleteById(id);
    }

    public List<Representante> encontrarPorRegiao(Long regiaoId) {
        return representanteRepository.findByRegiaoId(regiaoId);
    }

    public List<Cliente> encontrarClientesDoRepresentante(Long representanteId) {
        return clienteRepository.findByRepresentanteId(representanteId);
    }

    public List<Pedido> encontrarPedidosDoRepresentante(Long representanteId) {
        return pedidoRepository.findByRepresentanteId(representanteId);
    }
}
