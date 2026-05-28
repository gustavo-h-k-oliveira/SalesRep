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
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PedidoRepository pedidoRepository;

    private final ClienteRepository clienteRepository;
    
    private final AlertaService alertaService;
    
    private final RegiaoAnalytics regiaoAnalytics;
    
    private final ProdutoAnalytics produtoAnalytics;

    public DashboardDto obterResumo() {
        
        BigDecimal faturamentoTotal = pedidoRepository.findByStatus(StatusPedido.FATURADO).stream()
            .map(Pedido::getValorTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        long clientesAtivos = clienteRepository.countByStatus(StatusCliente.ATIVO);
        long clientesInativos = clienteRepository.countByStatus(StatusCliente.INATIVO);

        List<String> regioesCriticas = regiaoAnalytics.buscarRegioesCriticas();
        List<String> produtosCriticos = produtoAnalytics.buscarProdutosComBaixaRecompra();

        return new DashboardDto(
            faturamentoTotal,
            clientesAtivos,
            clientesInativos,
            alertaService.buscarAlertas().size(),
            regioesCriticas,
            produtosCriticos
        );
    }
}
