package org.company.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;

@Getter
@Setter(AccessLevel.NONE)
public class Regiao {

    private int id;
    private @NonNull String nome;
    private @NonNull Uf uf;
    private @NonNull String gerenteRegional;
    private @NonNull StatusRegiao status;

    // Método de consulta
    public boolean estaAtivo() {
        return status == StatusRegiao.NORMAL;
    }
}
