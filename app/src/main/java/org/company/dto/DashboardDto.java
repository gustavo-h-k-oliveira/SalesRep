package org.company.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {
    private BigDecimal faturamentoTotal;
    private long clientesAtivos;
    private long clientesInativos;
    private int alertasPendentes;
    private List<String> regioesCriticas;
    private List<String> produtosCriticos;
    private String representanteNome;
}
