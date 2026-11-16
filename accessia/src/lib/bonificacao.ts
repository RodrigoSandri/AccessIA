import type { ResultSetHeader } from "mysql2";
import type { PoolConnection } from "mysql2/promise";


export const MOTIVO_CONTRIBUICAO_APROVADA = "contribuicao_aprovada" as const;

const PONTOS_PADRAO_CONTRIBUICAO_APROVADA = 1;
const PONTOS_MAXIMOS_POR_CONCESSAO = 1_000_000;

export function obterPontosContribuicaoAprovada(): number {
    const configurado =
        process.env.BONIFICACAO_PONTOS_CONTRIBUICAO_APROVADA?.trim();

    if (!configurado) {
        return PONTOS_PADRAO_CONTRIBUICAO_APROVADA;
    }

    const valor = Number(configurado);

    if (
        Number.isSafeInteger(valor) &&
        valor > 0 &&
        valor <= PONTOS_MAXIMOS_POR_CONCESSAO
    ) {
        return valor;
    }

    console.error(
        "BONIFICACAO_PONTOS_CONTRIBUICAO_APROVADA inválida. Usando o valor padrão."
    );

    return PONTOS_PADRAO_CONTRIBUICAO_APROVADA;
}

export type ResultadoConcessao =
    | { concedido: true; pontos: number }
    | { concedido: false; motivo: "nao_aprovada" | "ja_concedida" };

export async function concederPontosPorContribuicaoAprovada(
    conexao: PoolConnection,
    contribuicaoId: number
): Promise<ResultadoConcessao> {
    if (!Number.isSafeInteger(contribuicaoId) || contribuicaoId <= 0) {
        throw new Error("Identificador de contribuição inválido.");
    }

    const pontos = obterPontosContribuicaoAprovada();

    try {
        const [resultado] = await conexao.execute<ResultSetHeader>(
            `INSERT INTO pontuacoes (contribuicao_id, pontos, motivo)
            SELECT id, ?, ?
            FROM contribuicoes
            WHERE id = ?
                AND status = 'aprovada'`,
            [pontos, MOTIVO_CONTRIBUICAO_APROVADA, contribuicaoId]
        );

        if (resultado.affectedRows === 0) {
            return { concedido: false, motivo: "nao_aprovada" };
        }

        return { concedido: true, pontos };
    } catch (erro) {
        if (
            typeof erro === "object" &&
            erro !== null &&
            "code" in erro &&
            erro.code === "ER_DUP_ENTRY"
        ) {
            return { concedido: false, motivo: "ja_concedida" };
        }

        throw erro;
    }
}