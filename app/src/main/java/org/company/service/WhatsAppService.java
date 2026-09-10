package org.company.service;

public interface WhatsAppService {

    boolean estaConfigurado();

    void mandarMensagem(String telefone, String mensagem);
}
