package org.company.mapper;

import org.company.dto.RepresentanteResponseDto;
import org.company.entity.Representante;
import org.springframework.stereotype.Component;

@Component
public class RepresentanteDtoMapper {

    public RepresentanteResponseDto toRepresentanteResponseDto(Representante representante) {
        return new RepresentanteResponseDto(
            representante.getId(),
            representante.getNome(),
            representante.getRegiao() != null ? representante.getRegiao().getId() : null,
            representante.getRegiao() != null ? representante.getRegiao().getNome() : null,
            representante.getTelefone()
        );
    }
}
