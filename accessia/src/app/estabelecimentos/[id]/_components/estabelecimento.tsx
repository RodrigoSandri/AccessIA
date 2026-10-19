
interface EstabelecimentoProps {
    id: number;
    nome: string;
    cidade: string;
    categoria: string;
    endereco: string;
    descricao: string;
    rampa_acesso: string;
    banheiro_adaptado: string;
    vaga_reservada: string;
}

interface EstabelecimentoInfoProps {
    id: string;
}

function formatarAcessibilidade(valor: string): string {
    const valores: Record<string, string> = {
        sim: "Sim",
        nao: "Não",
        parcial: "Parcial",
        nao_verificado: "Não verificado",
    };

    return valores[valor] ?? valor;
}

export async function EstabelecimentoInfo({
    id,
}: EstabelecimentoInfoProps) {
    const response = await fetch(
        "http://localhost:3000/api/estabelecimentos",
        { cache: "no-store" }
    );

    if (!response.ok) {
        throw new Error(
            "Não foi possível carregar os estabelecimentos."
        );
    }

    const estabelecimentos: EstabelecimentoProps[] =
        await response.json();

    const data = estabelecimentos.find(
        (estabelecimento) => estabelecimento.id === Number(id)
    );

    if (!data) {
        return <p>Estabelecimento não encontrado.</p>;
    }

    return (
        <section className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-bold text-zinc-900">
                    {data.nome}
                </h2>

                <div className="space-y-2 text-zinc-700">
                    <p>
                        <strong>Cidade:</strong> {data.cidade}
                    </p>
                    <p>
                        <strong>Categoria:</strong> {data.categoria}
                    </p>
                    <p>
                        <strong>Endereço:</strong> {data.endereco}
                    </p>
                    <p>
                        <strong>Descrição:</strong> {data.descricao}
                    </p>
                </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-bold text-zinc-900">
                    Informações de acessibilidade
                </h3>

                <div className="space-y-3 text-zinc-700">
                    <p>
                        <strong>Rampa de acesso:</strong>{" "}
                        {formatarAcessibilidade(data.rampa_acesso)}
                    </p>
                    <p>
                        <strong>Banheiro adaptado:</strong>{" "}
                        {formatarAcessibilidade(data.banheiro_adaptado)}
                    </p>
                    <p>
                        <strong>Vaga reservada:</strong>{" "}
                        {formatarAcessibilidade(data.vaga_reservada)}
                    </p>
                </div>
            </div>
        </section>
    );
}
