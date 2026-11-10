
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import type {
    ResultSetHeader,
    RowDataPacket,
} from "mysql2";
import { put, del } from "@vercel/blob";
import { randomUUID } from "crypto";

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

interface ContribuicaoAdmin extends RowDataPacket {
    id: number;
    estabelecimento_id: number;
    estabelecimento_nome: string;
    nome_contribuidor: string | null;
    tipo_acessibilidade: string;
    informacao_proposta: string;
    relato: string | null;
    status: string;
}

interface ContribuicaoParaModeracao extends RowDataPacket {
    id: number;
    estabelecimento_id: number;
    tipo_acessibilidade: string;
    informacao_proposta: string;
    status: string;
}

// Lista contribuições para análise administrativa.
export async function GET() {
    try {
        const autenticado = await isAdmin();

        if (!autenticado) {
            return NextResponse.json(
                { erro: "Acesso não autorizado." },
                { status: 401 }
            );
        }

        const [contribuicoes] = await pool.execute<ContribuicaoAdmin[]>(
            `SELECT
                c.id,
                c.estabelecimento_id,
                e.nome AS estabelecimento_nome,
                c.nome_contribuidor,
                c.tipo_acessibilidade,
                c.informacao_proposta,
                c.relato,
                c.status
            FROM contribuicoes c
            INNER JOIN estabelecimentos e
                ON e.id = c.estabelecimento_id
            ORDER BY c.id DESC`
        );

        return NextResponse.json({
            contribuicoes: contribuicoes.map((item) => ({
                ...item,
                origem: "Informado por usuário",
            })),
        });
    } catch (error) {
        console.error("Erro ao listar contribuições:", error);

        return NextResponse.json(
            { erro: "Não foi possível carregar as contribuições." },
            { status: 500 }
        );
    }
}

