
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

interface Estabelecimento {
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

const opcoesAcessibilidade = [
    { valor: "nao_verificado", texto: "Não verificado" },
    { valor: "sim", texto: "Sim" },
    { valor: "nao", texto: "Não" },
    { valor: "parcial", texto: "Parcial" },
];

export default function EditarEstabelecimento() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [formulario, setFormulario] = useState<Estabelecimento | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarEstabelecimento() {
            try {
                const resposta = await fetch(`/api/estabelecimentos/${id}`);

                const dados = await resposta.json();

                if (!resposta.ok) {
                    throw new Error(dados.erro || "Não foi possível carregar o estabelecimento.");
                }

                setFormulario(dados);
            } catch (error) {
                setErro(
                    error instanceof Error
                        ? error.message
                        : "Erro ao carregar o estabelecimento."
                );
            } finally {
                setCarregando(false);
            }
        }

        if (id) {
            carregarEstabelecimento();
        }
    }, [id]);

    function atualizarCampo(
        campo: keyof Estabelecimento,
        valor: string
    ) {
        setFormulario((anterior) =>
            anterior ? { ...anterior, [campo]: valor } : anterior
        );
    }

    async function salvarAlteracoes(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!formulario) return;

        setSalvando(true);
        setErro("");

        try {
            const resposta = await fetch(`/api/estabelecimentos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: formulario.nome,
                    cidade: formulario.cidade,
                    categoria: formulario.categoria,
                    endereco: formulario.endereco,
                    descricao: formulario.descricao,
                    rampa_acesso: formulario.rampa_acesso,
                    banheiro_adaptado: formulario.banheiro_adaptado,
                    vaga_reservada: formulario.vaga_reservada,
                }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.erro || "Não foi possível salvar as alterações.");
            }

            router.push("/dashboard/estabelecimentos");
            router.refresh();
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao salvar as alterações."
            );
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return <main className="p-8">Carregando estabelecimento...</main>;
    }

    if (!formulario) {
        return (
            <main className="p-8">
                <p className="text-red-600">
                    {erro || "Estabelecimento não encontrado."}
                </p>
                <button
                    onClick={() => router.push("/dashboard/estabelecimentos")}
                    className="mt-4 rounded bg-gray-800 px-4 py-2 text-white"
                >
                    Voltar
                </button>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-3xl p-6">
            <h1 className="mb-6 text-2xl font-bold">
                Editar estabelecimento
            </h1>

            <form onSubmit={salvarAlteracoes} className="space-y-4">
                <div>
                    <label className="mb-1 block font-medium">Nome</label>
                    <input
                        required
                        value={formulario.nome}
                        onChange={(e) => atualizarCampo("nome", e.target.value)}
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">Cidade</label>
                    <input
                        required
                        value={formulario.cidade}
                        onChange={(e) => atualizarCampo("cidade", e.target.value)}
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">Categoria</label>
                    <input
                        required
                        value={formulario.categoria}
                        onChange={(e) => atualizarCampo("categoria", e.target.value)}
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">Endereço</label>
                    <input
                        value={formulario.endereco ?? ""}
                        onChange={(e) => atualizarCampo("endereco", e.target.value)}
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">Descrição</label>
                    <textarea
                        value={formulario.descricao ?? ""}
                        onChange={(e) => atualizarCampo("descricao", e.target.value)}
                        rows={4}
                        className="w-full rounded border p-2"
                    />
                </div>

                {(
                    [
                        ["rampa_acesso", "Rampa de acesso"],
                        ["banheiro_adaptado", "Banheiro adaptado"],
                        ["vaga_reservada", "Vaga reservada"],
                    ] as const
                ).map(([campo, titulo]) => (
                    <div key={campo}>
                        <label className="mb-1 block font-medium">{titulo}</label>
                        <select
                            value={formulario[campo]}
                            onChange={(e) => atualizarCampo(campo, e.target.value)}
                            className="w-full rounded border p-2"
                        >
                            {opcoesAcessibilidade.map((opcao) => (
                                <option key={opcao.valor} value={opcao.valor}>
                                    {opcao.texto}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

                {erro && (
                    <p className="text-red-600">{erro}</p>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={salvando}
                        className="rounded bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
                    >
                        {salvando ? "Salvando..." : "Salvar alterações"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/dashboard/estabelecimentos")}
                        className="rounded bg-gray-200 px-5 py-2"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </main>
    );
}
