package org.company.dto;

import org.company.entity.StatusRegiao;
import org.company.entity.Uf;

public record EstadoResponseDto(
    Long id,
    String nome,
    Uf uf,
    Long regiaoId,
    String regiaoNome,
    StatusRegiao status
) {}
