import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

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

const opcoesAcessibilidade = [
    "nao_verificado",
    "sim",
    "nao",
    "parcial",
] as const;

// Consulta um estabelecimento específico.
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

        const [resultado] = await pool.query(
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

        const estabelecimentos = resultado as Estabelecimento[];

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
            { erro: "Erro interno ao buscar estabelecimento." },
            { status: 500 }
        );
    }
}

// Atualiza um estabelecimento existente.
export async function PUT(
    request: Request,
    { params }: RouteParams
) {
    try {
        const autenticado = await isAdmin();

        if (!autenticado) {
            return NextResponse.json(
                { erro: "Acesso não autorizado." },
                { status: 401 }
            );
        }

        const { id } = await params;
        const estabelecimentoId = Number(id);

        if (!Number.isInteger(estabelecimentoId) || estabelecimentoId <= 0) {
            return NextResponse.json(
                { erro: "ID inválido." },
                { status: 400 }
            );
        }

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

        const nome = dados.nome;
        const cidade = dados.cidade;
        const categoria = dados.categoria;
        const endereco = dados.endereco;
        const descricao = dados.descricao;

        const rampaAcesso = dados.rampa_acesso;
        const banheiroAdaptado = dados.banheiro_adaptado;
        const vagaReservada = dados.vaga_reservada;

        if (
            typeof nome !== "string" ||
            !nome.trim() ||
            nome.trim().length > 150
        ) {
            return NextResponse.json(
                { erro: "Informe um nome válido de até 150 caracteres." },
                { status: 400 }
            );
        }

        if (
            typeof cidade !== "string" ||
            !cidade.trim() ||
            cidade.trim().length > 100
        ) {
            return NextResponse.json(
                { erro: "Informe uma cidade válida de até 100 caracteres." },
                { status: 400 }
            );
        }

        if (
            typeof categoria !== "string" ||
            !categoria.trim() ||
            categoria.trim().length > 100
        ) {
            return NextResponse.json(
                { erro: "Informe uma categoria válida de até 100 caracteres." },
                { status: 400 }
            );
        }

        if (
            endereco !== undefined &&
            endereco !== null &&
            (typeof endereco !== "string" || endereco.length > 255)
        ) {
            return NextResponse.json(
                { erro: "O endereço deve ter no máximo 255 caracteres." },
                { status: 400 }
            );
        }

        if (
            descricao !== undefined &&
            descricao !== null &&
            typeof descricao !== "string"
        ) {
            return NextResponse.json(
                { erro: "A descrição informada é inválida." },
                { status: 400 }
            );
        }

        const acessibilidade = [
            rampaAcesso,
            banheiroAdaptado,
            vagaReservada,
        ];

        const acessibilidadeValida = acessibilidade.every(
            (valor) =>
                typeof valor === "string" &&
                opcoesAcessibilidade.includes(
                    valor as (typeof opcoesAcessibilidade)[number]
                )
        );

        if (!acessibilidadeValida) {
            return NextResponse.json(
                { erro: "As informações de acessibilidade são inválidas." },
                { status: 400 }
            );
        }

        const [resultadoBruto] = await pool.query(
            `UPDATE estabelecimentos
            SET
                nome = ?,
                cidade = ?,
                categoria = ?,
                endereco = ?,
                descricao = ?,
                rampa_acesso = ?,
                banheiro_adaptado = ?,
                vaga_reservada = ?,
                atualizado_em = CURRENT_TIMESTAMP
            WHERE id = ?`,
            [
                nome.trim(),
                cidade.trim(),
                categoria.trim(),
                endereco ?? null,
                descricao ?? null,
                rampaAcesso,
                banheiroAdaptado,
                vagaReservada,
                estabelecimentoId,
            ]
        );

        const resultado = resultadoBruto as ResultSetHeader;

        if (resultado.affectedRows === 0) {
            return NextResponse.json(
                { erro: "Estabelecimento não encontrado." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            mensagem: "Estabelecimento atualizado com sucesso.",
        });
    } catch (error) {
        console.error("Erro ao atualizar estabelecimento:", error);

        return NextResponse.json(
            { erro: "Não foi possível atualizar o estabelecimento." },
            { status: 500 }
        );
    }
}
