package org.company.dto;

import java.math.BigDecimal;

public record ProdutoResponseDto(
    Long id,
    String sku,
    String descricao,
    String grupo,
    BigDecimal faturamento
) {}
