package org.company.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.company.entity.StatusPedido;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class PedidoRequestDto {

    @NotNull
    private Long clienteId;

    @NotNull
    private Long representanteId;

    @NotNull
    private LocalDate dataEmissao;

    private LocalDate dataFaturamento;

    @NotNull
    @PositiveOrZero
    private BigDecimal valorTotal;

    @NotNull
    private StatusPedido status;
}