// Registra uma nova contribuição.
export async function POST(request: Request) {
    let fotoUrl: string | null = null;

    try {
        const formulario = await request.formData();

        const estabelecimentoId = Number(
            formulario.get("estabelecimento_id")
        );

        const tipo = formulario.get("tipo_acessibilidade");
        const informacao = formulario.get("informacao_proposta");
        const nome = formulario.get("nome_contribuidor");
        const relato = formulario.get("relato");
        const foto = formulario.get("foto");

        if (
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
            nome !== null &&
            (typeof nome !== "string" || nome.trim().length > 100)
        ) {
            return NextResponse.json(
                { erro: "O nome deve ter no máximo 100 caracteres." },
                { status: 400 }
            );
        }

        if (
            relato !== null &&
            (typeof relato !== "string" || relato.length > 5000)
        ) {
            return NextResponse.json(
                { erro: "O relato deve ter no máximo 5000 caracteres." },
                { status: 400 }
            );
        }

        let arquivo: File | null = null;

        const extensoes: Record<string, string> = {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/webp": "webp",
        };

        if (foto !== null) {
            if (!(foto instanceof File) || foto.size === 0) {
                return NextResponse.json(
                    { erro: "O arquivo enviado é inválido." },
                    { status: 400 }
                );
            }

            if (foto.size > 4 * 1024 * 1024) {
                return NextResponse.json(
                    { erro: "A fotografia deve ter no máximo 4 MB." },
                    { status: 400 }
                );
            }

            if (!extensoes[foto.type]) {
                return NextResponse.json(
                    {
                        erro: "Formato inválido. Envie uma imagem JPEG, PNG ou WebP.",
                    },
                    { status: 400 }
                );
            }

            arquivo = foto;
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

        if (arquivo) {
            const nomeArquivo = `contribuicoes/${randomUUID()}.${extensoes[arquivo.type]}`;

            const blob = await put(nomeArquivo, arquivo, {
                access: "public",
                contentType: arquivo.type,
            });

            fotoUrl = blob.url;
        }

        const [resultado] = await pool.execute<ResultSetHeader>(
            `INSERT INTO contribuicoes (
                estabelecimento_id,
                nome_contribuidor,
                tipo_acessibilidade,
                informacao_proposta,
                relato,
                foto_url
            ) VALUES (?, ?, ?, ?, ?, ?)`,
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
                fotoUrl,
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
                    foto_url: fotoUrl,
                    status: "pendente",
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao registrar contribuição:", error);

        if (fotoUrl) {
            try {
                await del(fotoUrl);
            } catch (erroExclusao) {
                console.error(
                    "Não foi possível excluir a fotografia do Blob:",
                    erroExclusao
                );
            }
        }

        return NextResponse.json(
            { erro: "Não foi possível registrar a contribuição." },
            { status: 500 }
        );
    }
}

// Aprova ou rejeita uma contribuição.
export async function PATCH(request: Request) {
    const autenticado = await isAdmin();

    if (!autenticado) {
        return NextResponse.json(
            { erro: "Acesso não autorizado." },
            { status: 401 }
        );
    }

    let conexao;

    try {
        const corpo: unknown = await request.json();

        if (
            typeof corpo !== "object" ||
            corpo === null ||
            Array.isArray(corpo)
        ) {
            return NextResponse.json(
                { erro: "Dados inválidos." },
                { status: 400 }
            );
        }

        const dados = corpo as Record<string, unknown>;
        const id = dados.id;
        const acao = dados.acao;

        if (
            typeof id !== "number" ||
            !Number.isSafeInteger(id) ||
            id <= 0
        ) {
            return NextResponse.json(
                { erro: "Identificador inválido." },
                { status: 400 }
            );
        }

        if (acao !== "aprovar" && acao !== "rejeitar") {
            return NextResponse.json(
                { erro: "Ação inválida." },
                { status: 400 }
            );
        }

        conexao = await pool.getConnection();
        await conexao.beginTransaction();

        const [registros] = await conexao.execute<
            ContribuicaoParaModeracao[]
        >(
            `SELECT
                id,
                estabelecimento_id,
                tipo_acessibilidade,
                informacao_proposta,
                status
            FROM contribuicoes
            WHERE id = ?
            FOR UPDATE`,
            [id]
        );

        const contribuicao = registros[0];

        if (!contribuicao) {
            await conexao.rollback();

            return NextResponse.json(
                { erro: "Contribuição não encontrada." },
                { status: 404 }
            );
        }

        if (contribuicao.status !== "pendente") {
            await conexao.rollback();

            return NextResponse.json(
                { erro: "Esta contribuição já foi analisada." },
                { status: 409 }
            );
        }

        if (acao === "aprovar") {
            const campos: Record<string, string> = {
                rampa_acesso: "rampa_acesso",
                banheiro_adaptado: "banheiro_adaptado",
                vaga_reservada: "vaga_reservada",
            };

            const campo = campos[contribuicao.tipo_acessibilidade];

            const valores: Record<string, string> = {
                Sim: "sim",
                "Não": "nao",
            };

            const valor = valores[contribuicao.informacao_proposta];

            if (campo && valor) {
                await conexao.execute(
                    `UPDATE estabelecimentos
                    SET ${campo} = ?,
                        fonte_verificacao = ?,
                        atualizado_em = CURRENT_TIMESTAMP
                    WHERE id = ?`,
                    [
                        valor,
                        "informado_por_usuario",
                        contribuicao.estabelecimento_id,
                    ]
                );
            }
        }

        const novoStatus =
            acao === "aprovar" ? "aprovada" : "rejeitada";

        await conexao.execute(
            `UPDATE contribuicoes
            SET status = ?
            WHERE id = ?`,
            [novoStatus, id]
        );

        await conexao.commit();

        return NextResponse.json({
            mensagem: "Moderação realizada com sucesso.",
            contribuicao: {
                id,
                status: novoStatus,
            },
        });
    } catch (error) {
        if (conexao) {
            await conexao.rollback();
        }

        console.error("Erro ao moderar contribuição:", error);

        return NextResponse.json(
            { erro: "Não foi possível processar a moderação." },
            { status: 500 }
        );
    } finally {
        conexao?.release();
    }
}
