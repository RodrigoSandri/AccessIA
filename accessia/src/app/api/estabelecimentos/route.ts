
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

const opcoesAcessibilidade = [
    "nao_verificado",
    "sim",
    "nao",
    "parcial",
] as const;

// Lista os estabelecimentos cadastrados.
export async function GET() {
    try {
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
            ORDER BY id ASC`
        );

        const estabelecimentos = resultado as Estabelecimento[];

        return NextResponse.json(estabelecimentos);
    } catch (error) {
        console.error("Erro ao listar estabelecimentos:", error);

        return NextResponse.json(
            { erro: "Não foi possível listar os estabelecimentos." },
            { status: 500 }
        );
    }
}

// Cadastra um novo estabelecimento.
export async function POST(request: Request) {
    try {
        const autenticado = await isAdmin();

        if (!autenticado) {
            return NextResponse.json(
                { erro: "Acesso não autorizado." },
                { status: 401 }
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
            `INSERT INTO estabelecimentos (
                nome,
                cidade,
                categoria,
                endereco,
                descricao,
                rampa_acesso,
                banheiro_adaptado,
                vaga_reservada
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nome.trim(),
                cidade.trim(),
                categoria.trim(),
                endereco ?? null,
                descricao ?? null,
                rampaAcesso,
                banheiroAdaptado,
                vagaReservada,
            ]
        );

        const resultado = resultadoBruto as ResultSetHeader;

        return NextResponse.json(
            {
                mensagem: "Estabelecimento cadastrado com sucesso.",
                estabelecimento: {
                    id: resultado.insertId,
                    nome: nome.trim(),
                    cidade: cidade.trim(),
                    categoria: categoria.trim(),
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao cadastrar estabelecimento:", error);

        return NextResponse.json(
            { erro: "Não foi possível cadastrar o estabelecimento." },
            { status: 500 }
        );
    }
}
