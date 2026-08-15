package org.company.dto;

import jakarta.validation.constraints.NotBlank;

public record WhatsAppTesteRequest(
        @NotBlank String telefone,
        @NotBlank String mensagem) {
}
