package org.company.mapper;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.company.dto.ClientePerfilDto;
import org.company.dto.ClientePrioritarioDto;
import org.company.dto.ClienteResponseDto;
import org.company.entity.Cliente;
import org.springframework.stereotype.Component;

@Component
public class ClienteDtoMapper {

    public ClientePrioritarioDto toClientePrioritarioDto(Cliente cliente, double score, BigDecimal ticketMedio, int totalPedidos) {
        return new ClientePrioritarioDto(
            cliente.getId(),
            cliente.getNome(),
            score,
            cliente.getDiasSemCompra(),
            ticketMedio.setScale(2, RoundingMode.HALF_UP),
            totalPedidos,
            cliente.getStatus().name()
        );
    }

    public ClientePerfilDto toClientePerfilDto(Cliente cliente, BigDecimal ticketMedio, int totalPedidos, BigDecimal faturamentoTotal) {
        return new ClientePerfilDto(
            cliente.getId(),
            cliente.getNome(),
            cliente.getRepresentante() != null ? cliente.getRepresentante().getNome() : null,
            cliente.getRegiao() != null ? cliente.getRegiao().getNome() : null,
            cliente.getStatus().name(),
            cliente.getUltimaCompra(),
            cliente.getDiasSemCompra(),
            ticketMedio.setScale(2, RoundingMode.HALF_UP),
            totalPedidos,
            faturamentoTotal
        );
    }

    public ClienteResponseDto toClienteResponseDto(Cliente cliente) {
        return new ClienteResponseDto(
            cliente.getId(),
            cliente.getNome(),
            cliente.getRegiao() != null ? cliente.getRegiao().getId() : null,
            cliente.getRegiao() != null ? cliente.getRegiao().getNome() : null,
            cliente.getRepresentante() != null ? cliente.getRepresentante().getId() : null,
            cliente.getRepresentante() != null ? cliente.getRepresentante().getNome() : null,
            cliente.getUltimaCompra(),
            cliente.getStatus() != null ? cliente.getStatus().name() : null
        );
    }
}
