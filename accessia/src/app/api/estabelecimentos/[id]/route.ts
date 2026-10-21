
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

interface Estabelecimento extends RowDataPacket {
    id: number;
    nome: string;
    cidade: string;
    categoria: string;
    endereco: string | null;
    descricao: string | null;
    rampa_acesso: string;
    banheiro_adaptado: string;
    vaga_reservada: string;
}

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(
    request: Request,
    { params }: RouteParams
) {
    try {
        const { id } = await params;
        const estabelecimentoId = Number(id);

        if (!Number.isInteger(estabelecimentoId) || estabelecimentoId <= 0) {
            return NextResponse.json(
                { erro: "ID inválido." },
                { status: 400 }
            );
        }

        const [rows] = await pool.query<Estabelecimento[]>(
            `SELECT
                id,
                nome,
                cidade,
                categoria,
                endereco,
                descricao,
                rampa_acesso,
                banheiro_adaptado,
                vaga_reservada
            FROM estabelecimentos
            WHERE id = ?`,
            [estabelecimentoId]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { erro: "Estabelecimento não encontrado." },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("Erro ao buscar estabelecimento:", error);

        return NextResponse.json(
            { erro: "Erro interno ao buscar estabelecimento." },
            { status: 500 }
        );
    }
}
