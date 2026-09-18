package org.company.dto;

public record RepresentanteResponseDto(
    Long id,
    String nome,
    String cpfCnpj,
    Long estadoId,
    String estadoNome,
    org.company.entity.Uf estadoUf,
    Long regiaoId,
    String regiaoNome,
    String telefone,
    String email
) {}
