package org.company.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.company.analytics.ClienteAnalytics;
import org.company.dto.ClientePerfilDto;
import org.company.dto.ClientePrioritarioDto;
import org.company.entity.Cliente;
import org.company.mapper.ClienteDtoMapper;
import org.company.repository.ClienteRepository;
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
            .thenReturn(new ClientePrioritarioDto(2L, "Cliente 2", 90.0, 10, BigDecimal.valueOf(5000), 10, "ATIVO"));
        when(clienteDtoMapper.toClientePrioritarioDto(cliente1, 75.0, BigDecimal.valueOf(1000), 5))
            .thenReturn(new ClientePrioritarioDto(1L, "Cliente 1", 75.0, 5, BigDecimal.valueOf(1000), 5, "ATIVO"));

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
}
