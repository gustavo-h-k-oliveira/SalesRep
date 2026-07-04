package org.company.entity;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Id;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private @NotBlank String nome;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regiao_id")
    @Valid
    private @NotNull Regiao regiao;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "representante_id")
    @Valid
    private @NotNull Representante representante;

    @OneToMany(mappedBy = "cliente")
    private List<Pedido> pedidos;
    
    private @NotNull LocalDate ultimaCompra;
    
    @Enumerated(EnumType.STRING)
    private @NotNull StatusCliente status;

    public void atualizarStatusPorUltimaCompra() {
        if (estaEmRecuperacaoPorPedido()) {
            this.status = StatusCliente.RECUPERACAO;
        } else {
            this.status = getDiasSemCompra() >= 45
                ? StatusCliente.INATIVO
                : StatusCliente.ATIVO;
        }
    }

    private boolean estaEmRecuperacaoPorPedido() {
        if (pedidos == null || pedidos.isEmpty()) {
            return false;
        }

        return pedidos.stream().anyMatch(pedido ->
            pedido.getStatus() == StatusPedido.EMITIDO
            || pedido.getAutorizacaoComercial() == StatusAutorizacaoComercial.AVALIANDO
        );
    }

    // Métodos de consulta
    public boolean estaAtivo() {
        return status == StatusCliente.ATIVO;
    }

    public boolean estaInativo() {
        return status == StatusCliente.INATIVO;
    }

    // Métodos de cálculo
    public long getDiasSemCompra() {
        return ChronoUnit.DAYS.between(ultimaCompra, LocalDate.now());
    }
}
