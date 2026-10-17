
interface EstabelecimentoProps {
    id: number;
    nome: string;
    cidade: string;
    categoria: string;
}

interface EstabelecimentoInfoProps {
    id: string;
}

export async function EstabelecimentoInfo({
    id,
}: EstabelecimentoInfoProps) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = await fetch(
        "http://localhost:3000/api/estabelecimentos"
    );

    if (!response.ok) {
        throw new Error("Não foi possível carregar os estabelecimentos.");
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
        <div>
            <h2>{data.nome}</h2>
            <p>{data.cidade}</p>
            <p>{data.categoria}</p>
        </div>
    );
}
