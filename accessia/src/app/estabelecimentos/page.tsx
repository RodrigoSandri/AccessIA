
import Link from "next/link";

interface EstabelecimentosProps {
  id: number;
  nome: string;
  cidade: string;
  categoria: string;
}

export default async function EstabelecimentosPage() {
  const response = await fetch(
    "http://localhost:3000/api/estabelecimentos"
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar estabelecimentos");
  }

  const data: EstabelecimentosProps[] = await response.json();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 mt-5 text-center text-3xl font-bold text-zinc-900">
        Todos os Estabelecimentos encontrados
      </h1>

      <div className="flex flex-col gap-4">
        {data.map((estabelecimento) => (
          <div
            key={estabelecimento.id}
            className="rounded-lg bg-zinc-200 p-4 shadow-sm transition hover:bg-zinc-300"
          >
            <h2 className="mb-2 text-lg font-bold text-zinc-900">
              <Link
                href={`/estabelecimentos/${estabelecimento.id}`}
                className="hover:underline"
              >
                {estabelecimento.nome}
              </Link>
            </h2>

            <p className="text-sm text-zinc-700">
              <span className="font-semibold">Cidade:</span>{" "}
              {estabelecimento.cidade}
            </p>

            <p className="text-sm text-zinc-700">
              <span className="font-semibold">Categoria:</span>{" "}
              {estabelecimento.categoria}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
