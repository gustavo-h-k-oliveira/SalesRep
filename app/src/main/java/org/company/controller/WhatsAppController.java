package org.company.controller;

import java.util.Map;
import org.company.dto.ZapiReceivedMessage;
import org.company.dto.WhatsAppTesteRequest;
import org.company.service.WhatsAppService;
import org.company.service.WhatsAppWebhookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import java.util.List;
import org.company.dto.AlertaDto;
import org.company.entity.Representante;
import org.company.repository.RepresentanteRepository;
import org.company.service.AlertaService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/whatsapp")
@RequiredArgsConstructor
public class WhatsAppController {
    
    private final WhatsAppService whatsAppService;
    private final WhatsAppWebhookService whatsAppWebhookService;
    private final AlertaService alertaService;
    private final RepresentanteRepository representanteRepository;

    @PostMapping("/teste")
    public ResponseEntity<?> teste(@Valid @RequestBody WhatsAppTesteRequest request) {
        if (!whatsAppService.estaConfigurado()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of(
                            "status", "erro",
                            "mensagem", "Z-API desabilitada ou não configurada no application.properties (verifique whatsapp.enabled, whatsapp.instance-id e whatsapp.token)"
                    ));
        }
        try {
            whatsAppService.mandarMensagem(request.telefone(), request.mensagem());
            return ResponseEntity.ok(Map.of(
                    "status", "sucesso",
                    "mensagem", "Mensagem enviada com sucesso para " + request.telefone()
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of(
                            "status", "erro",
                            "mensagem", "Erro na chamada Z-API: " + ex.getMessage()
                    ));
        }
    }

    @PreAuthorize("hasRole('GESTOR')")
    @PostMapping("/enviar-alertas/{representanteId}")
    public ResponseEntity<?> enviarAlertasRepresentante(@PathVariable Long representanteId) {
        Representante representante = representanteRepository.findById(representanteId).orElse(null);
        if (representante == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "erro", "mensagem", "Representante não encontrado ID: " + representanteId));
        }
        if (representante.getTelefone() == null || representante.getTelefone().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "erro", "mensagem", "Representante " + representante.getNome() + " não possui telefone cadastrado"));
        }
        if (!whatsAppService.estaConfigurado()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("status", "erro", "mensagem", "Z-API desabilitada ou não configurada (verifique whatsapp.enabled, whatsapp.instance-id e whatsapp.token)"));
        }

        List<AlertaDto> alertas = alertaService.buscarAlertas(representanteId);
        if (alertas.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "status", "sucesso",
                    "mensagem", "Nenhum alerta pendente para " + representante.getNome(),
                    "totalAlertas", 0
            ));
        }

        StringBuilder mensagem = new StringBuilder("⚠️ *Alertas da Carteira - Sagra Analytics*\n\n");
        mensagem.append("Olá, *").append(representante.getNome()).append("*!\n");
        mensagem.append("Identificamos os seguintes alertas pendentes na sua carteira:\n\n");

        for (AlertaDto alerta : alertas) {
            mensagem.append("• ").append(alerta.getDescricao()).append("\n");
        }

        mensagem.append("\nAcesse o painel do Sagra Analytics para atuar nesses pontos!");

        try {
            whatsAppService.mandarMensagem(representante.getTelefone(), mensagem.toString());
            return ResponseEntity.ok(Map.of(
                    "status", "sucesso",
                    "mensagem", "Alertas enviados para " + representante.getNome() + " (" + representante.getTelefone() + ")",
                    "totalAlertas", alertas.size()
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("status", "erro", "mensagem", "Erro Z-API: " + ex.getMessage()));
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> receberWebhook(@RequestBody ZapiReceivedMessage payload) {
        whatsAppWebhookService.processar(payload);
        return ResponseEntity.ok().build();
    }
}
