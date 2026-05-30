package org.company.dto;

import org.company.entity.StatusRegiao;
import org.company.entity.Uf;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegiaoRequestDto {

    @NotBlank
    private String nome;

    @NotNull
    private Uf uf;

    @NotBlank
    private String gerenteRegional;

    @NotNull
    private StatusRegiao status;
}
