package org.company.integration.wkradar.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class WkRadarClienteDto {
    @JsonProperty("Id")
    private String id;

    @JsonProperty("Nome")
    private String nome;

    @JsonProperty("CpfCnpj")
    private String cpfCnpj;

    @JsonProperty("Situacao")
    private String situacao;

    @JsonProperty("Estado")
    private String estado;

    @JsonProperty("IdRepresentante")
    private String idRepresentante;
}
