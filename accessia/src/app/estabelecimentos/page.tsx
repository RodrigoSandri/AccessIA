
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import ListaEstabelecimentos from "./_components/lista-estabelecimentos";

interface Estabelecimento extends RowDataPacket {
    id: number;
    nome: string;
    cidade: string;
    categoria: string;
}

export const dynamic = "force-dynamic";

export default async function EstabelecimentosPage() {
    const [estabelecimentos] = await pool.execute<Estabelecimento[]>(
        `SELECT id, nome, cidade, categoria
         FROM estabelecimentos
         ORDER BY id ASC`
    );

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-8">
            <header className="mb-8">
                <h1 className="text-center text-3xl font-bold text-zinc-900">
                    Encontre estabelecimentos
                </h1>

                <p className="mt-3 text-center text-zinc-600">
                    Pesquise lugares e consulte as informações de
                    acessibilidade disponíveis.
                </p>
            </header>

            {estabelecimentos.length === 0 ? (
                <section className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center">
                    <h2 className="text-xl font-semibold text-zinc-900">
                        Nenhum estabelecimento cadastrado
                    </h2>

                    <p className="mt-2 text-zinc-600">
                        Ainda não há estabelecimentos disponíveis na plataforma.
                    </p>
                </section>
            ) : (
                <ListaEstabelecimentos
                    estabelecimentos={estabelecimentos.map((item) => ({
                        id: item.id,
                        nome: item.nome,
                        cidade: item.cidade,
                        categoria: item.categoria,
                    }))}
                />
            )}
        </main>
    );
}
