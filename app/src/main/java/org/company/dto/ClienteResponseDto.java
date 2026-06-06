package org.company.dto;

import java.time.LocalDate;

public record ClienteResponseDto(
    Long id,
    String nome,
    Long regiaoId,
    String regiaoNome,
    Long representanteId,
    String representanteNome,
    LocalDate ultimaCompra,
    String status
) {}
