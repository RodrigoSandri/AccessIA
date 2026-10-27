
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

interface TotalRow extends RowDataPacket {
    total: number;
}

export async function GET() {
    try {
        const [estabelecimentos] = await pool.execute<TotalRow[]>(
            "SELECT COUNT(*) AS total FROM estabelecimentos"
        );

        const [contribuicoes] = await pool.execute<TotalRow[]>(
            "SELECT COUNT(*) AS total FROM contribuicoes"
        );

        const [pendentes] = await pool.execute<TotalRow[]>(
            "SELECT COUNT(*) AS total FROM contribuicoes WHERE status = ?",
            ["pendente"]
        );

        return NextResponse.json({
            estabelecimentos: estabelecimentos[0].total,
            contribuicoes: contribuicoes[0].total,
            pendentes: pendentes[0].total,
        });
    } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);

        return NextResponse.json(
            { erro: "Não foi possível carregar os dados do dashboard." },
            { status: 500 }
        );
    }
}
