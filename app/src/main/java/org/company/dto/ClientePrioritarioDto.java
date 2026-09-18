package org.company.dto;

import java.math.BigDecimal;

import org.company.entity.Uf;

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
    private Long estadoId;
    private String estadoNome;
    private Uf estadoUf;
    private Long regiaoId;
    private String regiaoNome;
    private String status;

    public ClientePrioritarioDto(Long id, String nome, double score, long diasSemCompra, BigDecimal ticketMedio, int totalPedidos, Long regiaoId, String regiaoNome, String status) {
        this(id, nome, score, diasSemCompra, ticketMedio, totalPedidos, null, null, null, regiaoId, regiaoNome, status);
    }
}
