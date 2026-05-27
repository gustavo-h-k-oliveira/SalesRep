package org.company.entity;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;  
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;

@Getter
@Setter(AccessLevel.NONE)
@Entity
public class PedidoItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private @NonNull Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private @NonNull Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private @NonNull Produto produto;

    private int quantidade;

    private @NonNull BigDecimal precoUnitario;

    private @NonNull BigDecimal subTotal;
}
