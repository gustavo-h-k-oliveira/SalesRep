package org.company.security;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import org.company.exception.InvalidJwtTokenException;

@Service
public class JwtTokenService {

    private final Algorithm algorithm;
    private final JWTVerifier verifier;
    private final long expirationMillis;

    public JwtTokenService(
            @Value("${jwt.secret}") String jwtSecret,
            @Value("${jwt.expiration-ms}") long expirationMillis) {
        this.algorithm = Algorithm.HMAC256(jwtSecret);
        this.verifier = JWT.require(algorithm).build();
        this.expirationMillis = expirationMillis;
    }

    public String generateToken(String username, String role, Long representanteId) {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + expirationMillis);

        var tokenBuilder = JWT.create()
                .withSubject(username)
                .withClaim("role", role)
                .withIssuedAt(now)
                .withExpiresAt(expiresAt);

        if (representanteId != null) {
            tokenBuilder.withClaim("representanteId", representanteId);
        }

        return tokenBuilder.sign(algorithm);
    }

    public boolean validateToken(String token) {
        try {
            verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        try {
            DecodedJWT decodedJWT = verifier.verify(token);
            return decodedJWT.getSubject();
        } catch (JWTVerificationException e) {
            throw new InvalidJwtTokenException("Token JWT inválido ou expirado.", e);
        }
    }

    public Long getRepresentanteIdFromToken(String token) {
        try {
            DecodedJWT decodedJWT = verifier.verify(token);
            return decodedJWT.getClaim("representanteId").isNull()
                    ? null
                    : decodedJWT.getClaim("representanteId").asLong();
        } catch (JWTVerificationException e) {
            throw new InvalidJwtTokenException("Token JWT inválido ou expirado.", e);
        }
    }
}
