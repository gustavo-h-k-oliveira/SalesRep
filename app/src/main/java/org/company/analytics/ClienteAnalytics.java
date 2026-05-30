package org.company.analytics;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.company.entity.Cliente;
import org.company.entity.Pedido;
import org.springframework.stereotype.Service;

@Service
public class ClienteAnalytics {

    public double calcularScore(Cliente cliente) {
        double ticketMedio = calcularTicketMedio(cliente).doubleValue();
        double frequencia = calcularTotalPedidos(cliente);
        long diasSemCompra = cliente.getDiasSemCompra();

        double score = 100
            - (diasSemCompra * 0.5)
            + Math.min(ticketMedio, 10000) * 0.01
            + frequencia * 2;

        return Math.max(0, Math.min(100, score));
    }

    public BigDecimal calcularTicketMedio(Cliente cliente) {
        if (cliente.getPedidos() == null || cliente.getPedidos().isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal total = cliente.getPedidos().stream()
            .map(Pedido::getValorTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

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
            .map(Pedido::getValorTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
