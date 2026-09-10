package org.company.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ZapiReceivedMessage(
        String instanceId,
        String messageId,
        String phone,
        Boolean fromMe,
        Boolean isGroup,
        String type,
        ZapiTextPayload text) {
}
