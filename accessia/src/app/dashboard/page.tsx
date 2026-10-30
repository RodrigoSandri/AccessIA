
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DadosDashboard {
    estabelecimentos: number;
    contribuicoes: number;
    pendentes: number;
}

export default function Dashboard() {
    const router = useRouter();

    const [dados, setDados] = useState<DadosDashboard | null>(null);
    const [erro, setErro] = useState(false);
    const [saindo, setSaindo] = useState(false);
    const [erroLogout, setErroLogout] = useState("");

    useEffect(() => {
        async function carregarDados() {
            try {
                const resposta = await fetch("/api/dashboard", {
                    cache: "no-store",
                });

                if (!resposta.ok) {
                    throw new Error("Falha ao carregar o dashboard.");
                }

                const resultado: DadosDashboard = await resposta.json();
                setDados(resultado);
            } catch {
                setErro(true);
            }
        }

        carregarDados();
    }, []);

    async function sair() {
        setSaindo(true);
        setErroLogout("");

        try {
            const resposta = await fetch("/api/auth", {
                method: "DELETE",
            });

            if (!resposta.ok) {
                throw new Error("Não foi possível encerrar a sessão.");
            }

            router.replace("/login");
            router.refresh();
        } catch {
            setErroLogout("Não foi possível sair. Tente novamente.");
            setSaindo(false);
        }
    }

    const cards = [
        {
            titulo: "Estabelecimentos",
            valor: dados?.estabelecimentos,
            descricao: "Lugares cadastrados na plataforma",
            simbolo: "⌖",
            cor: "bg-blue-100 text-blue-700",
        },
        {
            titulo: "Contribuições",
            valor: dados?.contribuicoes,
            descricao: "Informações compartilhadas pela comunidade",
            simbolo: "♡",
            cor: "bg-teal-100 text-teal-700",
        },
        {
            titulo: "Contribuições pendentes",
            valor: dados?.pendentes,
            descricao: "Informações que aguardam verificação",
            simbolo: "◷",
            cor: "bg-amber-100 text-amber-700",
        },
    ];

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Visão geral da plataforma AccessIA
                    </p>
                </div>

                <button
                    type="button"
                    onClick={sair}
                    disabled={saindo}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saindo ? "Saindo..." : "Sair"}
                </button>
            </header>

            {erroLogout && (
                <p
                    role="alert"
                    className="mb-5 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800"
                >
                    {erroLogout}
                </p>
            )}

            <section aria-labelledby="resumo-titulo">
                <h2
                    id="resumo-titulo"
                    className="mb-5 text-xl font-semibold text-gray-900"
                >
                    Resumo geral
                </h2>

                {erro && (
                    <p
                        role="alert"
                        className="mb-5 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800"
                    >
                        Não foi possível carregar os dados. Atualize a página
                        e tente novamente.
                    </p>
                )}

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card) => (
                        <article
                            key={card.titulo}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                        >
                            <div
                                className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${card.cor}`}
                                aria-hidden="true"
                            >
                                <span className="text-xl">
                                    {card.simbolo}
                                </span>
                            </div>

                            <h3 className="text-sm font-medium text-gray-500">
                                {card.titulo}
                            </h3>

                            <p
                                className="mt-2 text-3xl font-bold text-gray-900"
                                aria-live="polite"
                            >
                                {card.valor === undefined ? "—" : card.valor}
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                {card.descricao}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-blue-950">
                    Ajude a tornar os lugares mais acessíveis
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-blue-900">
                    Compartilhe informações sobre acessibilidade e ajude
                    outras pessoas a escolher seus destinos com mais confiança.
                </p>

                <a
                    href="/contribuir"
                    className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                    Fazer contribuição
                </a>
            </section>

            <footer className="mt-8 text-center text-sm text-gray-500">
                AccessIA — Acessibilidade com informação e colaboração.
            </footer>
        </main>
    );
}
