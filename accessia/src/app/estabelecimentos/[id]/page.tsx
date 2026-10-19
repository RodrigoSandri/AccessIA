
import { EstabelecimentoInfo } from "./_components/estabelecimento";

interface DetalhesEstabelecimentoProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DetalhesEstabelecimento({
  params,
}: DetalhesEstabelecimentoProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold text-zinc-900">
        Detalhes do Estabelecimento
      </h1>

      <EstabelecimentoInfo id={id} />
    </main>
  );
}
