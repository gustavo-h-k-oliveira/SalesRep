package org.company.service;

import org.company.entity.Pedido;

import java.time.LocalDate;
import java.util.List;

import org.company.entity.StatusPedido;
import org.company.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PedidoService {
    
    private final PedidoRepository pedidoRepository; 

    // Métodos de consulta
    public List<Pedido> encontrarTodos() {
        return pedidoRepository.findAll();
    }

    public Pedido encontrarPorId(Long id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    public List<Pedido> encontrarPorCliente(Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId);
    }

    public List<Pedido> encontrarPorRepresentante(Long representanteId) {
        return pedidoRepository.findByRepresentanteId(representanteId);
    }

    public List<Pedido> encontrarPorStatus(StatusPedido status) {
        return pedidoRepository.findByStatus(status);
    }

    public List<Pedido> encontrarFaturados() {
        return pedidoRepository.findByStatus(StatusPedido.FATURADO);
    }

    public List<Pedido> encontrarPedidosNaoFaturados() {
        return pedidoRepository.findByStatusNot(StatusPedido.FATURADO);
    }

    public List<Pedido> encontrarPedidosPorPeriodo(LocalDate inicio, LocalDate fim) {
        return pedidoRepository.findByDataEmissaoBetween(inicio, fim);
    }

    // Métodos de manipulação
    public Pedido salvar(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    public void deletar(Long id) {
        pedidoRepository.deleteById(id);
    }
}
