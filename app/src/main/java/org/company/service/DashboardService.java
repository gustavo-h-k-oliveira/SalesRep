package org.company.service;

import java.math.BigDecimal;
import java.util.List;

import org.company.analytics.ProdutoAnalytics;
import org.company.analytics.RegiaoAnalytics;
import org.company.dto.DashboardDto;
import org.company.entity.Pedido;
import org.company.entity.StatusCliente;
import org.company.entity.StatusPedido;
import org.company.repository.ClienteRepository;
import org.company.repository.PedidoRepository;
import org.company.security.SecurityUtils;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PedidoRepository pedidoRepository;

    private final ClienteRepository clienteRepository;

    private final ClienteService clienteService;
    
    private final AlertaService alertaService;
    
    private final RegiaoAnalytics regiaoAnalytics;
    
    private final ProdutoAnalytics produtoAnalytics;

    public DashboardDto obterResumo() {
        clienteService.atualizarStatusDeTodos();

        Long representanteId = SecurityUtils.getRepresentanteId();
        boolean isRepresentante = SecurityUtils.isRepresentante();

        BigDecimal faturamentoTotal;
        long clientesAtivos;
        long clientesInativos;
        List<String> regioesCriticas;
        List<String> produtosCriticos;
        List<?> alertas;

        if (isRepresentante && representanteId != null) {
            faturamentoTotal = pedidoRepository.findByRepresentanteIdAndStatus(representanteId, StatusPedido.FATURADO).stream()
                .map(Pedido::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            clientesAtivos = clienteRepository.countByRepresentanteIdAndStatus(representanteId, StatusCliente.ATIVO);
            clientesInativos = clienteRepository.countByRepresentanteIdAndStatus(representanteId, StatusCliente.INATIVO);
            regioesCriticas = regiaoAnalytics.buscarRegioesCriticas(representanteId);
            produtosCriticos = produtoAnalytics.buscarProdutosComBaixaRecompra(representanteId);
            alertas = alertaService.buscarAlertas(representanteId);
        } else {
            faturamentoTotal = pedidoRepository.findByStatus(StatusPedido.FATURADO).stream()
                .map(Pedido::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            clientesAtivos = clienteRepository.countByStatus(StatusCliente.ATIVO);
            clientesInativos = clienteRepository.countByStatus(StatusCliente.INATIVO);
            regioesCriticas = regiaoAnalytics.buscarRegioesCriticas();
            produtosCriticos = produtoAnalytics.buscarProdutosComBaixaRecompra();
            alertas = alertaService.buscarAlertas();
        }

        return new DashboardDto(
            faturamentoTotal,
            clientesAtivos,
            clientesInativos,
            alertas.size(),
            regioesCriticas,
            produtosCriticos
        );
    }
}
