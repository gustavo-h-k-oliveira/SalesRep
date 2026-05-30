package org.company.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PedidoItemRequestDto {

    @NotNull
    private Long pedidoId;

    @NotNull
    private Long produtoId;

    @Positive
    private int quantidade;

    @NotNull
    @Positive
    private BigDecimal precoUnitario;

    @NotNull
    @Positive
    private BigDecimal subTotal;
}
