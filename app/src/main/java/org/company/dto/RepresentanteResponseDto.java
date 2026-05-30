package org.company.dto;

public record RepresentanteResponseDto(
    Long id,
    String nome,
    Long regiaoId,
    String regiaoNome,
    String telefone
) {}
