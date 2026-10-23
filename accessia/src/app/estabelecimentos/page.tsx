
import Link from "next/link";
import { pool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

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
          Estabelecimentos acessíveis
        </h1>

        <p className="mt-3 text-center text-zinc-600">
          Consulte as informações de acessibilidade dos estabelecimentos.
        </p>
      </header>

      {estabelecimentos.length === 0 ? (
        <section className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center">
          <h2 className="text-xl font-semibold text-zinc-900">
            Nenhum estabelecimento encontrado
          </h2>

          <p className="mt-2 text-zinc-600">
            Ainda não há estabelecimentos cadastrados.
          </p>
        </section>
      ) : (
        <section
          aria-label="Lista de estabelecimentos"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {estabelecimentos.map((estabelecimento) => (
            <article
              key={estabelecimento.id}
              className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h2 className="text-xl font-bold text-zinc-900">
                {estabelecimento.nome}
              </h2>

              <div className="mt-3 space-y-2 text-sm text-zinc-700">
                <p>
                  <span className="font-semibold">Cidade:</span>{" "}
                  {estabelecimento.cidade}
                </p>

                <p>
                  <span className="font-semibold">Categoria:</span>{" "}
                  {estabelecimento.categoria}
                </p>
              </div>

              <Link
                href={`/estabelecimentos/${estabelecimento.id}`}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 font-semibold text-white hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
              >
                Ver detalhes
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
