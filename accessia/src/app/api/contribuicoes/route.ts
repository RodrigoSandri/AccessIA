
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

const tiposDeAcessibilidade = [
    "rampa_acesso",
    "banheiro_adaptado",
    "vaga_reservada",
    "outro",
] as const;
 
const opcoesDeInformacao = [
    "Sim",
    "Não",
    "Não sei informar",
] as const;

interface Estabelecimento extends RowDataPacket {
    id: number;
}

export async function POST(request: Request) {
    try {
        const corpo: unknown = await request.json();

        if (
            typeof corpo !== "object" ||
            corpo === null ||
            Array.isArray(corpo)
        ) {
            return NextResponse.json(
                { erro: "Os dados enviados são inválidos." },
                { status: 400 }
            );
        }

        const dados = corpo as Record<string, unknown>;

        const estabelecimentoId = dados.estabelecimento_id;
        const tipo = dados.tipo_acessibilidade;
        const informacao = dados.informacao_proposta;
        const nome = dados.nome_contribuidor;
        const relato = dados.relato;

        if (
            typeof estabelecimentoId !== "number" ||
            !Number.isSafeInteger(estabelecimentoId) ||
            estabelecimentoId <= 0
        ) {
            return NextResponse.json(
                { erro: "Selecione um estabelecimento válido." },
                { status: 400 }
            );
        }

        if (
            typeof tipo !== "string" ||
            !tiposDeAcessibilidade.includes(
                tipo as (typeof tiposDeAcessibilidade)[number]
            )
        ) {
            return NextResponse.json(
                { erro: "O tipo de acessibilidade é inválido." },
                { status: 400 }
            );
        }

        if (
            typeof informacao !== "string" ||
            !opcoesDeInformacao.includes(
                informacao as (typeof opcoesDeInformacao)[number]
            )
        ) {
            return NextResponse.json(
                { erro: "A informação proposta é inválida." },
                { status: 400 }
            );
        }

        if (
            nome !== undefined &&
            nome !== null &&
            (typeof nome !== "string" || nome.trim().length > 100)
        ) {
            return NextResponse.json(
                { erro: "O nome deve ter no máximo 100 caracteres." },
                { status: 400 }
            );
        }

        if (
            relato !== undefined &&
            relato !== null &&
            (typeof relato !== "string" || relato.length > 5000)
        ) {
            return NextResponse.json(
                { erro: "O relato deve ter no máximo 5000 caracteres." },
                { status: 400 }
            );
        }

        const [estabelecimentos] = await pool.execute<Estabelecimento[]>(
            "SELECT id FROM estabelecimentos WHERE id = ? LIMIT 1",
            [estabelecimentoId]
        );

        if (estabelecimentos.length === 0) {
            return NextResponse.json(
                { erro: "O estabelecimento informado não existe." },
                { status: 404 }
            );
        }

        const [resultado] = await pool.execute<ResultSetHeader>(
            `INSERT INTO contribuicoes (
                estabelecimento_id,
                nome_contribuidor,
                tipo_acessibilidade,
                informacao_proposta,
                relato
            ) VALUES (?, ?, ?, ?, ?)`,
            [
                estabelecimentoId,
                typeof nome === "string" && nome.trim()
                    ? nome.trim()
                    : null,
                tipo,
                informacao,
                typeof relato === "string" && relato.trim()
                    ? relato.trim()
                    : null,
            ]
        );

        return NextResponse.json(
            {
                mensagem: "Contribuição enviada para análise.",
                contribuicao: {
                    id: resultado.insertId,
                    estabelecimento_id: estabelecimentoId,
                    tipo_acessibilidade: tipo,
                    informacao_proposta: informacao,
                    status: "pendente",
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao registrar contribuição:", error);

        return NextResponse.json(
            { erro: "Não foi possível registrar a contribuição." },
            { status: 500 }
        );
    }
}
