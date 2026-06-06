package org.company.entity;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;  
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;

@Getter
@Setter
@Entity
public class PedidoItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private @NonNull Long id;

    @ManyToOne
    @Valid
    @JoinColumn(name = "pedido_id")
    private @NotNull Pedido pedido;

    @ManyToOne
    @Valid
    @JoinColumn(name = "produto_id")
    private @NotNull Produto produto;

    private @Positive int quantidade;

    private @NotNull @Positive BigDecimal precoUnitario;

    private @NotNull @Positive BigDecimal subTotal;
}
