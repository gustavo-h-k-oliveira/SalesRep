package org.company.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "whatsapp")
public class WhatsAppProperties {

    private boolean enabled;
    private String apiUrl = "https://api.z-api.io";
    private String instanceId;
    private String token;
    private String clientToken;
}
