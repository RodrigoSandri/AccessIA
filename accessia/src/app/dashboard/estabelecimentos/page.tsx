
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Estabelecimento {
    id: number;
    nome: string;
    cidade: string;
    categoria: string;
}

export default function EstabelecimentosAdminPage() {
    const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        async function carregarEstabelecimentos() {
            try {
                const resposta = await fetch("/api/estabelecimentos", {
                    cache: "no-store",
                });

                if (!resposta.ok) {
                    throw new Error("Não foi possível carregar os estabelecimentos.");
                }

                const dados: Estabelecimento[] = await resposta.json();
                setEstabelecimentos(dados);
            } catch {
                setErro("Não foi possível carregar os estabelecimentos.");
            } finally {
                setCarregando(false);
            }
        }

        carregarEstabelecimentos();
    }, []);

    async function excluirEstabelecimento(estabelecimento: Estabelecimento) {
        const confirmar = window.confirm(
            `Tem certeza de que deseja excluir "${estabelecimento.nome}"? Essa ação não poderá ser desfeita.`
        );

        if (!confirmar) {
            return;
        }

        setErro("");
        setMensagem("");
        setExcluindoId(estabelecimento.id);

        try {
            const resposta = await fetch(
                `/api/estabelecimentos/${estabelecimento.id}`,
                {
                    method: "DELETE",
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.erro || "Não foi possível excluir o estabelecimento."
                );
            }

            setEstabelecimentos((atuais) =>
                atuais.filter((item) => item.id !== estabelecimento.id)
            );

            setMensagem(dados.mensagem || "Estabelecimento excluído com sucesso.");
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Não foi possível excluir o estabelecimento."
            );
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Gerenciar estabelecimentos
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Cadastre, consulte, edite e exclua os estabelecimentos do AccessIA.
                    </p>
                </div>

                <Link
                    href="/dashboard"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-100"
                >
                    Voltar ao dashboard
                </Link>
            </header>

            <section className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        Total cadastrado
                    </p>

                    <p className="mt-1 text-3xl font-bold text-gray-900">
                        {carregando ? "—" : estabelecimentos.length}
                    </p>
                </div>

                <Link
                    href="/dashboard/estabelecimentos/novo"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                    + Novo estabelecimento
                </Link>
            </section>

            <section
                aria-labelledby="lista-titulo"
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <h2
                    id="lista-titulo"
                    className="mb-5 text-xl font-bold text-gray-900"
                >
                    Estabelecimentos cadastrados
                </h2>

                {mensagem && (
                    <p
                        role="status"
                        className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4 text-green-800"
                    >
                        {mensagem}
                    </p>
                )}

                {carregando && (
                    <p className="py-6 text-gray-600">
                        Carregando estabelecimentos...
                    </p>
                )}

                {erro && (
                    <p
                        role="alert"
                        className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800"
                    >
                        {erro}
                    </p>
                )}

                {!carregando && !erro && estabelecimentos.length === 0 && (
                    <p className="py-6 text-gray-600">
                        Nenhum estabelecimento cadastrado.
                    </p>
                )}

                {!carregando && estabelecimentos.length > 0 && (
                    <div className="divide-y divide-gray-200">
                        {estabelecimentos.map((estabelecimento) => (
                            <article
                                key={estabelecimento.id}
                                className="flex flex-wrap items-center justify-between gap-4 py-5"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {estabelecimento.nome}
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-600">
                                        {estabelecimento.cidade} · {estabelecimento.categoria}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Código: {estabelecimento.id}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <Link
                                        href={`/dashboard/estabelecimentos/${estabelecimento.id}/editar`}
                                        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-blue-700 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"
                                    >
                                        Editar
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => excluirEstabelecimento(estabelecimento)}
                                        disabled={excluindoId !== null}
                                        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-red-600 px-4 py-2 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {excluindoId === estabelecimento.id
                                            ? "Excluindo..."
                                            : "Excluir"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
