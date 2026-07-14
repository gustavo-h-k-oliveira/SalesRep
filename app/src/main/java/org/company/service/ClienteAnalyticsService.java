package org.company.service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.math.BigDecimal;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;

import org.company.analytics.ClienteAnalytics;
import org.company.analytics.ProdutoAnalytics;
import org.company.dto.ClientePerfilDto;
import org.company.dto.ClientePrioritarioDto;
import org.company.dto.ProdutoRecomendadoDto;
import org.company.entity.Cliente;
import org.company.entity.Pedido;
import org.company.entity.PedidoItem;
import org.company.entity.StatusPedido;
import org.company.entity.Produto;
import org.company.mapper.ClienteDtoMapper;
import org.company.repository.ClienteRepository;
import org.company.repository.PedidoRepository;
import org.company.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteAnalyticsService {

    private final ClienteRepository clienteRepository;
    private final ClienteAnalytics clienteAnalytics;
    private final ClienteDtoMapper clienteDtoMapper;
    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;
    private final ProdutoAnalytics produtoAnalytics;

    public List<ClientePrioritarioDto> buscarClientesPrioritarios() {
        return buscarClientesPrioritarios(null);
    }

    public List<ClientePrioritarioDto> buscarClientesPrioritarios(Long representanteId) {
        return (representanteId == null
            ? clienteRepository.findAll()
            : clienteRepository.findByRepresentanteId(representanteId)).stream()
            .map(cliente -> new ClienteScore(cliente, clienteAnalytics.calcularScore(cliente)))
            .sorted(Comparator.comparingDouble((ClienteScore clienteScore) -> clienteScore.score).reversed())
            .map(clienteScore -> clienteDtoMapper.toClientePrioritarioDto(
                clienteScore.cliente,
                clienteScore.score,
                clienteAnalytics.calcularTicketMedio(clienteScore.cliente),
                clienteAnalytics.calcularTotalPedidos(clienteScore.cliente)
            ))
            .collect(Collectors.toList());
    }

    public ClientePerfilDto buscarPerfil(Long clienteId, Long representanteId) {
        return clienteRepository.findById(clienteId)
            .filter(cliente -> representanteId == null || (cliente.getRepresentante() != null && representanteId.equals(cliente.getRepresentante().getId())))
            .map(cliente -> clienteDtoMapper.toClientePerfilDto(
                cliente,
                clienteAnalytics.calcularTicketMedio(cliente),
                clienteAnalytics.calcularTotalPedidos(cliente),
                clienteAnalytics.calcularFaturamentoTotal(cliente)
            ))
            .orElse(null);
    }

    public ClientePerfilDto buscarPerfil(Long clienteId) {
        
        return clienteRepository.findById(clienteId)
            .map(cliente -> clienteDtoMapper.toClientePerfilDto(
                cliente,
                clienteAnalytics.calcularTicketMedio(cliente),
                clienteAnalytics.calcularTotalPedidos(cliente),
                clienteAnalytics.calcularFaturamentoTotal(cliente)
            ))
            .orElse(null);
    }

    public List<ProdutoRecomendadoDto> obterRecomendacoes(Long clienteId, Long representanteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
            .filter(c -> representanteId == null || (c.getRepresentante() != null && representanteId.equals(c.getRepresentante().getId())))
            .orElse(null);
            
        if (cliente == null) {
            return List.of();
        }

        // 1. Obter histórico de compras do cliente (pedidos faturados)
        List<Pedido> pedidos = pedidoRepository.findByClienteId(clienteId);
        List<PedidoItem> itensComprados = pedidos.stream()
            .filter(p -> p.getStatus() == StatusPedido.FATURADO)
            .filter(p -> p.getItens() != null)
            .flatMap(p -> p.getItens().stream())
            .toList();

        // Mapear última data de compra por produto
        Map<Produto, LocalDate> ultimaCompraPorProduto = new HashMap<>();
        for (PedidoItem item : itensComprados) {
            Produto produto = item.getProduto();
            LocalDate data = item.getPedido().getDataEmissao();
            LocalDate dataExistente = ultimaCompraPorProduto.get(produto);
            if (dataExistente == null || data.isAfter(dataExistente)) {
                ultimaCompraPorProduto.put(produto, data);
            }
        }

        List<ProdutoRecomendadoDto> recomendacoes = new ArrayList<>();
        Set<Long> recomendadosIds = new HashSet<>();

        Long repId = cliente.getRepresentante() != null ? cliente.getRepresentante().getId() : null;

        // --- SLOT 1: Queda de Recompra na Região ---
        List<Produto> produtosCriticos = produtoAnalytics.buscarProdutosComBaixaRecompraProduto(repId);
        Produto produtoSlot1 = null;
        String justificativaSlot1 = "";

        // Tenta encontrar um produto crítico que o cliente já comprou
        for (Produto p : produtosCriticos) {
            if (ultimaCompraPorProduto.containsKey(p)) {
                produtoSlot1 = p;
                justificativaSlot1 = "Queda de recompra detectada para este item na sua região.";
                break;
            }
        }
        // Se não encontrar nenhum comprado, pega o primeiro crítico geral da lista
        if (produtoSlot1 == null && !produtosCriticos.isEmpty()) {
            produtoSlot1 = produtosCriticos.get(0);
            justificativaSlot1 = "Queda de recompra na região (Oportunidade de introdução).";
        }
        
        if (produtoSlot1 != null) {
            recomendacoes.add(new ProdutoRecomendadoDto(
                produtoSlot1.getId(),
                produtoSlot1.getSku(),
                produtoSlot1.getDescricao(),
                justificativaSlot1
            ));
            recomendadosIds.add(produtoSlot1.getId());
        }

        // --- SLOT 2: Item Crítico no Estoque (Recompra Atrasada) ---
        Produto produtoSlot2 = null;
        long maxDiasSemCompra = -1;

        // Encontra o produto comprado anteriormente há mais tempo
        for (Map.Entry<Produto, LocalDate> entry : ultimaCompraPorProduto.entrySet()) {
            Produto p = entry.getKey();
            if (recomendadosIds.contains(p.getId())) {
                continue;
            }
            long dias = ChronoUnit.DAYS.between(entry.getValue(), LocalDate.now());
            if (dias > maxDiasSemCompra) {
                maxDiasSemCompra = dias;
                produtoSlot2 = p;
            }
        }

        if (produtoSlot2 != null) {
            recomendacoes.add(new ProdutoRecomendadoDto(
                produtoSlot2.getId(),
                produtoSlot2.getSku(),
                produtoSlot2.getDescricao(),
                "Item crítico no estoque (última compra há " + maxDiasSemCompra + " dias)."
            ));
            recomendadosIds.add(produtoSlot2.getId());
        }

        // --- SLOT 3: Completar Ticket Médio (Cross-Selling) ---
        // Pegar produtos com maior faturamento que o cliente nunca comprou
        Map<Long, BigDecimal> faturamentos = produtoAnalytics.obterFaturamentosDosProdutos(repId);
        List<Produto> todosProdutos = produtoRepository.findAll();
        
        List<Produto> ordenadosPorFaturamento = todosProdutos.stream()
            .filter(p -> !recomendadosIds.contains(p.getId()))
            .sorted((p1, p2) -> {
                BigDecimal f1 = faturamentos.getOrDefault(p1.getId(), BigDecimal.ZERO);
                BigDecimal f2 = faturamentos.getOrDefault(p2.getId(), BigDecimal.ZERO);
                return f2.compareTo(f1); // Decrescente
            })
            .toList();

        Produto produtoSlot3 = null;
        String justificativaSlot3 = "Sugerido para completar ticket médio (alto faturamento na região).";

        // Primeiro tenta encontrar um produto que o cliente nunca comprou
        for (Produto p : ordenadosPorFaturamento) {
            if (!ultimaCompraPorProduto.containsKey(p)) {
                produtoSlot3 = p;
                break;
            }
        }
        
        // Fallback: se o cliente já comprou tudo, pega qualquer outro produto ordenado por faturamento
        if (produtoSlot3 == null && !ordenadosPorFaturamento.isEmpty()) {
            produtoSlot3 = ordenadosPorFaturamento.get(0);
            justificativaSlot3 = "Sugerido para complementar o pedido e aumentar volume.";
        }

        if (produtoSlot3 != null) {
            recomendacoes.add(new ProdutoRecomendadoDto(
                produtoSlot3.getId(),
                produtoSlot3.getSku(),
                produtoSlot3.getDescricao(),
                justificativaSlot3
            ));
            recomendadosIds.add(produtoSlot3.getId());
        }

        // Preenche com produtos genéricos se ainda não tiver 3 recomendações (por exemplo, banco quase vazio)
        if (recomendacoes.size() < 3) {
            for (Produto p : todosProdutos) {
                if (recomendacoes.size() >= 3) break;
                if (!recomendadosIds.contains(p.getId())) {
                    recomendacoes.add(new ProdutoRecomendadoDto(
                        p.getId(),
                        p.getSku(),
                        p.getDescricao(),
                        "Recomendado para diversificação do mix."
                    ));
                    recomendadosIds.add(p.getId());
                }
            }
        }

        return recomendacoes;
    }

    private record ClienteScore(Cliente cliente, double score) {}
}
