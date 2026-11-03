"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const opcoesAcessibilidade = [
    { valor: "nao_verificado", texto: "Não verificado" },
    { valor: "sim", texto: "Sim" },
    { valor: "nao", texto: "Não" },
    { valor: "parcial", texto: "Parcial" },
];

export default function NovoEstabelecimentoPage() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [cidade, setCidade] = useState("");
    const [categoria, setCategoria] = useState("");
    const [endereco, setEndereco] = useState("");
    const [descricao, setDescricao] = useState("");
    const [rampaAcesso, setRampaAcesso] = useState("nao_verificado");
    const [banheiroAdaptado, setBanheiroAdaptado] = useState("nao_verificado");
    const [vagaReservada, setVagaReservada] = useState("nao_verificado");
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    async function cadastrarEstabelecimento(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        setErro("");
        setSalvando(true);

        try {
            const resposta = await fetch("/api/estabelecimentos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome,
                    cidade,
                    categoria,
                    endereco,
                    descricao,
                    rampa_acesso: rampaAcesso,
                    banheiro_adaptado: banheiroAdaptado,
                    vaga_reservada: vagaReservada,
                }),
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.erro || "Não foi possível cadastrar o estabelecimento."
                );
            }

            router.push("/dashboard/estabelecimentos");
            router.refresh();
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Ocorreu um erro ao cadastrar o estabelecimento."
            );
        } finally {
            setSalvando(false);
        }
    }

    function campoAcessibilidade(
        titulo: string,
        valor: string,
        alterar: (valor: string) => void,
        identificador: string
    ) {
        return (
            <div>
                <label
                    htmlFor={identificador}
                    className="mb-2 block text-sm font-semibold text-gray-700"
                >
                    {titulo}
                </label>

                <select
                    id={identificador}
                    value={valor}
                    onChange={(evento) => alterar(evento.target.value)}
                    className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                    {opcoesAcessibilidade.map((opcao) => (
                        <option key={opcao.valor} value={opcao.valor}>
                            {opcao.texto}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-4xl px-6 py-10">
            <header className="mb-8">
                <Link
                    href="/dashboard/estabelecimentos"
                    className="text-sm font-semibold text-blue-700 hover:underline"
                >
                    ← Voltar aos estabelecimentos
                </Link>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900">
                    Novo estabelecimento
                </h1>

                <p className="mt-2 text-gray-600">
                    Preencha os dados para cadastrar um estabelecimento no AccessIA.
                </p>
            </header>

            <form
                onSubmit={cadastrarEstabelecimento}
                className="space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
                <section className="space-y-5">
                    <h2 className="text-xl font-bold text-gray-900">
                        Informações gerais
                    </h2>

                    <div>
                        <label htmlFor="nome" className="mb-2 block text-sm font-semibold text-gray-700">
                            Nome do estabelecimento *
                        </label>
                        <input
                            id="nome"
                            type="text"
                            required
                            maxLength={150}
                            value={nome}
                            onChange={(evento) => setNome(evento.target.value)}
                            className="min-h-12 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Ex.: Restaurante Central"
                        />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="cidade" className="mb-2 block text-sm font-semibold text-gray-700">
                                Cidade *
                            </label>
                            <input
                                id="cidade"
                                type="text"
                                required
                                maxLength={100}
                                value={cidade}
                                onChange={(evento) => setCidade(evento.target.value)}
                                className="min-h-12 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                placeholder="Ex.: Torres"
                            />
                        </div>

                        <div>
                            <label htmlFor="categoria" className="mb-2 block text-sm font-semibold text-gray-700">
                                Categoria *
                            </label>
                            <input
                                id="categoria"
                                type="text"
                                required
                                maxLength={100}
                                value={categoria}
                                onChange={(evento) => setCategoria(evento.target.value)}
                                className="min-h-12 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                placeholder="Ex.: Restaurante, Hotel, Café"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="endereco" className="mb-2 block text-sm font-semibold text-gray-700">
                            Endereço
                        </label>
                        <input
                            id="endereco"
                            type="text"
                            maxLength={255}
                            value={endereco}
                            onChange={(evento) => setEndereco(evento.target.value)}
                            className="min-h-12 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Rua, número e bairro"
                        />
                    </div>

                    <div>
                        <label htmlFor="descricao" className="mb-2 block text-sm font-semibold text-gray-700">
                            Descrição
                        </label>
                        <textarea
                            id="descricao"
                            rows={4}
                            value={descricao}
                            onChange={(evento) => setDescricao(evento.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Descreva brevemente o estabelecimento."
                        />
                    </div>
                </section>

                <section className="space-y-5">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Informações de acessibilidade
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            Informe somente o que foi verificado. Quando não houver
                            confirmação, mantenha a opção "Não verificado".
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {campoAcessibilidade(
                            "Rampa de acesso",
                            rampaAcesso,
                            setRampaAcesso,
                            "rampa"
                        )}

                        {campoAcessibilidade(
                            "Banheiro adaptado",
                            banheiroAdaptado,
                            setBanheiroAdaptado,
                            "banheiro"
                        )}

                        {campoAcessibilidade(
                            "Vaga reservada",
                            vagaReservada,
                            setVagaReservada,
                            "vaga"
                        )}
                    </div>
                </section>

                {erro && (
                    <p
                        role="alert"
                        className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800"
                    >
                        {erro}
                    </p>
                )}

                <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-6">
                    <Link
                        href="/dashboard/estabelecimentos"
                        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        disabled={salvando}
                        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {salvando ? "Cadastrando..." : "Cadastrar estabelecimento"}
                    </button>
                </div>
            </form>
        </main>
    );
}