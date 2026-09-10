package org.company.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "whatsapp_consulta", indexes = {
        @Index(name = "idx_whatsapp_consulta_telefone", columnList = "telefone"),
        @Index(name = "idx_whatsapp_consulta_data_hora", columnList = "data_hora")
})
public class WhatsAppConsulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "message_id", unique = true, length = 255)
    private String messageId;

    @Column(nullable = false, length = 30)
    private String telefone;

    @Column(name = "representante_id")
    private Long representanteId;

    @Column(length = 255)
    private String comando;

    @Column(nullable = false, length = 40)
    private String status;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;
}
