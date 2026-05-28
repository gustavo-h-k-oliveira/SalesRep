package org.company.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.company.analytics.ProdutoAnalytics;
import org.company.analytics.RegiaoAnalytics;
import org.company.dto.AlertaDto;
import org.company.entity.CriticidadeAlerta;
import org.company.entity.Cliente;
import org.company.entity.StatusAlerta;
import org.company.entity.TipoAlerta;
import org.company.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AlertaService {

    private final ClienteRepository clienteRepository;
    private final WhatsAppService whatsAppService;
    private final RegiaoAnalytics regiaoAnalytics;
    private final ProdutoAnalytics produtoAnalytics;

    public void processarClienteInativo() {
        LocalDate dataLimite = LocalDate.now().minusDays(45);
        List<Cliente> clientesInativos = clienteRepository.findByUltimaCompraBefore(dataLimite);

        for (Cliente cliente : clientesInativos) {
            var representante = cliente.getRepresentante();
            if (representante != null) {
                String telefone = representante.getTelefone();
                if (telefone != null && !telefone.isBlank()) {
                    whatsAppService.mandarMensagem(
                        telefone,
                        "Cliente inativo: " + cliente.getNome()
                    );
                }
            }
        }
    }

    public List<AlertaDto> buscarAlertas() {
        List<AlertaDto> alertas = new ArrayList<>();
        alertas.addAll(buscarAlertasClientesInativos());
        alertas.addAll(buscarAlertasRegioesCriticas());
        alertas.addAll(buscarAlertasProdutosCriticos());
        return alertas;
    }

    private List<AlertaDto> buscarAlertasClientesInativos() {
        LocalDate dataLimite = LocalDate.now().minusDays(45);
        List<Cliente> clientesInativos = clienteRepository.findByUltimaCompraBefore(dataLimite);

        List<AlertaDto> alertas = new ArrayList<>();
        for (Cliente cliente : clientesInativos) {
            alertas.add(new AlertaDto(
                TipoAlerta.CLIENTE_INATIVO,
                CriticidadeAlerta.MEDIA,
                "Cliente sem compra há mais de 45 dias: " + cliente.getNome(),
                StatusAlerta.PENDENTE,
                cliente.getId(),
                cliente.getNome(),
                LocalDateTime.now()
            ));
        }
        return alertas;
    }

    private List<AlertaDto> buscarAlertasRegioesCriticas() {
        List<String> regioes = regiaoAnalytics.buscarRegioesCriticas();
        List<AlertaDto> alertas = new ArrayList<>();
        for (String regiao : regioes) {
            alertas.add(new AlertaDto(
                TipoAlerta.REGIAO_CRITICA,
                CriticidadeAlerta.ALTA,
                "Região em queda de faturamento: " + regiao,
                StatusAlerta.PENDENTE,
                null,
                null,
                LocalDateTime.now()
            ));
        }
        return alertas;
    }

    private List<AlertaDto> buscarAlertasProdutosCriticos() {
        List<String> produtos = produtoAnalytics.buscarProdutosComBaixaRecompra();
        List<AlertaDto> alertas = new ArrayList<>();
        for (String produto : produtos) {
            alertas.add(new AlertaDto(
                TipoAlerta.PRODUTO_BAIXA_RECOMPRA,
                CriticidadeAlerta.MEDIA,
                "Produto com baixa recompra: " + produto,
                StatusAlerta.PENDENTE,
                null,
                null,
                LocalDateTime.now()
            ));
        }
        return alertas;
    }
}
