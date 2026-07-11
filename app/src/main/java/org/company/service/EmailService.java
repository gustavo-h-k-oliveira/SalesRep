package org.company.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public void enviarEmailRecuperacao(String email, String token) {
        String resetLink = "http://localhost:5173/redefinir-senha?token=" + token;
        
        logger.info("\n================================================================================\n" +
                    "  [MOCK EMAIL SENDER]\n" +
                    "  Destinatário: {}\n" +
                    "  Assunto: Recuperação de Senha\n" +
                    "  Link de redefinição: {}\n" +
                    "================================================================================", 
                    email, resetLink);
    }
}
