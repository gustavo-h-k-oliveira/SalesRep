package org.company.security;

import java.util.Collection;
import java.util.Objects;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UsuarioPrincipal implements UserDetails {

    private final String username;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean enabled;
    private final Long representanteId;

    public UsuarioPrincipal(String username, String password,
            Collection<? extends GrantedAuthority> authorities,
            boolean enabled,
            Long representanteId) {
        this.username = Objects.requireNonNull(username);
        this.password = Objects.requireNonNull(password);
        this.authorities = Objects.requireNonNull(authorities);
        this.enabled = enabled;
        this.representanteId = representanteId;
    }

    public static UsuarioPrincipal from(UserDetails userDetails, Long representanteId) {
        return new UsuarioPrincipal(
                userDetails.getUsername(),
                userDetails.getPassword(),
                userDetails.getAuthorities(),
                userDetails.isEnabled(),
                representanteId);
    }

    public Long getRepresentanteId() {
        return representanteId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
