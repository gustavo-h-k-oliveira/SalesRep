package org.company.service;

import java.util.ArrayList;
import java.util.List;

import org.company.entity.Cliente;
import org.company.entity.StatusCliente;
import org.company.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {
    
    private final ClienteRepository clienteRepository;

    // Métodos de consulta
    public List<Cliente> encontrarTodos() {
        atualizarStatusDeTodos();
        return clienteRepository.findAll();
    }

    public Cliente encontrarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id).orElse(null);
        if (cliente != null) {
            atualizarStatusPorUltimaCompra(cliente);
        }
        return cliente;
    }

    public List<Cliente> encontrarInativos() {
        atualizarStatusDeTodos();
        return clienteRepository.findByStatus(StatusCliente.INATIVO);
    }

    public List<Cliente> encontrarPorRegiao(Long regiaoId) {
        atualizarStatusDeTodos();
        return clienteRepository.findByRegiaoId(regiaoId);
    }

    public List<Cliente> encontrarPorRepresentante(Long representanteId) {
        atualizarStatusDeTodos();
        return clienteRepository.findByRepresentanteId(representanteId);
    }

    public List<Cliente> encontrarPorStatus(StatusCliente status) {
        atualizarStatusDeTodos();
        return clienteRepository.findByStatus(status);
    }

    // Métodos de manipulação
    public Cliente salvar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public void deletar(Long id) {
        clienteRepository.deleteById(id);
    }

    public void atualizarStatusPorUltimaCompra(Cliente cliente) {
        StatusCliente statusAnterior = cliente.getStatus();
        cliente.atualizarStatusPorUltimaCompra();
        if (cliente.getStatus() != statusAnterior) {
            clienteRepository.save(cliente);
        }
    }

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
