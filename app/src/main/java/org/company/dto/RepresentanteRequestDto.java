package org.company.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RepresentanteRequestDto {

    @NotBlank
    private String nome;

    private Long estadoId;

    private Long regiaoId;

    private String cpfCnpj;

    private String email;

    private String telefone;
}
