package org.company.service;

import org.company.entity.Cliente;

import java.time.LocalDate;
import java.util.List;

import org.company.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AlertaService {
    
    private final ClienteRepository clienteRepository;
        
    private final WhatsAppService whatsAppService;

    public void processarClienteInativo() {

        LocalDate dataLimite = LocalDate.now().minusDays(45);
        
        List<Cliente> clientesInativos = clienteRepository.findByUltimaCompraBefore(dataLimite);

        for (Cliente cliente : clientesInativos) {
        
            var representante = cliente.getRepresentante();
            if (representante != null) {
        
                String telefone = representante.getTelefone();
                if (telefone != null && !telefone.isBlank()) {
        
                    whatsAppService.mandarMensagem(
                        telefone,
                        "Cliente inativo: " + cliente.getNome()
                    );
                }
            }
        }
    }
}
