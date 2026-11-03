
"use client";

import { useEffect, useState } from "react";

interface Contribuicao {
    id: number;
    estabelecimento_id: number;
    estabelecimento_nome: string;
    nome_contribuidor: string | null;
    tipo_acessibilidade: string;
    informacao_proposta: string;
    relato: string | null;
    status: string;
    origem: string;
}

function formatarTipo(tipo: string) {
    const tipos: Record<string, string> = {
        rampa_acesso: "Rampa de acesso",
        banheiro_adaptado: "Banheiro adaptado",
        vaga_reservada: "Vaga reservada",
        outro: "Outro recurso de acessibilidade",
    };

    return tipos[tipo] ?? tipo;
}

function formatarStatus(status: string) {
    const statusFormatados: Record<string, string> = {
        pendente: "Pendente",
        aprovada: "Aprovada",
        rejeitada: "Rejeitada",
    };

    return statusFormatados[status] ?? status;
}

export default function ModeracaoContribuicoes() {
    const [contribuicoes, setContribuicoes] = useState<Contribuicao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [processando, setProcessando] = useState<number | null>(null);

    async function carregarContribuicoes() {
        try {
            setErro("");

            const resposta = await fetch("/api/contribuicoes", {
                cache: "no-store",
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.erro ||
                    "Não foi possível carregar as contribuições."
                );
            }

            setContribuicoes(resultado.contribuicoes);
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Ocorreu um erro ao carregar as contribuições."
            );
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarContribuicoes();
    }, []);

    async function moderarContribuicao(
        id: number,
        acao: "aprovar" | "rejeitar"
    ) {
        const confirmacao =
            acao === "aprovar"
                ? "Deseja realmente aprovar esta contribuição?"
                : "Deseja realmente rejeitar esta contribuição?";

        if (!window.confirm(confirmacao)) {
            return;
        }

        setProcessando(id);
        setErro("");
        setMensagem("");

        try {
            const resposta = await fetch("/api/contribuicoes", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, acao }),
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.erro ||
                    "Não foi possível processar a contribuição."
                );
            }

            setContribuicoes((anteriores) =>
                anteriores.map((contribuicao) =>
                    contribuicao.id === id
                        ? {
                              ...contribuicao,
                              status: resultado.contribuicao.status,
                          }
                        : contribuicao
                )
            );

            setMensagem(
                acao === "aprovar"
                    ? "Contribuição aprovada com sucesso."
                    : "Contribuição rejeitada com sucesso."
            );
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Ocorreu um erro durante a moderação."
            );
        } finally {
            setProcessando(null);
        }
    }

    const pendentes = contribuicoes.filter(
        (contribuicao) => contribuicao.status === "pendente"
    ).length;

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Moderação de contribuições
                </h1>

                <p className="mt-2 text-gray-600">
                    Consulte as informações enviadas pelos usuários e analise
                    as contribuições recebidas pelo AccessIA.
                </p>
            </header>

            <section aria-labelledby="lista-contribuicoes">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <h2
                        id="lista-contribuicoes"
                        className="text-xl font-semibold text-gray-900"
                    >
                        Contribuições recebidas
                    </h2>

                    <div className="flex flex-wrap gap-2 text-sm font-semibold">
                        <span className="rounded-full bg-blue-100 px-4 py-2 text-blue-800">
                            {contribuicoes.length} registros
                        </span>

                        <span className="rounded-full bg-yellow-100 px-4 py-2 text-yellow-800">
                            {pendentes} pendentes
                        </span>
                    </div>
                </div>

                {mensagem && (
                    <p
                        role="status"
                        className="mb-5 rounded-lg bg-green-50 p-4 text-green-800"
                    >
                        {mensagem}
                    </p>
                )}

                {erro && (
                    <p
                        role="alert"
                        className="mb-5 rounded-lg bg-red-50 p-4 text-red-700"
                    >
                        {erro}
                    </p>
                )}

                {carregando && (
                    <p className="py-8 text-center text-gray-600">
                        Carregando contribuições...
                    </p>
                )}

                {!carregando && !erro && contribuicoes.length === 0 && (
                    <p className="rounded-lg border border-gray-200 p-8 text-center text-gray-600">
                        Nenhuma contribuição foi encontrada.
                    </p>
                )}

                <div className="space-y-5">
                    {contribuicoes.map((contribuicao) => (
                        <article
                            key={contribuicao.id}
                            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                        >
                            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {contribuicao.estabelecimento_nome}
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Contribuição #{contribuicao.id}
                                    </p>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                        contribuicao.status === "pendente"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : contribuicao.status === "aprovada"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {formatarStatus(contribuicao.status)}
                                </span>
                            </div>

                            <div className="grid gap-4 text-sm sm:grid-cols-2">
                                <div>
                                    <p className="font-semibold text-gray-700">
                                        Recurso de acessibilidade
                                    </p>
                                    <p className="mt-1 text-gray-600">
                                        {formatarTipo(
                                            contribuicao.tipo_acessibilidade
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-700">
                                        Informação proposta
                                    </p>
                                    <p className="mt-1 text-gray-600">
                                        {contribuicao.informacao_proposta}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-700">
                                        Contribuidor
                                    </p>
                                    <p className="mt-1 text-gray-600">
                                        {contribuicao.nome_contribuidor ||
                                            "Anônimo"}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-700">
                                        Origem
                                    </p>
                                    <p className="mt-1 text-gray-600">
                                        {contribuicao.origem}
                                    </p>
                                </div>
                            </div>

                            {contribuicao.relato && (
                                <div className="mt-4">
                                    <p className="font-semibold text-gray-700">
                                        Relato
                                    </p>
                                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                                        {contribuicao.relato}
                                    </p>
                                </div>
                            )}

                            {contribuicao.status === "pendente" && (
                                <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            moderarContribuicao(
                                                contribuicao.id,
                                                "aprovar"
                                            )
                                        }
                                        disabled={processando !== null}
                                        className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processando === contribuicao.id
                                            ? "Processando..."
                                            : "Aprovar"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            moderarContribuicao(
                                                contribuicao.id,
                                                "rejeitar"
                                            )
                                        }
                                        disabled={processando !== null}
                                        className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Rejeitar
                                    </button>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
