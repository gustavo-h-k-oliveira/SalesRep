package org.company.entity;

import java.time.LocalDate;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;

@Getter
@Setter(AccessLevel.NONE)
public class Cliente {
    
    private int id;
    private @NonNull String nome;
    private @NonNull Regiao regiao;
    private @NonNull Representante representante;
    private @NonNull LocalDate ultimaCompra;
    private @NonNull StatusCliente status;
}
