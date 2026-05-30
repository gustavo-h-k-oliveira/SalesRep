package org.company.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @Valid
    private @NotNull Cliente cliente;
    
    @ManyToOne
    @JoinColumn(name = "representante_id")
    @Valid
    private @NotNull Representante representante;
    
    private @NotNull LocalDate dataEmissao;
    
    @Column(name = "data_faturamento", nullable = true)
    private LocalDate dataFaturamento;    
    
    private @NotNull @PositiveOrZero BigDecimal valorTotal;
    
    @Enumerated(EnumType.STRING)
    private @NotNull StatusPedido status;

    @Enumerated(EnumType.STRING)
    private @NotNull StatusAutorizacaoComercial autorizacaoComercial;

    @OneToMany(mappedBy = "pedido")
    private List<PedidoItem> itens;

    // Métodos de consulta
    public boolean estaFaturado() {
        return status == StatusPedido.FATURADO;
    }

    public boolean estaCancelado() {
        return status == StatusPedido.CANCELADO;
    }
}
