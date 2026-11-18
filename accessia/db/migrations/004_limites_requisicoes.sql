CREATE TABLE IF NOT EXISTS limites_requisicoes (
    escopo VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    chave_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    tentativas INT UNSIGNED NOT NULL DEFAULT 1,
    janela_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (escopo, chave_hash),
    KEY idx_limites_requisicoes_janela (janela_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
