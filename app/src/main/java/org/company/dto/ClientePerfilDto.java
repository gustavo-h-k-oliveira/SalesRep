package org.company.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClientePerfilDto {
    private Long id;
    private String nome;
    private String representante;
    private String regiao;
    private String status;
    private LocalDate ultimaCompra;
    private long diasSemCompra;
    private BigDecimal ticketMedio;
    private int totalPedidos;
    private BigDecimal faturamentoTotal;
}
