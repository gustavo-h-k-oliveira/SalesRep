package org.company.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Estado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private @NotBlank String nome;

    @Enumerated(EnumType.STRING)
    private @NotNull Uf uf;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regiao_id")
    private @NotNull Regiao regiao;

    @Enumerated(EnumType.STRING)
    private @NotNull StatusRegiao status = StatusRegiao.NORMAL;

    @OneToMany(mappedBy = "estado")
    private List<Cliente> clientes;

    @OneToMany(mappedBy = "estado")
    private List<Representante> representantes;

    public boolean estaAtivo() {
        return status == StatusRegiao.NORMAL;
    }
}
