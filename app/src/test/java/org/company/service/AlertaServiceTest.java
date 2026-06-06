package org.company.service;

import org.company.entity.Cliente;
import org.company.entity.Representante;

import org.company.repository.AlertaRepository;
import org.company.repository.ClienteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.anyString;

@ExtendWith(MockitoExtension.class)
class AlertaServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private AlertaRepository alertaRepository;

    @Mock
    private WhatsAppService whatsAppService;

    @InjectMocks
    private AlertaService alertaService;

    @Test
    void processarClienteInativo_deveBuscarClientesComUltimaCompraAntesDe45Dias() {
        Cliente cliente1 = mock(Cliente.class);
        Representante rep1 = mock(Representante.class);
        when(rep1.getTelefone()).thenReturn("11999999999");
        when(cliente1.getRepresentante()).thenReturn(rep1);
        when(cliente1.getNome()).thenReturn("Cliente 1");

        Cliente cliente2 = mock(Cliente.class);
        Representante rep2 = mock(Representante.class);
        when(rep2.getTelefone()).thenReturn("11988888888");
        when(cliente2.getRepresentante()).thenReturn(rep2);
        when(cliente2.getNome()).thenReturn("Cliente 2");

        when(clienteRepository.findByUltimaCompraBefore(any(LocalDate.class)))
            .thenReturn(List.of(cliente1, cliente2));

        alertaService.processarClienteInativo();

        verify(whatsAppService).mandarMensagem(eq("11999999999"), anyString());
        verify(whatsAppService).mandarMensagem(eq("11988888888"), anyString());
    }
}
