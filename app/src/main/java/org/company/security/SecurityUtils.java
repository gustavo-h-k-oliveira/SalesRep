package org.company.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public static UsuarioPrincipal getCurrentUser() {
        Authentication authentication = getAuthentication();
        if (authentication == null) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UsuarioPrincipal) {
            return (UsuarioPrincipal) principal;
        }

        return null;
    }

    public static Long getRepresentanteId() {
        UsuarioPrincipal currentUser = getCurrentUser();
        return currentUser != null ? currentUser.getRepresentanteId() : null;
    }

    public static boolean isRepresentante() {
        UsuarioPrincipal currentUser = getCurrentUser();
        if (currentUser == null) {
            return false;
        }
        return currentUser.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_REPRESENTANTE"));
    }
}
