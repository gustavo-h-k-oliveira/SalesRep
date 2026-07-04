package org.company.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class HealthController {

    private static final Logger logger = LoggerFactory.getLogger(HealthController.class);

    @GetMapping("/")
    public String home() {

        logger.info("Endpoint '/' acessado.");
        return "A API do SalesRep está online! 🔥";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
