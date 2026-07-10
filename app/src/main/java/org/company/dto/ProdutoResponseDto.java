package org.company.dto;

import java.math.BigDecimal;

public record ProdutoResponseDto(
    Long id,
    String sku,
    String descricao,
    BigDecimal faturamento
) {}
