package org.company.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;

@Getter
@Setter(AccessLevel.NONE)
@Entity
public class Regiao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private @NonNull String nome;
    
    @Enumerated(EnumType.STRING)
    private @NonNull Uf uf;
    
    @OneToMany(mappedBy = "regiao")
    private @NonNull List<Cliente> clientes;

    @OneToMany(mappedBy = "regiao")
    private List<Representante> representantes;

    private @NonNull String gerenteRegional;
    
    @Enumerated(EnumType.STRING)
    private @NonNull StatusRegiao status;

    // Método de consulta
    public boolean estaAtivo() {
        return status == StatusRegiao.NORMAL;
    }
}
