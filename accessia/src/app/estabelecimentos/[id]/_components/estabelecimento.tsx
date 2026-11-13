
import { pool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import { Avaliacoes } from "./avaliacoes";

interface EstabelecimentoProps extends RowDataPacket {
    id: number;
    nome: string;
    cidade: string;
    categoria: string;
    endereco: string | null;
    descricao: string | null;
    rampa_acesso: string | null;
    banheiro_adaptado: string | null;
    vaga_reservada: string | null;
    fonte_verificacao: string | null;
}

interface FotoContribuicao extends RowDataPacket {
    id: number;
    foto_url: string;
    relato: string | null;
    criado_em: string;
}

interface EstabelecimentoInfoProps {
    id: string;
}

function obterStatus(valor: string | null) {
    const normalizado = valor?.trim().toLowerCase();

    const status: Record<string, { texto: string; estilo: string }> = {
        sim: {
            texto: "Sim",
            estilo: "bg-green-100 text-green-800",
        },
        nao: {
            texto: "Não",
            estilo: "bg-red-100 text-red-800",
        },
        parcial: {
            texto: "Parcial",
            estilo: "bg-yellow-100 text-yellow-800",
        },
        nao_verificado: {
            texto: "Não verificado",
            estilo: "bg-zinc-100 text-zinc-700",
        },
        "nao sei informar": {
            texto: "Não verificado",
            estilo: "bg-zinc-100 text-zinc-700",
        },
    };

    return (
        status[normalizado ?? ""] ?? {
            texto: valor || "Não informado",
            estilo: "bg-zinc-100 text-zinc-700",
        }
    );
}

function obterFonteVerificacao(valor: string | null) {
    const fontes: Record<string, string> = {
        nao_verificado: "Não verificado",
        informado_por_usuario: "Informado por usuário",
        verificado: "Verificado",
    };

    if (!valor?.trim()) {
        return "Não informado";
    }

    return fontes[valor.trim().toLowerCase()] ?? valor;
}

function ItemAcessibilidade({
    titulo,
    valor,
}: {
    titulo: string;
    valor: string | null;
}) {
    const status = obterStatus(valor);

    return (
        <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-medium text-zinc-800">
                {titulo}
            </span>

            <span
                className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${status.estilo}`}
            >
                {status.texto}
            </span>
        </div>
    );
}

export async function EstabelecimentoInfo({
    id,
}: EstabelecimentoInfoProps) {
    const idNumerico = Number(id);

    if (!Number.isSafeInteger(idNumerico) || idNumerico <= 0) {
        return (
            <p className="text-center text-zinc-700" role="alert">
                Estabelecimento não encontrado.
            </p>
        );
    }

    let estabelecimento: EstabelecimentoProps | undefined;
    let fotografias: FotoContribuicao[] = [];

    try {
        const [rows] = await pool.execute<EstabelecimentoProps[]>(
            `SELECT
                id,
                nome,
                cidade,
                categoria,
                endereco,
                descricao,
                rampa_acesso,
                banheiro_adaptado,
                vaga_reservada,
                fonte_verificacao
            FROM estabelecimentos
            WHERE id = ?`,
            [idNumerico]
        );

        estabelecimento = rows[0];
    } catch (error) {
        console.error("Erro ao carregar estabelecimento:", error);

        return (
            <p className="text-center text-red-700" role="alert">
                Não foi possível carregar os dados. Tente novamente mais tarde.
            </p>
        );
    }

    if (!estabelecimento) {
        return (
            <p className="text-center text-zinc-700">
                Estabelecimento não encontrado.
            </p>
        );
    }

    try {
        const [fotos] = await pool.execute<FotoContribuicao[]>(
            `SELECT
                id,
                foto_url,
                relato,
                criado_em
            FROM contribuicoes
            WHERE estabelecimento_id = ?
                AND status = 'aprovada'
                AND foto_url IS NOT NULL
            ORDER BY criado_em DESC`,
            [idNumerico]
        );

        fotografias = fotos;
    } catch (error) {
        console.error("Erro ao carregar fotografias:", error);
    }

    return (
        <section className="mx-auto max-w-4xl space-y-6">

            {/* Identificação do estabelecimento */}
            <header className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                    {estabelecimento.categoria}
                </span>

                <h2 className="mt-4 text-2xl font-bold text-zinc-900 sm:text-3xl">
                    {estabelecimento.nome}
                </h2>

                <p className="mt-2 text-zinc-600">
                    {estabelecimento.cidade}
                </p>
            </header>

            {/* Informações gerais */}
            <section
                aria-labelledby="informacoes-gerais"
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
            >
                <h3
                    id="informacoes-gerais"
                    className="mb-5 text-xl font-bold text-zinc-900"
                >
                    Informações do estabelecimento
                </h3>

                <dl className="space-y-4">
                    <div>
                        <dt className="font-semibold text-zinc-800">
                            Endereço
                        </dt>
                        <dd className="mt-1 text-zinc-600">
                            {estabelecimento.endereco || "Não informado"}
                        </dd>
                    </div>

                    <div>
                        <dt className="font-semibold text-zinc-800">
                            Descrição
                        </dt>
                        <dd className="mt-1 whitespace-pre-line text-zinc-600">
                            {estabelecimento.descricao || "Não informada"}
                        </dd>
                    </div>
                </dl>
            </section>

            {/* Informações de acessibilidade */}
            <section
                aria-labelledby="informacoes-acessibilidade"
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
            >
                <h3
                    id="informacoes-acessibilidade"
                    className="text-xl font-bold text-zinc-900"
                >
                    Informações de acessibilidade
                </h3>

                <p className="mb-5 mt-2 text-sm text-zinc-600">
                    Consulte as informações disponíveis sobre os recursos
                    de acessibilidade deste estabelecimento.
                </p>

                <div className="space-y-3">
                    <ItemAcessibilidade
                        titulo="Rampa de acesso"
                        valor={estabelecimento.rampa_acesso}
                    />

                    <ItemAcessibilidade
                        titulo="Banheiro adaptado"
                        valor={estabelecimento.banheiro_adaptado}
                    />

                    <ItemAcessibilidade
                        titulo="Vaga reservada"
                        valor={estabelecimento.vaga_reservada}
                    />
                </div>
            </section>

            {/* Origem e verificação */}
            <section
                aria-labelledby="origem-verificacao"
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
            >
                <h3
                    id="origem-verificacao"
                    className="text-xl font-bold text-zinc-900"
                >
                    Origem e verificação das informações
                </h3>

                <p className="mt-2 text-sm text-zinc-600">
                    Consulte a situação das informações registradas
                    sobre este estabelecimento.
                </p>

                <div className="mt-4 rounded-lg bg-zinc-50 p-4">
                    <p className="font-semibold text-zinc-800">
                        Situação das informações
                    </p>

                    <p className="mt-2 text-zinc-700">
                        {obterFonteVerificacao(
                            estabelecimento.fonte_verificacao
                        )}
                    </p>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                    As informações apresentadas não representam,
                    por si só, uma certificação de acessibilidade.
                </p>
            </section>

            {/* Fotografias enviadas pelos usuários */}
            <section
                aria-labelledby="fotografias-estabelecimento"
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
            >
                <h3
                    id="fotografias-estabelecimento"
                    className="text-xl font-bold text-zinc-900"
                >
                    Fotografias do estabelecimento
                </h3>

                <p className="mt-2 text-sm text-zinc-600">
                    Imagens compartilhadas pelos usuários e aprovadas pela moderação.
                </p>

                {fotografias.length === 0 ? (
                    <p className="mt-5 rounded-lg bg-zinc-50 p-4 text-sm text-zinc-600">
                        Ainda não há fotografias aprovadas para este estabelecimento.
                    </p>
                ) : (
                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {fotografias.map((foto) => (
                            <article
                                key={foto.id}
                                className="overflow-hidden rounded-lg border border-zinc-200"
                            >
                                <img
                                    src={foto.foto_url}
                                    alt={`Fotografia do estabelecimento ${estabelecimento.nome}`}
                                    loading="lazy"
                                    className="h-56 w-full object-cover"
                                />

                                <div className="p-4">
                                    {foto.relato && (
                                        <p className="whitespace-pre-line text-sm text-zinc-700">
                                            {foto.relato}
                                        </p>
                                    )}

                                    <p className="mt-2 text-xs text-zinc-500">
                                        Enviada em{" "}
                                        {new Date(foto.criado_em).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {/* Avaliações dos usuários */}
            <Avaliacoes estabelecimentoId={idNumerico} />

        </section>
    );
}
