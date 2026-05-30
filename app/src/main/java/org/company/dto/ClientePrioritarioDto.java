package org.company.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClientePrioritarioDto {
    private Long id;
    private String nome;
    private double score;
    private long diasSemCompra;
    private BigDecimal ticketMedio;
    private int totalPedidos;
    private String status;
}
