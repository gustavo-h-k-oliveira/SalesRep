package org.company.service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

import org.company.dto.AlertaDto;
import org.company.dto.ClientePerfilDto;
import org.company.dto.ClientePrioritarioDto;
import org.company.entity.Cliente;
import org.company.entity.Pedido;
import org.company.entity.Representante;
import org.company.entity.StatusCliente;
import org.company.repository.ClienteRepository;
import org.company.repository.PedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WhatsAppCommandService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final ClienteRepository clienteRepository;
    private final PedidoRepository pedidoRepository;
    private final ClienteAnalyticsService clienteAnalyticsService;
    private final AlertaService alertaService;

    public String executar(Representante representante, String comandoOriginal) {
        String comando = normalizarTexto(comandoOriginal);

        if (comando.equals("ajuda") || comando.equals("help") || comando.equals("menu")) {
            return ajuda();
        }
        if (comando.equals("resumo") || comando.equals("dashboard")) {
            return resumo(representante);
        }
        if (comando.equals("clientes inativos") || comando.equals("inativos")) {
            return clientesInativos(representante);
        }
        if (comando.equals("clientes prioritarios") || comando.equals("prioritarios")) {
            return clientesPrioritarios(representante);
        }
        if (comando.equals("alertas") || comando.equals("alertas pendentes")) {
            return alertas(representante);
        }
        if (comando.equals("pedidos recentes") || comando.equals("pedidos")) {
            return pedidosRecentes(representante);
        }
        if (comando.startsWith("cliente ")) {
            return cliente(representante, comandoOriginal.substring(comandoOriginal.toLowerCase(Locale.ROOT).indexOf("cliente") + 7).trim());
        }

        return "Não reconheci esse comando. Envie *ajuda* para ver as opções disponíveis.";
    }

    private String ajuda() {
        return "*SalesRep no WhatsApp*\n\n"
                + "Envie uma destas opções:\n"
                + "• *resumo*\n"
                + "• *clientes inativos*\n"
                + "• *clientes prioritários*\n"
                + "• *alertas*\n"
                + "• *pedidos recentes*\n"
                + "• *cliente nome*";
    }

    private String resumo(Representante representante) {
        Long representanteId = representante.getId();
        BigDecimal faturamento = pedidoRepository.sumFaturamentoTotalByRepresentanteId(representanteId);
        long ativos = clienteRepository.countByRepresentanteIdAndStatus(representanteId, StatusCliente.ATIVO);
        long inativos = clienteRepository.countByRepresentanteIdAndStatus(representanteId, StatusCliente.INATIVO);
        int alertas = alertaService.buscarAlertas(representanteId).size();

        return "*Resumo de " + representante.getNome() + "*\n\n"
                + "Faturamento: " + moeda(faturamento) + "\n"
                + "Clientes ativos: " + ativos + "\n"
                + "Clientes inativos: " + inativos + "\n"
                + "Alertas pendentes: " + alertas;
    }

    private String clientesInativos(Representante representante) {
        List<Cliente> clientes = clienteRepository.findTop10ByRepresentanteIdAndStatusOrderByUltimaCompraAsc(
                representante.getId(), StatusCliente.INATIVO);

        if (clientes.isEmpty()) {
            return "Não há clientes inativos na sua carteira.";
        }

        StringBuilder resposta = new StringBuilder("*Clientes inativos*\n\n");
        clientes.forEach(cliente -> resposta
                .append("• ").append(cliente.getNome())
                .append(" — ").append(cliente.getDiasSemCompra()).append(" dias sem compra\n"));
        return resposta.toString().trim();
    }

    private String clientesPrioritarios(Representante representante) {
        List<ClientePrioritarioDto> clientes = clienteAnalyticsService
                .buscarClientesPrioritarios(representante.getId()).stream()
                .limit(5)
                .toList();

        if (clientes.isEmpty()) {
            return "Não há clientes prioritários no momento.";
        }

        StringBuilder resposta = new StringBuilder("*Clientes prioritários*\n\n");
        clientes.forEach(cliente -> resposta
                .append("• ").append(cliente.getNome())
                .append(" — ").append(cliente.getDiasSemCompra()).append(" dias sem compra\n"));
        return resposta.toString().trim();
    }

    private String alertas(Representante representante) {
        List<AlertaDto> alertas = alertaService.buscarAlertas(representante.getId()).stream()
                .limit(8)
                .toList();

        if (alertas.isEmpty()) {
            return "Não há alertas pendentes no momento.";
        }

        StringBuilder resposta = new StringBuilder("*Alertas pendentes*\n\n");
        alertas.forEach(alerta -> resposta
                .append("• ").append(alerta.getDescricao()).append("\n"));
        return resposta.toString().trim();
    }

    private String pedidosRecentes(Representante representante) {
        List<Pedido> pedidos = pedidoRepository.findTop5ByRepresentanteIdOrderByDataEmissaoDescIdDesc(
                representante.getId());

        if (pedidos.isEmpty()) {
            return "Não há pedidos recentes na sua carteira.";
        }

        StringBuilder resposta = new StringBuilder("*Pedidos recentes*\n\n");
        pedidos.forEach(pedido -> resposta
                .append("• ").append(pedido.getCliente().getNome())
                .append(" — ").append(moeda(pedido.getValorTotal()))
                .append(" — ").append(pedido.getStatus().name())
                .append(" — ").append(pedido.getDataEmissao().format(DATE_FORMATTER)).append("\n"));
        return resposta.toString().trim();
    }

    private String cliente(Representante representante, String nomeInformado) {
        String nomeNormalizado = normalizarTexto(nomeInformado);
        if (nomeNormalizado.isBlank()) {
            return "Informe o nome do cliente. Exemplo: *cliente Loja Beta*";
        }

        List<Cliente> encontrados = clienteRepository.findByRepresentanteId(representante.getId()).stream()
                .filter(cliente -> normalizarTexto(cliente.getNome()).contains(nomeNormalizado))
                .limit(5)
                .toList();

        if (encontrados.isEmpty()) {
            return "Não encontrei esse cliente na sua carteira.";
        }
        if (encontrados.size() > 1) {
            StringBuilder resposta = new StringBuilder("Encontrei mais de um cliente. Seja mais específico:\n\n");
            encontrados.forEach(item -> resposta.append("• ").append(item.getNome()).append("\n"));
            return resposta.toString().trim();
        }

        ClientePerfilDto perfil = clienteAnalyticsService.buscarPerfil(encontrados.get(0).getId(), representante.getId());
        if (perfil == null) {
            return "Não consegui consultar o perfil desse cliente.";
        }

        return "*Cliente: " + perfil.getNome() + "*\n\n"
                + "Status: " + perfil.getStatus() + "\n"
                + "Última compra: " + perfil.getUltimaCompra().format(DATE_FORMATTER) + "\n"
                + "Dias sem compra: " + perfil.getDiasSemCompra() + "\n"
                + "Pedidos: " + perfil.getTotalPedidos() + "\n"
                + "Faturamento: " + moeda(perfil.getFaturamentoTotal());
    }

    private String moeda(BigDecimal valor) {
        return NumberFormat.getCurrencyInstance(Locale.forLanguageTag("pt-BR"))
                .format(valor == null ? BigDecimal.ZERO : valor);
    }

    private String normalizarTexto(String texto) {
        if (texto == null) {
            return "";
        }
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("\\s+", " ")
                .trim();
    }
}
