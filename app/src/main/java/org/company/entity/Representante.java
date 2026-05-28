package org.company.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
@Entity
public class Representante {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private @NotBlank String nome;
    
    @ManyToOne
    @Valid
    @JoinColumn(name = "regiao_id")
    private @NotNull Regiao regiao;

    private @NotBlank String telefone;

    @OneToMany(mappedBy = "representante")
    private List<Pedido> pedidos;

    @OneToMany(mappedBy = "representante")
    private List<Cliente> clientes;
}
