
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AccessIA - Descubra lugares acessíveis",
    description:
        "Encontre estabelecimentos acessíveis, consulte informações de acessibilidade e escolha seu destino com mais autonomia e confiança.",
    openGraph: {
        title: "AccessIA - Descubra lugares acessíveis",
        description:
            "Encontre estabelecimentos acessíveis e consulte informações de acessibilidade.",
        images: ["/accessia-og.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
};

export default function Home() {
    return (
        <main className="flex-1">
            <section className="bg-zinc-900 px-4 py-20 text-white sm:py-28">
                <div className="mx-auto max-w-7xl text-center">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-teal-300">
                        Acessibilidade e inclusão
                    </p>

                    <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        Descubra lugares acessíveis com mais autonomia.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                        Consulte informações de acessibilidade sobre
                        estabelecimentos e encontre opções para planejar
                        seus destinos com mais confiança.
                    </p>

                    <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href="/estabelecimentos"
                            className="rounded-lg bg-teal-500 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-teal-400"
                        >
                            Encontrar estabelecimentos
                        </Link>

                        <Link
                            href="/contribuir"
                            className="rounded-lg border border-zinc-500 px-6 py-3 font-semibold text-white transition hover:bg-zinc-800"
                        >
                            Contribuir com informações
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-zinc-900">
                        Como funciona o AccessIA?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-zinc-600">
                        Uma plataforma colaborativa para facilitar o acesso
                        a informações sobre acessibilidade.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    <article className="rounded-xl border border-zinc-200 p-6">
                        <h3 className="text-xl font-semibold text-zinc-900">
                            1. Encontre
                        </h3>
                        <p className="mt-3 leading-7 text-zinc-600">
                            Consulte estabelecimentos cadastrados e encontre
                            informações sobre os locais.
                        </p>
                    </article>

                    <article className="rounded-xl border border-zinc-200 p-6">
                        <h3 className="text-xl font-semibold text-zinc-900">
                            2. Consulte
                        </h3>
                        <p className="mt-3 leading-7 text-zinc-600">
                            Verifique as informações de acessibilidade
                            disponíveis antes de escolher seu destino.
                        </p>
                    </article>

                    <article className="rounded-xl border border-zinc-200 p-6">
                        <h3 className="text-xl font-semibold text-zinc-900">
                            3. Colabore
                        </h3>
                        <p className="mt-3 leading-7 text-zinc-600">
                            Compartilhe informações que possam ajudar outras
                            pessoas a conhecer melhor os estabelecimentos.
                        </p>
                    </article>
                </div>
            </section>

            <section className="bg-zinc-100 px-4 py-14">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-2xl font-bold text-zinc-900">
                        A acessibilidade também se constrói em comunidade.
                    </h2>

                    <p className="mt-4 text-zinc-600">
                        Ajude a ampliar as informações disponíveis e
                        contribua para uma plataforma mais inclusiva.
                    </p>

                    <Link
                        href="/contribuir"
                        className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white transition hover:bg-zinc-700"
                    >
                        Quero contribuir
                    </Link>
                </div>
            </section>
        </main>
    );
}
