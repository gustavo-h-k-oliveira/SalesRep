package org.company.service;

import java.util.List;

import org.company.entity.PedidoItem;
import org.company.repository.PedidoItemRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PedidoItemService {
    
    private final PedidoItemRepository pedidoItemRepository;

    // Métodos de consulta
    public List<PedidoItem> encontrarTodos() {
        return pedidoItemRepository.findAll();
    }

    public PedidoItem encontrarPorId(Long id) {
        return pedidoItemRepository.findById(id).orElse(null);
    }

    public List<PedidoItem> encontrarPorPedido(Long pedidoId) {
        return pedidoItemRepository.findByPedidoId(pedidoId);
    }

    public List<PedidoItem> encontrarPorProduto(Long produtoId) {
        return pedidoItemRepository.findByProdutoId(produtoId);
    }

    // Métodos de manipulação
    public PedidoItem salvar(PedidoItem item) {
        return pedidoItemRepository.save(item);
    }

    public void deletar(Long id) {
        pedidoItemRepository.deleteById(id);
    }
}
