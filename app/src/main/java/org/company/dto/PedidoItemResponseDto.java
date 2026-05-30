package org.company.dto;

import java.math.BigDecimal;

public record PedidoItemResponseDto(
    Long id,
    Long pedidoId,
    Long produtoId,
    int quantidade,
    BigDecimal precoUnitario,
    BigDecimal subTotal
) {}
