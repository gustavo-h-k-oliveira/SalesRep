package org.company.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;

@Getter
@Setter(AccessLevel.NONE)
public class Produto {
    
    private int id;
    private @NonNull String sku;
    private @NonNull String descricao;
}
