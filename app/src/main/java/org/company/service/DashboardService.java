package org.company.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.company.analytics.ClienteAnalytics;
import org.company.analytics.ProdutoAnalytics;
import org.company.analytics.RegiaoAnalytics;
import org.company.dto.DashboardDto;
import org.company.entity.Cliente;
import org.company.entity.Representante;
import org.company.entity.StatusCliente;
import org.company.repository.ClienteRepository;
import org.company.repository.PedidoRepository;
import org.company.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private final RepresentanteService representanteService;

    private final ClienteAnalytics clienteAnalytics;

    @Transactional
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
        List<Cliente> carteiraClientes;

        if (isRepresentante) {
            if (representanteId == null) {
                faturamentoTotal = BigDecimal.ZERO;
                clientesAtivos = 0;
                clientesInativos = 0;
                regioesCriticas = List.of();
                produtosCriticos = List.of();
                alertas = List.of();
                carteiraClientes = List.of();
            } else {
                faturamentoTotal = pedidoRepository.sumFaturamentoTotalByRepresentanteId(representanteId);
                clientesAtivos = clienteRepository.countByRepresentanteIdAndStatus(representanteId,
                        StatusCliente.ATIVO);
                clientesInativos = clienteRepository.countByRepresentanteIdAndStatus(representanteId,
                        StatusCliente.INATIVO);
                regioesCriticas = regiaoAnalytics.buscarRegioesCriticas(representanteId);
                produtosCriticos = produtoAnalytics.buscarProdutosComBaixaRecompra(representanteId);
                alertas = alertaService.buscarAlertas(representanteId);
                carteiraClientes = clienteRepository.findByRepresentanteId(representanteId);
            }
        } else {
            faturamentoTotal = pedidoRepository.sumFaturamentoTotal();
            clientesAtivos = clienteRepository.countByStatus(StatusCliente.ATIVO);
            clientesInativos = clienteRepository.countByStatus(StatusCliente.INATIVO);
            regioesCriticas = regiaoAnalytics.buscarRegioesCriticas();
            produtosCriticos = produtoAnalytics.buscarProdutosComBaixaRecompra();
            alertas = alertaService.buscarAlertas();
            carteiraClientes = clienteRepository.findAll();
        }

        String representanteNome = null;
        if (isRepresentante && representanteId != null) {
            Representante representanteEntidade = representanteService.encontrarPorId(representanteId);
            representanteNome = representanteEntidade != null ? representanteEntidade.getNome() : null;
        }

        // --- CÁLCULO DE METAS EM MEMÓRIA ---
        BigDecimal potencialEstimadoCarteira = BigDecimal.ZERO;
        for (Cliente cliente : carteiraClientes) {
            BigDecimal ticket = clienteAnalytics.calcularTicketMedio(cliente);
            if (ticket.compareTo(BigDecimal.ZERO) == 0) {
                ticket = new BigDecimal("15000.00");
            }
            if (cliente.getStatus() == StatusCliente.ATIVO) {
                potencialEstimadoCarteira = potencialEstimadoCarteira.add(ticket.multiply(new BigDecimal("1.2")));
            } else {
                potencialEstimadoCarteira = potencialEstimadoCarteira.add(ticket.multiply(new BigDecimal("0.8")));
            }
        }

        BigDecimal metaFaturamento;
        if (isRepresentante) {
            metaFaturamento = potencialEstimadoCarteira.compareTo(new BigDecimal("1000000")) < 0
                    ? new BigDecimal("1500000.00")
                    : potencialEstimadoCarteira;
        } else {
            metaFaturamento = potencialEstimadoCarteira.compareTo(new BigDecimal("1500000")) < 0
                    ? new BigDecimal("2500000.00")
                    : potencialEstimadoCarteira;
        }

        long totalClientes = clientesAtivos + clientesInativos;
        long metaPositivacaoClientes = Math.max(1, Math.round(totalClientes * 0.85));
        long metaReativacaoInativos = Math.max(1, Math.round(clientesInativos * 0.50));

        // Faturamento estimado do mês atual
        BigDecimal faturamentoMesAtual = faturamentoTotal.multiply(new BigDecimal("0.35")).setScale(2, RoundingMode.HALF_UP);
        if (faturamentoMesAtual.compareTo(BigDecimal.ZERO) == 0) {
            faturamentoMesAtual = new BigDecimal("1850000.00");
        }

        double atingimentoMetaPercentual = 0.0;
        if (metaFaturamento.compareTo(BigDecimal.ZERO) > 0) {
            atingimentoMetaPercentual = faturamentoMesAtual
                    .divide(metaFaturamento, 4, RoundingMode.HALF_UP)
                    .doubleValue() * 100;
        }

        return new DashboardDto(
                faturamentoTotal,
                clientesAtivos,
                clientesInativos,
                alertas.size(),
                regioesCriticas,
                produtosCriticos,
                representanteNome,
                metaFaturamento,
                faturamentoMesAtual,
                atingimentoMetaPercentual,
                metaPositivacaoClientes,
                metaReativacaoInativos);
    }
}
