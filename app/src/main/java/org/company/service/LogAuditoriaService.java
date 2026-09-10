package org.company.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.servlet.http.HttpServletRequest;
import org.company.entity.LogAuditoria;
import org.company.entity.TipoEvento;
import org.company.entity.Usuario;
import org.company.repository.LogAuditoriaRepository;
import org.company.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LogAuditoriaService {

    private final LogAuditoriaRepository logAuditoriaRepository;
    private final UsuarioRepository usuarioRepository;

    @Async
    public void registrarAcesso(String username, TipoEvento evento, HttpServletRequest request) {
        LogAuditoria log = new LogAuditoria();
        log.setUsername(username);
        log.setEvento(evento);
        log.setIp(extrairClientIp(request));
        log.setUserAgent(request.getHeader("User-Agent"));
        log.setDataHora(LocalDateTime.now());
        logAuditoriaRepository.save(log);
    }

    private String extrairClientIp(HttpServletRequest request) {
        if (request == null) return "127.0.0.1";

        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp.trim();
        }

        String remoteAddr = request.getRemoteAddr();
        return remoteAddr != null ? remoteAddr : "127.0.0.1";
    }

    public Page<LogAuditoria> obterLogs(Long representanteId, String username, Pageable pageable) {
        if (representanteId != null) {
            var usuarioOpt = usuarioRepository.findByRepresentanteId(representanteId);
            if (usuarioOpt.isPresent()) {
                Usuario u = usuarioOpt.get();
                List<String> usernames = new ArrayList<>();
                if (u.getNomeUsuario() != null) usernames.add(u.getNomeUsuario().toLowerCase());
                if (u.getEmail() != null) usernames.add(u.getEmail().toLowerCase());

                if (!usernames.isEmpty()) {
                    return logAuditoriaRepository.findByUsernamesInOrderByDataHoraDesc(usernames, pageable);
                }
            }
        }

        if (username != null && !username.trim().isEmpty()) {
            return logAuditoriaRepository.findByUsernameIgnoreCaseOrderByDataHoraDesc(username.trim(), pageable);
        }

        return logAuditoriaRepository.findAllByOrderByDataHoraDesc(pageable);
    }

    public Page<LogAuditoria> obterTodosOsLogs(Pageable pageable) {
        return logAuditoriaRepository.findAllByOrderByDataHoraDesc(pageable);
    }
}

