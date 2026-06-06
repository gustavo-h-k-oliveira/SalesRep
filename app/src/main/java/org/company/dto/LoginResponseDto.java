package org.company.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDto {
    
    @NotBlank
    private String token;

    private Long representanteId;
}
