package org.company.service;

import java.util.List;

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

    // Métodos de consulta
    public List<Produto> encontrarTodos() {
        return produtoRepository.findAll();
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
}
