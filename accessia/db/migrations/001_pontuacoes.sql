-- AccessIA — Migração 001: tabela de pontuações (bonificação básica)
--
-- STATUS: script de referência. NÃO é executado automaticamente pela aplicação.
-- Execute manualmente, primeiro em um banco de teste, depois em produção.
--
-- Esta migração apenas CRIA uma tabela nova. Não altera, não remove e não
-- migra nenhuma tabela ou dado existente.
--
-- Pré-requisitos confirmados no banco:
--   contribuicoes.id  -> INT UNSIGNED, AUTO_INCREMENT, PRIMARY KEY
--   contribuicoes     -> ENGINE=InnoDB, charset utf8mb4
--
-- Regras de negócio refletidas aqui:
--   1. Cada contribuição gera pontos no máximo uma vez
--      (UNIQUE em contribuicao_id).
--   2. Não há identificação de usuários nesta etapa; por isso não existe
--      coluna de usuário. Quando houver autenticação, ela será adicionada
--      por uma migração própria (002_...).
--   3. Somente contribuições aprovadas podem gerar pontos. Essa regra é
--      aplicada na camada de código (src/lib/bonificacao.ts), pois o status
--      da contribuição fica em outra tabela.
--   4. Não há pontuação retroativa: a tabela nasce vazia.

CREATE TABLE IF NOT EXISTS pontuacoes (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    contribuicao_id INT UNSIGNED NOT NULL,
    pontos INT UNSIGNED NOT NULL,
    motivo VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    -- Garante que uma contribuição não gere pontos mais de uma vez.
    UNIQUE KEY uq_pontuacoes_contribuicao (contribuicao_id),

    -- RESTRICT preserva o histórico de pontos: uma contribuição com pontos
    -- concedidos não pode ser excluída sem tratar antes o registro de pontos.
    CONSTRAINT fk_pontuacoes_contribuicao
        FOREIGN KEY (contribuicao_id)
        REFERENCES contribuicoes (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Reversão (somente se a tabela ainda estiver vazia ou o histórico puder ser
-- descartado). Mantida comentada de propósito:
--
-- DROP TABLE pontuacoes;