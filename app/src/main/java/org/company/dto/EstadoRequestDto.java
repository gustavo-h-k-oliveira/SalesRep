package org.company.dto;

import org.company.entity.StatusRegiao;
import org.company.entity.Uf;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EstadoRequestDto {

    @NotBlank
    private String nome;

    @NotNull
    private Uf uf;

    @NotNull
    private Long regiaoId;

    @NotNull
    private StatusRegiao status;
}
