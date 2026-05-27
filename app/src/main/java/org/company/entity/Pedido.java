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
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;

@Getter
@Setter(AccessLevel.NONE)
@Entity
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private @NonNull Cliente cliente;
    
    @ManyToOne
    @JoinColumn(name = "representante_id")
    private @NonNull Representante representante;
    
    private @NonNull LocalDate dataEmissao;
    
    @Column(name = "data_faturamento", nullable = true)
    private LocalDate dataFaturamento;    
    
    private @NonNull BigDecimal valorTotal;
    
    @Enumerated(EnumType.STRING)
    private @NonNull StatusPedido status;

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
