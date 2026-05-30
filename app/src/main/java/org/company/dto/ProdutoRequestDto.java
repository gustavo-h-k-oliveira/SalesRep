package org.company.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProdutoRequestDto {

    @NotBlank
    private String sku;

    @NotBlank
    private String descricao;
}
