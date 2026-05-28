package org.company.dto;

import org.company.entity.Uf;
import org.company.entity.StatusRegiao;

public record RegiaoResponseDto(
    Long id,
    String nome,
    Uf uf,
    String gerenteRegional,
    StatusRegiao status
) {}
