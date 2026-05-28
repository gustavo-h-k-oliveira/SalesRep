package org.company.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;

@Getter
@Setter
@Entity
public class Regiao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private @NotBlank String nome;
    
    @Enumerated(EnumType.STRING)
    private @NotNull Uf uf;
    
    @OneToMany(mappedBy = "regiao")
    private @NonNull List<Cliente> clientes;

    @OneToMany(mappedBy = "regiao")
    private List<Representante> representantes;

    private @NotBlank String gerenteRegional;
    
    @Enumerated(EnumType.STRING)
    private @NotNull StatusRegiao status;

    // Método de consulta
    public boolean estaAtivo() {
        return status == StatusRegiao.NORMAL;
    }
}
