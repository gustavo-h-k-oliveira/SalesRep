package org.company.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LogAuditoriaResponseDto {
    private Long id;
    private String username;
    private String evento;
    private String ip;
    private String userAgent;
    private LocalDateTime dataHora;
}
