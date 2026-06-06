package org.company.service;

import java.math.BigDecimal;
import java.util.List;

import org.company.analytics.ProdutoAnalytics;
import org.company.entity.PedidoItem;
import org.company.entity.Produto;
import org.company.repository.PedidoItemRepository;
import org.company.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProdutoService {
    
    private final ProdutoRepository produtoRepository;

    private final PedidoItemRepository pedidoItemRepository;

    private final ProdutoAnalytics produtoAnalytics;

    // Métodos de consulta
    public List<Produto> encontrarTodos() {
        return produtoRepository.findAll();
    }

    public List<Produto> encontrarPorRepresentante(Long representanteId) {
        if (representanteId == null) {
            return produtoRepository.findAll();
        }
        return produtoRepository.findDistinctByRepresentanteId(representanteId);
    }

    public Produto encontrarPorId(Long id) {
        return produtoRepository.findById(id).orElse(null);
    }

    public Produto encontrarPorSku(String sku) {
        return produtoRepository.findBySku(sku).orElse(null);
    }

    public List<PedidoItem> encontrarItensPorProduto(Long produtoId) {
        return pedidoItemRepository.findByProdutoId(produtoId);
    }

    // Métodos de manipulação
    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    public void deletar(Long id) {
        produtoRepository.deleteById(id);
    }

    // Método de cálculo
    public BigDecimal calcularFaturamentoPorSku(Long produtoId) {
        return produtoAnalytics.calcularFaturamentoPorSku(produtoId);
    }

    public java.util.List<String> buscarProdutosCriticos() {
        return produtoAnalytics.buscarProdutosComBaixaRecompra();
    }

    public java.util.List<String> buscarProdutosCriticos(Long representanteId) {
        return produtoAnalytics.buscarProdutosComBaixaRecompra(representanteId);
    }

    public java.util.List<Produto> buscarProdutosCriticosProduto() {
        return produtoAnalytics.buscarProdutosComBaixaRecompraProduto();
    }

    public java.util.List<Produto> buscarProdutosCriticosProduto(Long representanteId) {
        return produtoAnalytics.buscarProdutosComBaixaRecompraProduto(representanteId);
    }
}

