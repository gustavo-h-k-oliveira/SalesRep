package org.company.service;

import java.util.List;
import java.util.Optional;

import org.company.entity.Estado;
import org.company.entity.Uf;
import org.company.repository.EstadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EstadoService {

    private final EstadoRepository estadoRepository;

    public List<Estado> encontrarTodos() {
        return estadoRepository.findAllByOrderByNomeAsc();
    }

    public Estado encontrarPorId(Long id) {
        return estadoRepository.findById(id).orElse(null);
    }

    public Optional<Estado> encontrarPorUf(Uf uf) {
        return estadoRepository.findByUf(uf);
    }

    public List<Estado> encontrarPorRegiao(Long regiaoId) {
        return estadoRepository.findByRegiaoId(regiaoId);
    }

    @Transactional
    public Estado salvar(Estado estado) {
        return estadoRepository.save(estado);
    }

    @Transactional
    public void deletar(Long id) {
        estadoRepository.deleteById(id);
    }
}
