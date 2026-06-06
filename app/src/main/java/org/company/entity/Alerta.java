package org.company.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;

@Getter
@Setter(AccessLevel.NONE)
@Entity
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private @NonNull TipoAlerta tipo;
    
    @Enumerated(EnumType.STRING)
    private @NonNull CriticidadeAlerta criticidade;
    
    private @NonNull String descricao;
    
    @Enumerated(EnumType.STRING)
    private @NonNull StatusAlerta status;
    
    private @NonNull LocalDateTime dataGeracao;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // Métodos de consulta
    public boolean estaCritico() {
        return criticidade == CriticidadeAlerta.ALTA;
    }

    public boolean estaResolvido() {
        return status == StatusAlerta.RESOLVIDO;
    }
}
