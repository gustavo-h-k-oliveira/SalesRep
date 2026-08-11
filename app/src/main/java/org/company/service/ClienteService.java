package org.company.service;

import java.util.ArrayList;
import java.util.List;

import org.company.entity.Cliente;
import org.company.entity.StatusCliente;
import org.company.repository.ClienteRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClienteService {
    
    private final ClienteRepository clienteRepository;

    // Métodos de consulta
    @Transactional
    public Page<Cliente> encontrarTodos(Pageable paginacao) {
        atualizarStatusDeTodos();
        return clienteRepository.findAll(paginacao);
    }

    @Transactional
    public Cliente encontrarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id).orElse(null);
        if (cliente != null) {
            atualizarStatusPorUltimaCompra(cliente);
        }
        return cliente;
    }

    @Transactional
    public List<Cliente> encontrarInativos() {
        atualizarStatusDeTodos();
        return clienteRepository.findByStatus(StatusCliente.INATIVO);
    }

    @Transactional
    public List<Cliente> encontrarPorRegiao(Long regiaoId) {
        atualizarStatusDeTodos();
        return clienteRepository.findByRegiaoId(regiaoId);
    }

    @Transactional
    public List<Cliente> encontrarPorRepresentante(Long representanteId) {
        atualizarStatusDeTodos();
        return clienteRepository.findByRepresentanteId(representanteId);
    }

    @Transactional
    public List<Cliente> encontrarPorStatus(StatusCliente status) {
        atualizarStatusDeTodos();
        return clienteRepository.findByStatus(status);
    }

    // Métodos de manipulação
    @Transactional
    public Cliente salvar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Transactional
    public void deletar(Long id) {
        clienteRepository.deleteById(id);
    }

    @Transactional
    public void atualizarStatusPorUltimaCompra(Cliente cliente) {
        StatusCliente statusAnterior = cliente.getStatus();
        cliente.atualizarStatusPorUltimaCompra();
        if (cliente.getStatus() != statusAnterior) {
            clienteRepository.save(cliente);
        }
    }

    @Transactional
    public void atualizarStatusDeTodos() {
        List<Cliente> clientes = clienteRepository.findAll();
        List<Cliente> atualizados = new ArrayList<>();

        for (Cliente cliente : clientes) {
            StatusCliente statusAnterior = cliente.getStatus();
            cliente.atualizarStatusPorUltimaCompra();
            if (cliente.getStatus() != statusAnterior) {
                atualizados.add(cliente);
            }
        }

        if (!atualizados.isEmpty()) {
            clienteRepository.saveAll(atualizados);
        }
    }

    // Métodos de cálculo
    public boolean clienteInativo(Cliente cliente) {
        return cliente.estaInativo();
    }
}
