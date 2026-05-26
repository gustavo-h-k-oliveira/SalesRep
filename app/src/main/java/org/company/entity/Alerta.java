package org.company.entity;

import java.time.LocalDate;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;

@Getter
@Setter(AccessLevel.NONE)
public class Alerta {

    private int id;
    private @NonNull TipoAlerta tipo;
    private @NonNull CriticidadeAlerta criticidade;
    private @NonNull String descricao;
    private @NonNull LocalDate dataGeracao;
}
