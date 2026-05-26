package org.company.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;

@Getter
@Setter(AccessLevel.NONE)
public class Pedido {
    
    private int id;
    private @NonNull Cliente cliente;
    private @NonNull Representante representante;
    private @NonNull LocalDate dataEmissao;
    private Optional<LocalDate> dataFaturamento;
    private @NonNull BigDecimal valorTotal;
    private @NonNull StatusPedido status;
}
