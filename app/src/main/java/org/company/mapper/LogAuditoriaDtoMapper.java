package org.company.mapper;

import org.company.dto.LogAuditoriaResponseDto;
import org.company.entity.LogAuditoria;
import org.springframework.stereotype.Component;

@Component
public class LogAuditoriaDtoMapper {

    public LogAuditoriaResponseDto toLogAuditoriaResponseDto(LogAuditoria log) {
        return new LogAuditoriaResponseDto(
            log.getId(),
            log.getUsername(),
            log.getEvento() != null ? log.getEvento().name() : null,
            log.getIp(),
            log.getUserAgent(),
            log.getDataHora()
        );
    }
}
