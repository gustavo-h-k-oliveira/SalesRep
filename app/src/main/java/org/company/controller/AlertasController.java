package org.company.controller;

import java.util.List;

import org.company.dto.AlertaDto;
import org.company.security.SecurityUtils;
import org.company.service.AlertaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/alertas")
@RequiredArgsConstructor
public class AlertasController {

    private final AlertaService alertaService;

    @GetMapping
    public List<AlertaDto> listarAlertas() {
        return alertaService.buscarAlertas(SecurityUtils.getRepresentanteId());
    }
}
