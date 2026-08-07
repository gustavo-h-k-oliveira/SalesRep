package org.company.service;

import org.company.analytics.ProdutoAnalytics;
import org.company.analytics.RegiaoAnalytics;
import org.company.dto.AlertaDto;
import org.company.entity.Cliente;
import org.company.repository.ClienteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlertaServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private RegiaoAnalytics regiaoAnalytics;

    @Mock
    private ProdutoAnalytics produtoAnalytics;

    @InjectMocks
    private AlertaService alertaService;

    @Test
    void buscarAlertas_deveRetornarAlertasDeClientesInativos() {
        Cliente cliente1 = mock(Cliente.class);
        when(cliente1.getId()).thenReturn(1L);
        when(cliente1.getNome()).thenReturn("Cliente 1");

        when(clienteRepository.findByUltimaCompraBefore(any(LocalDate.class)))
            .thenReturn(List.of(cliente1));
        when(regiaoAnalytics.buscarRegioesCriticas(any())).thenReturn(Collections.emptyList());
        when(produtoAnalytics.buscarProdutosComBaixaRecompra(any())).thenReturn(Collections.emptyList());

        List<AlertaDto> alertas = alertaService.buscarAlertas();

        assertNotNull(alertas);
        assertFalse(alertas.isEmpty());
    }
}
