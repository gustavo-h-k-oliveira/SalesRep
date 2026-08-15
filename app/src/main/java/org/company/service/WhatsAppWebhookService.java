package org.company.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.company.config.WhatsAppProperties;
import org.company.dto.ZapiReceivedMessage;
import org.company.entity.Representante;
import org.company.entity.WhatsAppConsulta;
import org.company.repository.RepresentanteRepository;
import org.company.repository.WhatsAppConsultaRepository;
import org.company.util.TelefoneUtils;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WhatsAppWebhookService {

    private final WhatsAppProperties properties;
    private final RepresentanteRepository representanteRepository;
    private final WhatsAppConsultaRepository consultaRepository;
    private final WhatsAppCommandService commandService;
    private final WhatsAppService whatsAppService;

    public void processar(ZapiReceivedMessage payload) {
        if (payload == null || isBlank(payload.phone()) || isBlank(payload.messageId())) {
            return;
        }
        if (Boolean.TRUE.equals(payload.fromMe()) || Boolean.TRUE.equals(payload.isGroup())) {
            return;
        }
        if (!isBlank(payload.instanceId())
                && !isBlank(properties.getInstanceId())
                && !properties.getInstanceId().equals(payload.instanceId())) {
            log.warn("Webhook Z-API recebido para instância diferente da configurada");
            return;
        }
        if (payload.text() == null || isBlank(payload.text().message())) {
            return;
        }
        if (consultaRepository.existsByMessageId(payload.messageId())) {
            return;
        }

        String telefone = TelefoneUtils.normalizar(payload.phone());
        Optional<Representante> representante = encontrarRepresentante(telefone);
        WhatsAppConsulta consulta = novaConsulta(payload, telefone, representante.orElse(null));

        try {
            String resposta = representante
                    .map(item -> commandService.executar(item, payload.text().message()))
                    .orElse("Seu número não está associado a um representante do SalesRep.");

            if (!whatsAppService.estaConfigurado()) {
                consulta.setStatus("CONFIGURACAO_PENDENTE");
                log.warn("Webhook Z-API recebido, mas a integração está sem configuração completa");
                return;
            }

            whatsAppService.mandarMensagem(telefone, resposta);
            consulta.setStatus(representante.isPresent() ? "ENVIADA" : "NEGADA_ENVIADA");
        } catch (RuntimeException ex) {
            consulta.setStatus("ERRO");
            log.error("Erro ao processar mensagem WhatsApp {}", payload.messageId(), ex);
        } finally {
            consultaRepository.save(consulta);
        }
    }

    private Optional<Representante> encontrarRepresentante(String telefone) {
        return representanteRepository.findAll().stream()
                .filter(item -> {
                    String telRep = TelefoneUtils.normalizar(item.getTelefone());
                    if (telRep.isBlank()) return false;
                    return telefone.equals(telRep) || telefone.endsWith(telRep) || telRep.endsWith(telefone);
                })
                .findFirst();
    }

    private WhatsAppConsulta novaConsulta(
            ZapiReceivedMessage payload,
            String telefone,
            Representante representante) {
        WhatsAppConsulta consulta = new WhatsAppConsulta();
        consulta.setMessageId(payload.messageId());
        consulta.setTelefone(telefone);
        consulta.setRepresentanteId(representante != null ? representante.getId() : null);
        consulta.setComando(payload.text().message());
        consulta.setStatus("RECEBIDA");
        consulta.setDataHora(LocalDateTime.now());
        return consulta;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
