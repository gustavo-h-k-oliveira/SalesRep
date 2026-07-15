package org.company.dto;

public record ProdutoRecomendadoDto(
    Long id,
    String sku,
    String descricao,
    String justificativa
) {}
