
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Recompensas | AccessIA",
    description:
        "Conheça o sistema de reconhecimento e participação colaborativa do AccessIA.",
};

export default function RecompensasPage() {
    return (
        <main className="flex-1 bg-zinc-50">
            <section className="bg-zinc-900 px-4 py-16 text-white sm:py-20">
                <div className="mx-auto max-w-7xl">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-teal-300">
                        Participação e reconhecimento
                    </p>

                    <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                        Sua contribuição ajuda a construir lugares mais acessíveis.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                        O AccessIA valoriza a participação da comunidade na
                        divulgação de informações sobre acessibilidade.
                    </p>

                    <Link
                        href="/contribuir"
                        className="mt-8 inline-flex rounded-xl bg-teal-500 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-teal-400"
                    >
                        Fazer uma contribuição
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-14">
                <div className="grid gap-6 md:grid-cols-2">
                    <article className="rounded-xl border border-zinc-200 bg-white p-7 shadow-sm">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-2xl">
                            <span aria-hidden="true">★</span>
                        </div>

                        <h2 className="text-xl font-bold text-zinc-900">
                            Pontuação
                        </h2>

                        <p className="mt-3 leading-7 text-zinc-600">
                            A proposta é reconhecer a participação de pessoas
                            que compartilham informações e ajudam a melhorar
                            os dados de acessibilidade dos estabelecimentos.
                        </p>

                        <span className="mt-6 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                            Em desenvolvimento
                        </span>
                    </article>

                    <article className="rounded-xl border border-zinc-200 bg-white p-7 shadow-sm">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-2xl">
                            <span aria-hidden="true">🎁</span>
                        </div>

                        <h2 className="text-xl font-bold text-zinc-900">
                            Recompensas
                        </h2>

                        <p className="mt-3 leading-7 text-zinc-600">
                            Futuramente, poderão existir formas de
                            reconhecimento para incentivar a colaboração
                            e a participação da comunidade.
                        </p>

                        <span className="mt-6 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                            Em desenvolvimento
                        </span>
                    </article>
                </div>
            </section>

            <section className="border-t border-zinc-200 bg-white px-4 py-14">
                <div className="mx-auto max-w-7xl text-center">
                    <h2 className="text-2xl font-bold text-zinc-900">
                        Faça parte dessa iniciativa
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-600">
                        Compartilhe informações, avalie estabelecimentos e
                        contribua para que mais pessoas encontrem lugares
                        adequados às suas necessidades.
                    </p>

                    <Link
                        href="/estabelecimentos"
                        className="mt-7 inline-flex rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
                    >
                        Explorar estabelecimentos
                    </Link>
                </div>
            </section>
        </main>
    );
}
