package org.company.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.company.config.WhatsAppProperties;
import org.company.dto.ZapiReceivedMessage;
import org.company.dto.ZapiTextPayload;
import org.company.entity.Regiao;
import org.company.entity.Representante;
import org.company.entity.WhatsAppConsulta;
import org.company.repository.RepresentanteRepository;
import org.company.repository.WhatsAppConsultaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class WhatsAppWebhookServiceTest {

    @Mock
    private WhatsAppProperties properties;

    @Mock
    private RepresentanteRepository representanteRepository;

    @Mock
    private WhatsAppConsultaRepository consultaRepository;

    @Mock
    private WhatsAppCommandService commandService;

    @Mock
    private WhatsAppService whatsAppService;

    @InjectMocks
    private WhatsAppWebhookService whatsAppWebhookService;

    private Representante gustavoOliveira;

    @BeforeEach
    void setUp() {
        Regiao regiao = new Regiao();
        regiao.setId(1L);
        regiao.setNome("Sudeste");

        gustavoOliveira = new Representante();
        gustavoOliveira.setId(999L);
        gustavoOliveira.setNome("Gustavo Oliveira");
        gustavoOliveira.setTelefone("(14) 98170-4947");
        gustavoOliveira.setRegiao(regiao);
    }

    @Test
    void processar_mensagemGustavoOliveira_deveExecutarComandoEMandarResposta() {
        String phone = "5514981704947";
        String messageId = "msg-gustavo-001";
        String comandoTexto = "resumo";
        String respostaEsperada = "*Resumo de Gustavo Oliveira*\nFaturamento: R$ 100.000,00";

        ZapiReceivedMessage payload = new ZapiReceivedMessage(
                "instancia-123",
                messageId,
                phone,
                false,
                false,
                "text",
                new ZapiTextPayload(comandoTexto)
        );

        when(consultaRepository.existsByMessageId(messageId)).thenReturn(false);
        when(representanteRepository.findAll()).thenReturn(List.of(gustavoOliveira));
        when(commandService.executar(gustavoOliveira, comandoTexto)).thenReturn(respostaEsperada);
        when(whatsAppService.estaConfigurado()).thenReturn(true);

        whatsAppWebhookService.processar(payload);

        verify(whatsAppService).mandarMensagem(eq("5514981704947"), eq(respostaEsperada));
        verify(consultaRepository).save(any(WhatsAppConsulta.class));
    }

    @Test
    void processar_mensagemWagner_deveExecutarComandoEMandarResposta() {
        Representante wagner = new Representante();
        wagner.setId(998L);
        wagner.setNome("Wagner");
        wagner.setTelefone("+55 14 99721-0485");

        String phone = "5514997210485";
        String messageId = "msg-wagner-001";
        String comandoTexto = "alertas";
        String respostaEsperada = "*Alertas pendentes*\n• Cliente sem compra há mais de 45 dias: Supermercado Wagner & Cia";

        ZapiReceivedMessage payload = new ZapiReceivedMessage(
                "instancia-123",
                messageId,
                phone,
                false,
                false,
                "text",
                new ZapiTextPayload(comandoTexto)
        );

        when(consultaRepository.existsByMessageId(messageId)).thenReturn(false);
        when(representanteRepository.findAll()).thenReturn(List.of(wagner));
        when(commandService.executar(wagner, comandoTexto)).thenReturn(respostaEsperada);
        when(whatsAppService.estaConfigurado()).thenReturn(true);

        whatsAppWebhookService.processar(payload);

        verify(whatsAppService).mandarMensagem(eq("5514997210485"), eq(respostaEsperada));
        verify(consultaRepository).save(any(WhatsAppConsulta.class));
    }

    @Test
    void processar_mensagemVitorStudzieski_deveExecutarComandoEMandarResposta() {
        Representante vitor = new Representante();
        vitor.setId(997L);
        vitor.setNome("Vitor Studzieski");
        vitor.setTelefone("14 99778-7717");

        String phone = "5514997787717";
        String messageId = "msg-vitor-001";
        String comandoTexto = "clientes inativos";
        String respostaEsperada = "*Clientes inativos*\n• Comercial Alimentos Studzieski — 110 dias sem compra\n• Empório & Mercearia Central — 80 dias sem compra\n• Supermercado Nova Esperança — 55 dias sem compra";

        ZapiReceivedMessage payload = new ZapiReceivedMessage(
                "instancia-123",
                messageId,
                phone,
                false,
                false,
                "text",
                new ZapiTextPayload(comandoTexto)
        );

        when(consultaRepository.existsByMessageId(messageId)).thenReturn(false);
        when(representanteRepository.findAll()).thenReturn(List.of(vitor));
        when(commandService.executar(vitor, comandoTexto)).thenReturn(respostaEsperada);
        when(whatsAppService.estaConfigurado()).thenReturn(true);

        whatsAppWebhookService.processar(payload);

        verify(whatsAppService).mandarMensagem(eq("5514997787717"), eq(respostaEsperada));
        verify(consultaRepository).save(any(WhatsAppConsulta.class));
    }
}
