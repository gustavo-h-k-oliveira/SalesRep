package org.company.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

public record ResponseError(String message, HttpStatus httpStatus, LocalDateTime time) {}
