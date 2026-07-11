package org.company.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDto {
    
    @NotBlank
    private String nomeUsuario;

    @NotBlank
    private String senha;

    private Boolean lembreMe;
}
