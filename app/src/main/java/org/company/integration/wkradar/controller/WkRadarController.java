package org.company.integration.wkradar.controller;

import org.company.integration.wkradar.client.WkRadarApiClient;
import org.company.integration.wkradar.service.WkRadarSyncService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import java.util.Map;

@RestController
@RequestMapping("/api/integracao/wkradar")
@RequiredArgsConstructor
public class WkRadarController {

    private final WkRadarSyncService syncService;
    private final WkRadarApiClient apiClient;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        boolean pronto = apiClient.isConfigured();
        return ResponseEntity.ok(Map.of(
            "provedor", "WK Radar ERP",
            "configurado", pronto,
            "mensagem", pronto 
                ? "Módulo pronto e autenticado com a API do WK Radar ERP." 
                : "Aguardando Token da API WK Radar. Insira o token na propriedade 'wkradar.api.token' em application.properties para ativar."
        ));
    }

    @PostMapping("/sincronizar")
    public ResponseEntity<Map<String, String>> sincronizar() {
        String resultado = syncService.executarSincronizacaoCompleta();
        return ResponseEntity.ok(Map.of("resultado", resultado));
    }
}
