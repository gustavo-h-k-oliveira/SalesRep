package org.company.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Produto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private @NotBlank String sku;
    
    private @NotBlank String descricao;

    private String grupo;

    private Boolean sazonal;

    private Integer mesInicioSazonalidade;

    private Integer mesFimSazonalidade;

    public Boolean getSazonal() {
        return sazonal;
    }

    public void setSazonal(Boolean sazonal) {
        this.sazonal = sazonal;
    }

    public Integer getMesInicioSazonalidade() {
        return mesInicioSazonalidade;
    }

    public void setMesInicioSazonalidade(Integer mesInicioSazonalidade) {
        this.mesInicioSazonalidade = mesInicioSazonalidade;
    }

    public Integer getMesFimSazonalidade() {
        return mesFimSazonalidade;
    }

    public void setMesFimSazonalidade(Integer mesFimSazonalidade) {
        this.mesFimSazonalidade = mesFimSazonalidade;
    }

    @OneToMany(mappedBy = "produto")
    private List<PedidoItem> itens;
}
