package org.company.mapper;

import org.company.dto.RegiaoResponseDto;
import org.company.entity.Regiao;
import org.springframework.stereotype.Component;

@Component
public class RegiaoDtoMapper {

    public RegiaoResponseDto toRegiaoResponseDto(Regiao regiao) {
        return new RegiaoResponseDto(
            regiao.getId(),
            regiao.getNome(),
            regiao.getUf(),
            regiao.getGerenteRegional(),
            regiao.getStatus()
        );
    }
}
