package org.company.service;

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
        return clienteRepository.findAll();
    }

    public Cliente encontrarPorId(Long id) {
        return clienteRepository.findById(id).orElse(null);
    }

    public List<Cliente> encontrarInativos() {
        return clienteRepository.findByStatus(StatusCliente.INATIVO);
    }

    public List<Cliente> encontrarPorRegiao(Long regiaoId) {
        return clienteRepository.findByRegiaoId(regiaoId);
    }

    public List<Cliente> encontrarPorRepresentante(Long representanteId) {
        return clienteRepository.findByRepresentanteId(representanteId);
    }

    public List<Cliente> encontrarPorStatus(StatusCliente status) {
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

        cliente.atualizarStatusPorUltimaCompra();
        clienteRepository.save(cliente);
    }

    // Métodos de cálculo
    public boolean clienteInativo(Cliente cliente) {
        return cliente.estaInativo();
    }
}
