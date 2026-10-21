
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

export async function GET() {
    try {
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
            ORDER BY id ASC`
        );

        return NextResponse.json(estabelecimentos);
    } catch (error) {
        console.error("Erro ao listar estabelecimentos:", error);

        return NextResponse.json(
            { erro: "Não foi possível listar os estabelecimentos." },
            { status: 500 }
        );
    }
}
