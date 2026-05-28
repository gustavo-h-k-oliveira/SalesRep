package org.company.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MetaWhatsAppService implements WhatsAppService {
    
    private final RestClient restClient;

    @Value("${whatsapp.api.url}")
    private String apiUrl;

    @Value("${whatsapp.phone-number-id}")
    private String numeroTelefoneId;

    @Value("${whatsapp.access-token}")
    private String tokenAcesso;

    @Override
    public void mandarMensagem(String telefone, String mensagem) {

        Map<String, Object> body = Map.of(
            "messaging_product", "whatsapp",
            "to", telefone,
            "type", "text",
            "text", Map.of(
                "body", mensagem
            )
        );

        restClient.post()
            .uri(apiUrl + "/" + numeroTelefoneId + "/messages")
            .header("Authorization", "Bearer " + tokenAcesso)
            .header("Content-Type", "application/json")
            .body(body)
            .retrieve()
            .toBodilessEntity();
    }
}
