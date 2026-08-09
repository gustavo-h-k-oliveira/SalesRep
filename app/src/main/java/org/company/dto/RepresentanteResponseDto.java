package org.company.dto;

public record RepresentanteResponseDto(
    Long id,
    String nome,
    String cpfCnpj,
    Long regiaoId,
    String regiaoNome,
    String telefone,
    String email
) {}
