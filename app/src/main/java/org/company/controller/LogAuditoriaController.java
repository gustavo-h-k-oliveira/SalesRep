package org.company.controller;

import org.company.dto.LogAuditoriaResponseDto;
import org.company.mapper.LogAuditoriaDtoMapper;
import org.company.service.LogAuditoriaService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auditoria")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GESTOR')")
public class LogAuditoriaController {

    private final LogAuditoriaService logAuditoriaService;
    private final LogAuditoriaDtoMapper logAuditoriaDtoMapper;

    @GetMapping
    public Page<LogAuditoriaResponseDto> listarLogs(Pageable pageable) {
        return logAuditoriaService.obterTodosOsLogs(pageable)
                .map(logAuditoriaDtoMapper::toLogAuditoriaResponseDto);
    }
}
