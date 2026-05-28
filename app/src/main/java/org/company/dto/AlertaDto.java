package org.company.dto;

import java.time.LocalDateTime;

import org.company.entity.CriticidadeAlerta;
import org.company.entity.StatusAlerta;
import org.company.entity.TipoAlerta;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AlertaDto {
    private TipoAlerta tipo;
    private CriticidadeAlerta criticidade;
    private String descricao;
    private StatusAlerta status;
    private Long clienteId;
    private String clienteNome;
    private LocalDateTime dataGeracao;
}
