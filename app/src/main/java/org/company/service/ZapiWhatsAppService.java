package org.company.service;

import java.net.URI;
import java.util.Map;

import org.company.config.WhatsAppProperties;
import org.company.util.TelefoneUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ZapiWhatsAppService implements WhatsAppService {

    private final RestClient restClient;
    private final WhatsAppProperties properties;

    @Override
    public boolean estaConfigurado() {
        return properties.isEnabled()
                && isNotBlank(properties.getApiUrl())
                && isNotBlank(properties.getInstanceId())
                && isNotBlank(properties.getToken());
    }

    @Override
    public void mandarMensagem(String telefone, String mensagem) {
        if (!estaConfigurado()) {
            log.warn("Z-API desabilitada ou sem credenciais completas; mensagem não enviada");
            return;
        }

        String telefoneNormalizado = TelefoneUtils.normalizar(telefone);
        if (telefoneNormalizado.isBlank()) {
            log.warn("Mensagem WhatsApp não enviada: telefone inválido");
            return;
        }

        URI uri = UriComponentsBuilder.fromUriString(removeTrailingSlash(properties.getApiUrl()))
                .pathSegment("instances", properties.getInstanceId(), "token", properties.getToken(), "send-text")
                .build()
                .toUri();

        Map<String, String> body = Map.of(
                "phone", telefoneNormalizado,
                "message", mensagem);

        RestClient.RequestBodySpec spec = restClient.post()
                .uri(uri);

        if (isNotBlank(properties.getClientToken())) {
            spec.header("Client-Token", properties.getClientToken());
        }

        try {
            spec.body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception ex) {
            log.error("Erro ao enviar mensagem Z-API para {}: {}", telefoneNormalizado, ex.getMessage());
            throw new RuntimeException("Erro na comunicação com a Z-API: " + ex.getMessage(), ex);
        }
    }

    private String removeTrailingSlash(String value) {
        return value.replaceAll("/+$", "");
    }

    private boolean isNotBlank(String value) {
        return value != null && !value.isBlank();
    }
}
