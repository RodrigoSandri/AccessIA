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

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    _request: Request,
    { params }: RouteContext
) {
    try {
        const { id } = await params;
        const idNumerico = Number(id);

        if (!Number.isSafeInteger(idNumerico) || idNumerico <= 0) {
            return NextResponse.json(
                { erro: "ID de estabelecimento inválido." },
                { status: 400 }
            );
        }

        const [estabelecimentos] = await pool.execute<Estabelecimento[]>(
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
            [idNumerico]
        );

        if (estabelecimentos.length === 0) {
            return NextResponse.json(
                { erro: "Estabelecimento não encontrado." },
                { status: 404 }
            );
        }

        return NextResponse.json(estabelecimentos[0]);
    } catch (error) {
        console.error("Erro ao buscar estabelecimento:", error);

        return NextResponse.json(
            { erro: "Não foi possível consultar o estabelecimento." },
            { status: 500 }
        );
    }
}