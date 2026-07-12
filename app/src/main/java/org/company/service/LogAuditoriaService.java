package org.company.service;

import java.time.LocalDateTime;
import jakarta.servlet.http.HttpServletRequest;
import org.company.entity.LogAuditoria;
import org.company.entity.TipoEvento;
import org.company.repository.LogAuditoriaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LogAuditoriaService {

    private final LogAuditoriaRepository logAuditoriaRepository;

    @Async
    public void registrarAcesso(String username, TipoEvento evento, HttpServletRequest request) {
        LogAuditoria log = new LogAuditoria();
        log.setUsername(username);
        log.setEvento(evento);
        log.setIp(request.getRemoteAddr());
        log.setUserAgent(request.getHeader("User-Agent"));
        log.setDataHora(LocalDateTime.now());
        logAuditoriaRepository.save(log);
    }

    public Page<LogAuditoria> obterTodosOsLogs(Pageable pageable) {
        return logAuditoriaRepository.findAll(pageable);
    }
}
