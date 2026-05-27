package org.company.entity;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Id;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;

@Getter
@Setter(AccessLevel.NONE)
@Entity
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private @NonNull String nome;
    
    @ManyToOne
    @JoinColumn(name = "regiao_id")
    private @NonNull Regiao regiao;
    
    @ManyToOne
    @JoinColumn(name = "representante_id")
    private @NonNull Representante representante;

    @OneToMany(mappedBy = "cliente")
    private List<Pedido> pedidos;
    
    private @NonNull LocalDate ultimaCompra;
    
    @Enumerated(EnumType.STRING)
    private @NonNull StatusCliente status;

    // Métodos de consulta
    public boolean estaAtivo() {
        return status == StatusCliente.ATIVO;
    }

    public boolean estaInativo() {
        return status == StatusCliente.INATIVO;
    }

    // Métodos de cálculo
    public long getDiasSemCompra() {
        return ChronoUnit.DAYS.between(ultimaCompra, LocalDate.now());
    }
}
