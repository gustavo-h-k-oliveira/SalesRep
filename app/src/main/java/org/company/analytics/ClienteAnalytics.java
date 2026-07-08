package org.company.analytics;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.company.entity.Cliente;
import org.springframework.stereotype.Service;

@Service
public class ClienteAnalytics {

    public double calcularScore(Cliente cliente) {
        double ticketMedio = calcularTicketMedio(cliente).doubleValue();
        double frequencia = calcularTotalPedidos(cliente);
        long diasSemCompra = cliente.getDiasSemCompra();

        // Combina o valor do cliente (ticket e frequencia) com a urgência de atenção (dias sem compra)
        double scoreValioso = Math.min(ticketMedio, 10000) * 0.005 + (frequencia * 1.0);
        double scoreUrgencia = Math.min(diasSemCompra, 90) * 0.5;

        double score = scoreValioso + scoreUrgencia;

        return Math.max(0, Math.min(100, score));
    }

    public BigDecimal calcularTicketMedio(Cliente cliente) {
        if (cliente.getPedidos() == null || cliente.getPedidos().isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal total = cliente.getPedidos().stream()
            .map(pedido -> pedido.getValorTotal())
            .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));
            
        return total.divide(BigDecimal.valueOf(cliente.getPedidos().size()), 2, RoundingMode.HALF_UP);
    }

    public int calcularTotalPedidos(Cliente cliente) {
        return cliente.getPedidos() == null ? 0 : cliente.getPedidos().size();
    }

    public BigDecimal calcularFaturamentoTotal(Cliente cliente) {
        if (cliente.getPedidos() == null || cliente.getPedidos().isEmpty()) {
            return BigDecimal.ZERO;
        }

        return cliente.getPedidos().stream()
            .map(pedido -> pedido.getValorTotal())
            .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));
    }
}
