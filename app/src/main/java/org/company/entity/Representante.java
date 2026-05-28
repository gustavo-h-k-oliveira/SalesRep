package org.company.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Getter
@Setter(AccessLevel.NONE)
@Entity
public class Representante {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private @NonNull String nome;
    
    @ManyToOne
    @JoinColumn(name = "regiao_id")
    private @NonNull Regiao regiao;

    private @NonNull String telefone;

    @OneToMany(mappedBy = "representante")
    private List<Pedido> pedidos;

    @OneToMany(mappedBy = "representante")
    private List<Cliente> clientes;
}
