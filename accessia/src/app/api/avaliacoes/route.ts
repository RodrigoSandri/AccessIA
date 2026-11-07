
import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";

interface Avaliacao extends RowDataPacket {
  id: number;
  estabelecimento_id: number;
  nota: number;
  comentario: string | null;
  criado_em: Date;
}

export async function GET(request: NextRequest) {
  try {
    const estabelecimentoId = Number(
      request.nextUrl.searchParams.get("estabelecimento_id")
    );

    if (!Number.isInteger(estabelecimentoId) || estabelecimentoId <= 0) {
      return NextResponse.json(
        { erro: "ID do estabelecimento inválido." },
        { status: 400 }
      );
    }

    const [avaliacoes] = await pool.execute<Avaliacao[]>(
      `SELECT id, estabelecimento_id, nota, comentario, criado_em
       FROM avaliacoes
       WHERE estabelecimento_id = ?
       ORDER BY criado_em DESC`,
      [estabelecimentoId]
    );

    return NextResponse.json(avaliacoes);
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);

    return NextResponse.json(
      { erro: "Não foi possível buscar as avaliações." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const estabelecimentoId = Number(body.estabelecimento_id);
    const nota = Number(body.nota);
    const comentario =
      typeof body.comentario === "string" ? body.comentario.trim() : "";

    if (!Number.isInteger(estabelecimentoId) || estabelecimentoId <= 0) {
      return NextResponse.json(
        { erro: "ID do estabelecimento inválido." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
      return NextResponse.json(
        { erro: "A nota deve ser um número inteiro entre 1 e 5." },
        { status: 400 }
      );
    }

    if (comentario.length > 2000) {
      return NextResponse.json(
        { erro: "O comentário deve ter no máximo 2000 caracteres." },
        { status: 400 }
      );
    }

    const [estabelecimentos] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM estabelecimentos WHERE id = ?",
      [estabelecimentoId]
    );

    if (estabelecimentos.length === 0) {
      return NextResponse.json(
        { erro: "Estabelecimento não encontrado." },
        { status: 404 }
      );
    }

    const [resultado] = await pool.execute<ResultSetHeader>(
      `INSERT INTO avaliacoes
       (estabelecimento_id, nota, comentario)
       VALUES (?, ?, ?)`,
      [estabelecimentoId, nota, comentario || null]
    );

    return NextResponse.json(
      {
        mensagem: "Avaliação registrada com sucesso.",
        id: resultado.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registrar avaliação:", error);

    return NextResponse.json(
      { erro: "Não foi possível registrar a avaliação." },
      { status: 500 }
    );
  }
}
