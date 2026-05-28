package org.company.mapper;

import org.company.dto.PedidoResponseDto;
import org.company.entity.Pedido;
import org.springframework.stereotype.Component;

@Component
public class PedidoDtoMapper {

    public PedidoResponseDto toPedidoResponseDto(Pedido pedido) {
        return new PedidoResponseDto(
            pedido.getId(),
            pedido.getCliente() != null ? pedido.getCliente().getId() : null,
            pedido.getCliente() != null ? pedido.getCliente().getNome() : null,
            pedido.getRepresentante() != null ? pedido.getRepresentante().getId() : null,
            pedido.getRepresentante() != null ? pedido.getRepresentante().getNome() : null,
            pedido.getDataEmissao(),
            pedido.getDataFaturamento(),
            pedido.getValorTotal(),
            pedido.getStatus() != null ? pedido.getStatus().name() : null
        );
    }
}
