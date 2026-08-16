package org.company.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import java.util.Map;

import org.company.analytics.ClienteAnalytics;
import org.company.analytics.ProdutoAnalytics;
import org.company.dto.ClientePerfilDto;
import org.company.dto.ClientePrioritarioDto;
import org.company.entity.Cliente;
import org.company.mapper.ClienteDtoMapper;
import org.company.repository.ClienteRepository;
import org.company.repository.PedidoRepository;
import org.company.repository.ProdutoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ClienteAnalyticsServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private ProdutoAnalytics produtoAnalytics;

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private ClienteAnalytics clienteAnalytics;

    @Mock
    private ClienteDtoMapper clienteDtoMapper;

    @InjectMocks
    private ClienteAnalyticsService clienteAnalyticsService;

    @Test
    void buscarClientesPrioritarios_deveRetornarTodosOsClientesOrdenadosPorScore() {
        Cliente cliente1 = org.mockito.Mockito.mock(Cliente.class);
        Cliente cliente2 = org.mockito.Mockito.mock(Cliente.class);

        when(clienteAnalytics.calcularScore(cliente1)).thenReturn(75.0);
        when(clienteAnalytics.calcularScore(cliente2)).thenReturn(90.0);
        when(clienteAnalytics.calcularTicketMedio(cliente1)).thenReturn(BigDecimal.valueOf(1000));
        when(clienteAnalytics.calcularTotalPedidos(cliente1)).thenReturn(5);
        when(clienteAnalytics.calcularTicketMedio(cliente2)).thenReturn(BigDecimal.valueOf(5000));
        when(clienteAnalytics.calcularTotalPedidos(cliente2)).thenReturn(10);
        
        when(clienteDtoMapper.toClientePrioritarioDto(cliente2, 90.0, BigDecimal.valueOf(5000), 10))
            .thenReturn(new ClientePrioritarioDto(2L, "Cliente 2", 90.0, 10, BigDecimal.valueOf(5000), 10, null, null, "ATIVO"));
        when(clienteDtoMapper.toClientePrioritarioDto(cliente1, 75.0, BigDecimal.valueOf(1000), 5))
            .thenReturn(new ClientePrioritarioDto(1L, "Cliente 1", 75.0, 5, BigDecimal.valueOf(1000), 5, null, null, "ATIVO"));

        when(clienteRepository.findAll()).thenReturn(List.of(cliente1, cliente2));

        var resultado = clienteAnalyticsService.buscarClientesPrioritarios();

        assertEquals(2, resultado.size());
        assertEquals(90.0, resultado.get(0).getScore());
        assertEquals("Cliente 2", resultado.get(0).getNome());
        assertEquals(75.0, resultado.get(1).getScore());
        assertEquals("Cliente 1", resultado.get(1).getNome());
    }

    @Test
    void buscarPerfil_deveRetornarDtoQuandoClienteExistir() {
        Cliente cliente = org.mockito.Mockito.mock(Cliente.class);
        ClientePerfilDto dto = new ClientePerfilDto(1L, "Cliente", "Rep", "Regiao", "ATIVO", null, 0, BigDecimal.valueOf(100), 2, BigDecimal.valueOf(200));

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(clienteAnalytics.calcularTicketMedio(cliente)).thenReturn(BigDecimal.valueOf(100));
        when(clienteAnalytics.calcularTotalPedidos(cliente)).thenReturn(2);
        when(clienteAnalytics.calcularFaturamentoTotal(cliente)).thenReturn(BigDecimal.valueOf(200));
        when(clienteDtoMapper.toClientePerfilDto(cliente, BigDecimal.valueOf(100), 2, BigDecimal.valueOf(200))).thenReturn(dto);

        ClientePerfilDto resultado = clienteAnalyticsService.buscarPerfil(1L);

        assertEquals(dto, resultado);
    }

    @Test
    void isDisponivelParaRecomendacao_produtoNaoSazonal_deveRetornarTrueEmQualquerMes() {
        org.company.entity.Produto produto = new org.company.entity.Produto();
        produto.setSku("3550");
        produto.setSazonal(false);

        boolean agosto = clienteAnalyticsService.isDisponivelParaRecomendacao(produto, java.time.LocalDate.of(2026, 8, 16));
        boolean fevereiro = clienteAnalyticsService.isDisponivelParaRecomendacao(produto, java.time.LocalDate.of(2026, 2, 10));

        org.junit.jupiter.api.Assertions.assertTrue(agosto);
        org.junit.jupiter.api.Assertions.assertTrue(fevereiro);
    }

    @Test
    void isDisponivelParaRecomendacao_produtoSazonalOvos_deveRetornarTrueApenasEmFevereiroEMarco() {
        org.company.entity.Produto produto = new org.company.entity.Produto();
        produto.setSku("3600");
        produto.setSazonal(true);
        produto.setMesInicioSazonalidade(2);
        produto.setMesFimSazonalidade(3);

        boolean fevereiro = clienteAnalyticsService.isDisponivelParaRecomendacao(produto, java.time.LocalDate.of(2026, 2, 15));
        boolean marco = clienteAnalyticsService.isDisponivelParaRecomendacao(produto, java.time.LocalDate.of(2026, 3, 20));
        boolean agosto = clienteAnalyticsService.isDisponivelParaRecomendacao(produto, java.time.LocalDate.of(2026, 8, 16));

        org.junit.jupiter.api.Assertions.assertTrue(fevereiro);
        org.junit.jupiter.api.Assertions.assertTrue(marco);
        org.junit.jupiter.api.Assertions.assertFalse(agosto);
    }

    @Test
    void obterRecomendacoes_deveFiltrarProdutosSazonaisForaDaJanelaDeSazonalidade() {
        Cliente cliente = new Cliente();
        cliente.setId(1L);

        org.company.entity.Produto produtoSazonal = new org.company.entity.Produto();
        produtoSazonal.setId(100L);
        produtoSazonal.setSku("3600");
        produtoSazonal.setDescricao("OVO CHOCOLATE AO LEITE MAGIC EGG");
        produtoSazonal.setGrupo("OVOS");
        produtoSazonal.setSazonal(true);
        produtoSazonal.setMesInicioSazonalidade(2);
        produtoSazonal.setMesFimSazonalidade(3);

        org.company.entity.Produto produtoRecorrente = new org.company.entity.Produto();
        produtoRecorrente.setId(101L);
        produtoRecorrente.setSku("3550");
        produtoRecorrente.setDescricao("OVO MAGIC EGG 60 X 20 GRS");
        produtoRecorrente.setGrupo("OVOS");
        produtoRecorrente.setSazonal(false);

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(pedidoRepository.findByClienteId(1L)).thenReturn(List.of());
        when(produtoAnalytics.buscarProdutosComBaixaRecompraProduto(null)).thenReturn(List.of(produtoSazonal, produtoRecorrente));
        when(produtoAnalytics.obterFaturamentosDosProdutos(null)).thenReturn(Map.of());
        when(produtoRepository.findAll()).thenReturn(List.of(produtoSazonal, produtoRecorrente));

        List<org.company.dto.ProdutoRecomendadoDto> recomendacoes = clienteAnalyticsService.obterRecomendacoes(1L, null);

        // Como a data atual (Agosto) está fora da janela de Fev/Mar (meses 2 e 3),
        // o produtoSazonal (3600) DEVE ser filtrado e NÃO deve ser recomendado.
        // O produtoRecorrente (3550) DEVE ser recomendado.
        boolean contemSazonal = recomendacoes.stream().anyMatch(r -> "3600".equals(r.sku()));
        boolean contemRecorrente = recomendacoes.stream().anyMatch(r -> "3550".equals(r.sku()));

        org.junit.jupiter.api.Assertions.assertFalse(contemSazonal, "O produto sazonal 3600 não deveria ser recomendado fora da Páscoa.");
        org.junit.jupiter.api.Assertions.assertTrue(contemRecorrente, "O produto recorrente 3550 deveria ser recomendado.");
    }
}
