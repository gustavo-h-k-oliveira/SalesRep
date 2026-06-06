package org.company.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;

import org.company.analytics.ProdutoAnalytics;
import org.company.analytics.RegiaoAnalytics;
import org.company.dto.DashboardDto;
import org.company.entity.Pedido;
import org.company.entity.Representante;
import org.company.entity.StatusCliente;
import org.company.entity.StatusPedido;
import org.company.repository.ClienteRepository;
import org.company.repository.PedidoRepository;
import org.company.security.SecurityUtils;
import org.company.service.RepresentanteService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private ClienteService clienteService;

    @Mock
    private AlertaService alertaService;

    @Mock
    private RegiaoAnalytics regiaoAnalytics;

    @Mock
    private ProdutoAnalytics produtoAnalytics;

    @Mock
    private RepresentanteService representanteService;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void obterResumo_deveMontarDashboardComKpis() {
        Pedido pedido = org.mockito.Mockito.mock(Pedido.class);
        when(pedido.getValorTotal()).thenReturn(BigDecimal.valueOf(1000));
        when(pedidoRepository.findByStatus(StatusPedido.FATURADO)).thenReturn(List.of(pedido));
        when(clienteRepository.countByStatus(StatusCliente.ATIVO)).thenReturn(5L);
        when(clienteRepository.countByStatus(StatusCliente.INATIVO)).thenReturn(2L);
        when(alertaService.buscarAlertas()).thenReturn(List.of());
        when(regiaoAnalytics.buscarRegioesCriticas()).thenReturn(List.of("Sudeste"));
        when(produtoAnalytics.buscarProdutosComBaixaRecompra()).thenReturn(List.of("SKU-123"));

        DashboardDto dto = dashboardService.obterResumo();

        assertEquals(BigDecimal.valueOf(1000), dto.getFaturamentoTotal());
        assertEquals(5, dto.getClientesAtivos());
        assertEquals(2, dto.getClientesInativos());
        assertEquals(0, dto.getAlertasPendentes());
        assertEquals(1, dto.getRegioesCriticas().size());
        assertEquals(1, dto.getProdutosCriticos().size());
    }

    @Test
    void obterResumo_comRepresentanteLogado_deveUsarApenasPedidosFaturadosDoRepresentante() {
        Pedido pedido = org.mockito.Mockito.mock(Pedido.class);
        when(pedido.getValorTotal()).thenReturn(BigDecimal.valueOf(74));
        when(pedidoRepository.findByRepresentanteIdAndStatus(1L, StatusPedido.FATURADO)).thenReturn(List.of(pedido));
        when(clienteRepository.countByRepresentanteIdAndStatus(1L, StatusCliente.ATIVO)).thenReturn(1L);
        when(clienteRepository.countByRepresentanteIdAndStatus(1L, StatusCliente.INATIVO)).thenReturn(0L);
        when(alertaService.buscarAlertas(1L)).thenReturn(List.of());
        when(regiaoAnalytics.buscarRegioesCriticas(1L)).thenReturn(List.of());
        when(produtoAnalytics.buscarProdutosComBaixaRecompra(1L)).thenReturn(List.of());

        Representante representante = new Representante();
        representante.setNome("MARCELO DE CASTRO SILVA & CIA. LTDA.");
        when(representanteService.encontrarPorId(1L)).thenReturn(representante);

        try (MockedStatic<SecurityUtils> utilities = mockStatic(SecurityUtils.class)) {
            utilities.when(SecurityUtils::isRepresentante).thenReturn(true);
            utilities.when(SecurityUtils::getRepresentanteId).thenReturn(1L);

            DashboardDto dto = dashboardService.obterResumo();

            assertEquals(BigDecimal.valueOf(74), dto.getFaturamentoTotal());
            assertEquals(1, dto.getClientesAtivos());
            assertEquals(0, dto.getClientesInativos());
            assertEquals(0, dto.getAlertasPendentes());
            assertEquals(0, dto.getRegioesCriticas().size());
            assertEquals(0, dto.getProdutosCriticos().size());
            assertEquals("MARCELO DE CASTRO SILVA & CIA. LTDA.", dto.getRepresentanteNome());
        }
    }
}
