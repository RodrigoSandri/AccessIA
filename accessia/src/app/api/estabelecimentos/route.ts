
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
    try {
        const [estabelecimentos] = await pool.query(
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
            ORDER BY nome`
        );

        return NextResponse.json(estabelecimentos);
    } catch (error) {
        console.error("Erro ao buscar estabelecimentos:", error);

        return NextResponse.json(
            { erro: "Não foi possível consultar os estabelecimentos." },
            { status: 500 }
        );
    }
}
