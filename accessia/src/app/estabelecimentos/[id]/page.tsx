interface DetailEstabelecimentoProps {
  params: Promise<{
    id: string;
  }>;
}

interface Estabelecimento {
  id: number;
  nome: string;
  cidade: string;
  categoria: string;
}

export default async function DetailEstabelecimento({
  params,
}: DetailEstabelecimentoProps) {
  const { id } = await params;

  const response = await fetch(
    "http://localhost:3000/api/estabelecimentos"
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar estabelecimentos");
  }

  const estabelecimentos: Estabelecimento[] =
    await response.json();

  const estabelecimento = estabelecimentos.find(
  (item) => item.id === Number(id)
);

if (!estabelecimento) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">
        Estabelecimento não encontrado
      </h1>
    </main>
  );
}

await new Promise((resolve) => setTimeout(resolve, 4000));

return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">
        Detalhes do Estabelecimento
      </h1>

      <h2 className="text-xl font-bold">
        {estabelecimento.nome}
      </h2>

      <p>Cidade: {estabelecimento.cidade}</p>
      <p>Categoria: {estabelecimento.categoria}</p>
      <p>ID: {estabelecimento.id}</p>
    </main>
  );
}
