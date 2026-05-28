package org.company.dto;

import java.time.LocalDate;

import org.company.entity.StatusCliente;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClienteRequestDto {

    @NotBlank
    private String nome;

    @NotNull
    private Long regiaoId;

    @NotNull
    private Long representanteId;

    @NotNull
    private LocalDate ultimaCompra;

    @NotNull
    private StatusCliente status;
}
