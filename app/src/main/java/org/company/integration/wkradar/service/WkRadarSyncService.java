package org.company.integration.wkradar.service;

import org.company.integration.wkradar.client.WkRadarApiClient;
import org.company.integration.wkradar.dto.WkRadarClienteDto;
import org.company.integration.wkradar.dto.WkRadarPedidoDto;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WkRadarSyncService {

    private final WkRadarApiClient apiClient;

    public String executarSincronizacaoCompleta() {
        if (!apiClient.isConfigured()) {
            return "Sincronização em espera: O Token da API do WK Radar ainda não foi inserido nas propriedades (wkradar.api.token).";
        }

        log.info("[WK RADAR INTEGRATION] Iniciando sincronização completa com ERP WK Radar...");

        List<WkRadarClienteDto> clientesERP = apiClient.buscarClientes();
        log.info("[WK RADAR INTEGRATION] Total de Clientes obtidos do ERP: {}", clientesERP.size());

        List<WkRadarPedidoDto> pedidosERP = apiClient.buscarPedidos();
        log.info("[WK RADAR INTEGRATION] Total de Pedidos obtidos do ERP: {}", pedidosERP.size());

        return String.format("Sincronização executada! Processados %d clientes e %d pedidos obtidos do WK Radar ERP.",
                clientesERP.size(), pedidosERP.size());
    }
}
