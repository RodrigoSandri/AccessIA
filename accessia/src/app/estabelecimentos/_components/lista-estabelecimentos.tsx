
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface Estabelecimento {
    id: number;
    nome: string;
    cidade: string;
    categoria: string;
}

interface ListaEstabelecimentosProps {
    estabelecimentos: Estabelecimento[];
}

export default function ListaEstabelecimentos({
    estabelecimentos,
}: ListaEstabelecimentosProps) {
    const [busca, setBusca] = useState("");
    const [categoria, setCategoria] = useState("todas");

    const categorias = useMemo(
        () =>
            [...new Set(estabelecimentos.map((item) => item.categoria))]
                .sort((a, b) => a.localeCompare(b, "pt-BR")),
        [estabelecimentos]
    );

    const filtrados = useMemo(() => {
        const termo = busca.trim().toLocaleLowerCase("pt-BR");

        return estabelecimentos.filter((item) => {
            const correspondeBusca =
                item.nome.toLocaleLowerCase("pt-BR").includes(termo) ||
                item.cidade.toLocaleLowerCase("pt-BR").includes(termo);

            const correspondeCategoria =
                categoria === "todas" || item.categoria === categoria;

            return correspondeBusca && correspondeCategoria;
        });
    }, [estabelecimentos, busca, categoria]);

    return (
        <div>
            <div className="mb-6 grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="buscar-estabelecimento"
                        className="mb-2 block text-sm font-semibold text-zinc-800"
                    >
                        Buscar estabelecimento
                    </label>
                    <input
                        id="buscar-estabelecimento"
                        type="search"
                        value={busca}
                        onChange={(event) => setBusca(event.target.value)}
                        placeholder="Digite o nome ou a cidade"
                        className="min-h-12 w-full rounded-lg border border-zinc-300 px-4 text-zinc-900 outline-offset-2 focus-visible:outline-2 focus-visible:outline-blue-700"
                    />
                </div>

                <div>
                    <label
                        htmlFor="filtrar-categoria"
                        className="mb-2 block text-sm font-semibold text-zinc-800"
                    >
                        Filtrar por categoria
                    </label>
                    <select
                        id="filtrar-categoria"
                        value={categoria}
                        onChange={(event) => setCategoria(event.target.value)}
                        className="min-h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-zinc-900 outline-offset-2 focus-visible:outline-2 focus-visible:outline-blue-700"
                    >
                        <option value="todas">Todas as categorias</option>
                        {categorias.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <p className="mb-4 text-sm text-zinc-600" aria-live="polite">
                {filtrados.length}{" "}
                {filtrados.length === 1
                    ? "estabelecimento encontrado"
                    : "estabelecimentos encontrados"}
            </p>

            {filtrados.length === 0 ? (
                <section
                    className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center"
                    aria-live="polite"
                >
                    <h2 className="text-xl font-semibold text-zinc-900">
                        Nenhum resultado encontrado
                    </h2>
                    <p className="mt-2 text-zinc-600">
                        Tente outro nome, cidade ou categoria.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setBusca("");
                            setCategoria("todas");
                        }}
                        className="mt-4 min-h-11 rounded-lg border border-zinc-300 px-4 py-2 font-semibold text-zinc-800 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                        Limpar filtros
                    </button>
                </section>
            ) : (
                <section
                    aria-label="Lista de estabelecimentos"
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {filtrados.map((estabelecimento) => (
                        <article
                            key={estabelecimento.id}
                            className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                        >
                            <h2 className="text-xl font-bold text-zinc-900">
                                {estabelecimento.nome}
                            </h2>

                            <div className="mt-3 space-y-2 text-sm text-zinc-700">
                                <p>
                                    <span className="font-semibold">
                                        Cidade:
                                    </span>{" "}
                                    {estabelecimento.cidade}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Categoria:
                                    </span>{" "}
                                    {estabelecimento.categoria}
                                </p>
                            </div>

                            <Link
                                href={`/estabelecimentos/${estabelecimento.id}`}
                                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                            >
                                Ver detalhes
                            </Link>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}
