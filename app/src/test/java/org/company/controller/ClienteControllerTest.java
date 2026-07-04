package org.company.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.Set;

import org.company.dto.ClienteRequestDto;
import org.company.dto.ClienteResponseDto;
import org.company.entity.Cliente;
import org.company.entity.Regiao;
import org.company.entity.Representante;
import org.company.entity.StatusCliente;
import org.company.entity.StatusRegiao;
import org.company.entity.Uf;
import org.company.mapper.ClienteDtoMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class ClienteControllerTest {

    private Validator validator;
    private ClienteDtoMapper clienteDtoMapper;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        clienteDtoMapper = new ClienteDtoMapper();
    }

    @Test
    @DisplayName("Validação de erro da requisição com cliente vazio")
    void shouldFailValidationWhenClienteRequestDtoIsMissingNome() {
        ClienteRequestDto dto = new ClienteRequestDto();
        dto.setRegiaoId(1L);
        dto.setRepresentanteId(2L);
        dto.setUltimaCompra(LocalDate.of(2026, 5, 1));
        dto.setStatus(StatusCliente.ATIVO);

        Set<ConstraintViolation<ClienteRequestDto>> violations = validator.validate(dto);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> "nome".equals(v.getPropertyPath().toString())));
    }

    @Test
    @DisplayName("Validação de clientes sem os campos de entidades aninhadas")
    void shouldMapClienteToResponseDtoWithoutNestedEntityFields() throws NoSuchFieldException {
        Regiao regiao = new Regiao();
        regiao.setId(1L);
        regiao.setNome("Sul");
        regiao.setUf(Uf.PR);
        regiao.setGerenteRegional("Gerente Sul");
        regiao.setStatus(StatusRegiao.NORMAL);

        Representante representante = new Representante();
        representante.setId(2L);
        representante.setNome("João");
        representante.setTelefone("(41) 99999-9999");
        representante.setRegiao(regiao);

        Cliente cliente = new Cliente();
        cliente.setId(100L);
        cliente.setNome("Cliente Teste");
        cliente.setRegiao(regiao);
        cliente.setRepresentante(representante);
        cliente.setUltimaCompra(LocalDate.of(2026, 5, 1));
        cliente.setStatus(StatusCliente.ATIVO);

        ClienteResponseDto response = clienteDtoMapper.toClienteResponseDto(cliente);

        assertNotNull(response);
        assertEquals(100L, response.id());
        assertEquals("Cliente Teste", response.nome());
        assertEquals(1L, response.regiaoId());
        assertEquals("Sul", response.regiaoNome());
        assertEquals(2L, response.representanteId());
        assertEquals("João", response.representanteNome());
        assertEquals(LocalDate.of(2026, 5, 1), response.ultimaCompra());
        assertEquals("ATIVO", response.status());

        assertThrows(NoSuchFieldException.class, () -> ClienteResponseDto.class.getDeclaredField("regiao"));
        assertThrows(NoSuchFieldException.class, () -> ClienteResponseDto.class.getDeclaredField("representante"));
    }
}
