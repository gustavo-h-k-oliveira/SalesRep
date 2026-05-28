package org.company.controller;

import org.company.service.WhatsAppService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/whatsapp")
@RequiredArgsConstructor
public class WhatsAppController {
    
    private final WhatsAppService whatsAppService;

    @PostMapping("/teste")
    public void teste() {

        whatsAppService.mandarMensagem("5514981704947", "Olá, Java!");
    }
}
