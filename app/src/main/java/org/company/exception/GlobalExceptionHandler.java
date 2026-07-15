package org.company.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(BadCredentialsException.class)
        public ResponseEntity<ResponseError> loginException(
                        BadCredentialsException ex) {

                ResponseError response = new ResponseError(
                                ex.getMessage(),
                                HttpStatus.UNAUTHORIZED,
                                LocalDateTime.now());

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(response);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ResponseError> trataException(Exception ex) {
                ex.printStackTrace(); // Log the exception stacktrace to the console

                ResponseError response = new ResponseError(
                                "Erro interno no servidor",
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                LocalDateTime.now());

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(response);
        }

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ResponseError> trataAccessDeniedException(AccessDeniedException ex) {

                ResponseError response = new ResponseError(
                                "Acesso negado. Você não tem permissão para realizar esta ação.",
                                HttpStatus.FORBIDDEN,
                                LocalDateTime.now());

                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(response);
        }

}
