package org.company.integration.wkradar.client;

import org.company.integration.wkradar.config.WkRadarProperties;
import org.company.integration.wkradar.dto.WkRadarClienteDto;
import org.company.integration.wkradar.dto.WkRadarPedidoDto;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class WkRadarApiClient {

    private final WkRadarProperties properties;
    private final RestTemplate restTemplate = new RestTemplate();

    public boolean isConfigured() {
        return properties.isEnabled() && properties.getToken() != null 
            && !properties.getToken().isBlank() 
            && !"COLOQUE_SEU_TOKEN_AQUI".equals(properties.getToken());
    }

    public List<WkRadarClienteDto> buscarClientes() {
        if (!isConfigured()) {
            log.warn("[WK RADAR INTEGRATION] Token não configurado ou integração desabilitada.");
            return Collections.emptyList();
        }
        enforceRateLimit();
        try {
            String url = properties.getUrl() + "/api/empresarial/v1/cliente?Fields=Id,Nome,CpfCnpj,Situacao,Estado";
            HttpHeaders headers = createAuthHeaders();
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<WkRadarClienteDto[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, WkRadarClienteDto[].class);
            return response.getBody() != null ? Arrays.asList(response.getBody()) : Collections.emptyList();
        } catch (Exception e) {
            log.error("[WK RADAR INTEGRATION] Erro ao buscar clientes: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<WkRadarPedidoDto> buscarPedidos() {
        if (!isConfigured()) {
            log.warn("[WK RADAR INTEGRATION] Token não configurado ou integração desabilitada.");
            return Collections.emptyList();
        }
        enforceRateLimit();
        try {
            String url = properties.getUrl() + "/api/comercial/v1/pedido?Fields=Id,Numero,IdCliente,DataEmissao,ValorTotal,Situacao";
            HttpHeaders headers = createAuthHeaders();
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<WkRadarPedidoDto[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, WkRadarPedidoDto[].class);
            return response.getBody() != null ? Arrays.asList(response.getBody()) : Collections.emptyList();
        } catch (Exception e) {
            log.error("[WK RADAR INTEGRATION] Erro ao buscar pedidos: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    private HttpHeaders createAuthHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(properties.getToken());
        headers.set("Content-Type", "application/json");
        return headers;
    }

    private void enforceRateLimit() {
        try {
            Thread.sleep(properties.getRateLimitDelayMs());
        } catch (InterruptedException ignored) {
            Thread.currentThread().interrupt();
        }
    }
}
