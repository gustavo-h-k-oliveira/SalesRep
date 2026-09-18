package org.company.mapper;

import org.company.dto.EstadoResponseDto;
import org.company.entity.Estado;
import org.springframework.stereotype.Component;

@Component
public class EstadoDtoMapper {

    public EstadoResponseDto toEstadoResponseDto(Estado estado) {
        if (estado == null) {
            return null;
        }
        return new EstadoResponseDto(
            estado.getId(),
            estado.getNome(),
            estado.getUf(),
            estado.getRegiao() != null ? estado.getRegiao().getId() : null,
            estado.getRegiao() != null ? estado.getRegiao().getNome() : null,
            estado.getStatus()
        );
    }
}
