package org.company.integration.wkradar.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "wkradar.api")
public class WkRadarProperties {
    private String url = "https://api-wkradar.wk.com.br";
    private String token;
    private boolean enabled = false;
    private long rateLimitDelayMs = 250; // Respeita o limite de 4 req/seg
}
