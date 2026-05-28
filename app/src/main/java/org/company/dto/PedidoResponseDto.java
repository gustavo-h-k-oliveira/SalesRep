package org.company.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PedidoResponseDto(
    Long id,
    Long clienteId,
    String clienteNome,
    Long representanteId,
    String representanteNome,
    LocalDate dataEmissao,
    LocalDate dataFaturamento,
    BigDecimal valorTotal,
    String status
) {}
