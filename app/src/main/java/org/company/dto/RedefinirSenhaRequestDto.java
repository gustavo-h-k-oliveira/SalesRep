package org.company.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RedefinirSenhaRequestDto {

    @NotBlank(message = "O token é obrigatório")
    private String token;

    @NotBlank(message = "A nova senha é obrigatória")
    private String novaSenha;
}
