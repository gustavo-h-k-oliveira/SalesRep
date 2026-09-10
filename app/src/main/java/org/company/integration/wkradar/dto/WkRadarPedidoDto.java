package org.company.integration.wkradar.dto;

import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class WkRadarPedidoDto {
    @JsonProperty("Id")
    private String id;

    @JsonProperty("Numero")
    private String numero;

    @JsonProperty("IdCliente")
    private String idCliente;

    @JsonProperty("IdVendedor")
    private String idVendedor;

    @JsonProperty("DataEmissao")
    private String dataEmissao;

    @JsonProperty("ValorTotal")
    private BigDecimal valorTotal;

    @JsonProperty("Situacao")
    private String situacao;
}
