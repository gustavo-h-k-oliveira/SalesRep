package org.company.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class HealthController {
    
    @GetMapping("/")
    public String home() {

        System.out.println("=".repeat(20));
        System.out.println("ENTROU NO HOME");
        System.out.println("=".repeat(20));
        return "A API do SalesRep está online! 🔥";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }    
}
