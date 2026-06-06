package org.company.mapper;

import org.company.dto.PedidoItemResponseDto;
import org.company.entity.PedidoItem;
import org.springframework.stereotype.Component;

@Component
public class PedidoItemDtoMapper {

    public PedidoItemResponseDto toPedidoItemResponseDto(PedidoItem pedidoItem) {
        return new PedidoItemResponseDto(
            pedidoItem.getId(),
            pedidoItem.getPedido() != null ? pedidoItem.getPedido().getId() : null,
            pedidoItem.getProduto() != null ? pedidoItem.getProduto().getId() : null,
            pedidoItem.getQuantidade(),
            pedidoItem.getPrecoUnitario(),
            pedidoItem.getSubTotal()
        );
    }
}
