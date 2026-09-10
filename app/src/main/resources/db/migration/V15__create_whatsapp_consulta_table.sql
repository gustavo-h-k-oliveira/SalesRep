CREATE TABLE IF NOT EXISTS whatsapp_consulta (
    id BIGSERIAL PRIMARY KEY,
    message_id VARCHAR(255) UNIQUE,
    telefone VARCHAR(30) NOT NULL,
    representante_id BIGINT,
    comando VARCHAR(255),
    status VARCHAR(40) NOT NULL,
    data_hora TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_consulta_telefone ON whatsapp_consulta (telefone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_consulta_data_hora ON whatsapp_consulta (data_hora);
