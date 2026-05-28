package org.company.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RepresentanteRequestDto {

    @NotBlank
    private String nome;

    @NotNull
    private Long regiaoId;

    @NotBlank
    private String telefone;
}
