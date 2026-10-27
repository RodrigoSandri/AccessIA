
export default function Dashboard() {
    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <header className="mb-10">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <rect x="3" y="3" width="7" height="9" rx="1" />
                            <rect x="14" y="3" width="7" height="5" rx="1" />
                            <rect x="14" y="12" width="7" height="9" rx="1" />
                            <rect x="3" y="16" width="7" height="5" rx="1" />
                        </svg>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-gray-600">
                            Visão geral da plataforma AccessIA
                        </p>
                    </div>
                </div>
            </header>

            <section aria-labelledby="resumo-titulo">
                <h2
                    id="resumo-titulo"
                    className="mb-5 text-xl font-semibold text-gray-900"
                >
                    Resumo geral
                </h2>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <span className="text-xl" aria-hidden="true">⌖</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                            Estabelecimentos
                        </p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            Acompanhe
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Lugares cadastrados na plataforma
                        </p>
                    </article>

                    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                            <span className="text-xl" aria-hidden="true">♡</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                            Contribuições
                        </p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            Colabore
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Informações compartilhadas pela comunidade
                        </p>
                    </article>

                    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:col-span-2 lg:col-span-1">
                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                            <span className="text-xl" aria-hidden="true">◷</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                            Contribuições pendentes
                        </p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            Em análise
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Informações que aguardam verificação
                        </p>
                    </article>
                </div>
            </section>

            <section className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="text-xl font-bold text-blue-950">
                            Ajude a tornar os lugares mais acessíveis
                        </h2>
                        <p className="mt-3 leading-7 text-blue-900">
                            Compartilhe informações sobre acessibilidade e
                            ajude outras pessoas a escolher seus destinos
                            com mais confiança.
                        </p>
                    </div>

                    <a
                        href="/contribuir"
                        className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                        Fazer contribuição
                    </a>
                </div>
            </section>

            <footer className="mt-8 text-center text-sm text-gray-500">
                AccessIA — Acessibilidade com informação e colaboração.
            </footer>
        </main>
    );
}
