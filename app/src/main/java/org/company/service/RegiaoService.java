package org.company.service;

import java.util.List;

import org.company.entity.Cliente;
import org.company.entity.Regiao;
import org.company.entity.Representante;
import org.company.entity.Uf;
import org.company.repository.ClienteRepository;
import org.company.repository.RegiaoRepository;
import org.company.repository.RepresentanteRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegiaoService {
    
    private final RegiaoRepository regiaoRepository;

    private final ClienteRepository clienteRepository;
    
    private final RepresentanteRepository representanteRepository;

    // Métodos de consulta
    public List<Regiao> encontrarTodos() {
        return regiaoRepository.findAll();
    }

    public Regiao encontrarPorId(Long id) {
        return regiaoRepository.findById(id).orElse(null);
    }

    public Regiao salvar(Regiao regiao) {
        return regiaoRepository.save(regiao);
    }

    public void deletar(Long id) {
        regiaoRepository.deleteById(id);
    }

    public List<Regiao> encontrarPorUf(Uf uf) {
        return regiaoRepository.findByUf(uf);
    }

    public List<Cliente> encontrarClientesPorRegiao(Long regiaoId) {
        return clienteRepository.findByRegiaoId(regiaoId);
    }

    public List<Representante> encontrarRepresentantesPorRegiao(Long regiaoId) {
        return representanteRepository.findByRegiaoId(regiaoId);
    }
}
