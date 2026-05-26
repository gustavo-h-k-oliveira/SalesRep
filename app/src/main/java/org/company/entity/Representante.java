package org.company.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;

import java.util.List;

@Getter
@Setter(AccessLevel.NONE)
public class Representante {
    
    private int id;
    private @NonNull String nome;
    private @NonNull Regiao regiao;

    @Setter(AccessLevel.NONE)
    private @NonNull List<Cliente> carteira;

    public List<Cliente> getClientes() {
        return carteira == null ? List.of() : List.copyOf(carteira);
    }
}
