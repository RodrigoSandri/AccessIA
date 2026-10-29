
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

interface Estabelecimento {
    id: number;
    nome: string;
    cidade: string;
}

export default function ContribuirPage() {
    const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
    const [estabelecimentoId, setEstabelecimentoId] = useState("");
    const [tipo, setTipo] = useState("");
    const [informacao, setInformacao] = useState("");
    const [nome, setNome] = useState("");
    const [relato, setRelato] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [carregandoEstabelecimentos, setCarregandoEstabelecimentos] =
        useState(true);

    useEffect(() => {
        async function carregarEstabelecimentos() {
            try {
                const resposta = await fetch("/api/estabelecimentos");
                const dados = await resposta.json();

                if (!resposta.ok) {
                    throw new Error(
                        "Não foi possível carregar os estabelecimentos."
                    );
                }

                const lista = Array.isArray(dados)
                    ? dados
                    : dados.estabelecimentos;

                if (!Array.isArray(lista)) {
                    throw new Error(
                        "Formato de estabelecimentos inválido."
                    );
                }

                setEstabelecimentos(lista);
            } catch {
                setErro(true);
                setMensagem(
                    "Não foi possível carregar os estabelecimentos."
                );
            } finally {
                setCarregandoEstabelecimentos(false);
            }
        }

        carregarEstabelecimentos();
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMensagem("");
        setErro(false);
        setCarregando(true);

        try {
            const resposta = await fetch("/api/contribuicoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    estabelecimento_id: Number(estabelecimentoId),
                    tipo_acessibilidade: tipo,
                    informacao_proposta: informacao,
                    nome_contribuidor: nome.trim() || null,
                    relato: relato.trim() || null,
                }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.erro ||
                        "Não foi possível enviar a contribuição."
                );
            }

            setErro(false);
            setMensagem(
                dados.mensagem ||
                    "Contribuição enviada para análise."
            );

            setEstabelecimentoId("");
            setTipo("");
            setInformacao("");
            setNome("");
            setRelato("");
        } catch (error) {
            console.error("Erro ao enviar contribuição:", error);

            setErro(true);
            setMensagem(
                error instanceof Error
                    ? error.message
                    : "Ocorreu um erro ao enviar a contribuição."
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="mx-auto max-w-2xl px-6 py-12">
        <Link
            href="/estabelecimentos"
            className="text-sm text-blue-700 hover:underline"
    >
            ← Voltar aos estabelecimentos
    </Link>

            <h1 className="mt-5 text-3xl font-bold">
                Contribua com o AccessIA
            </h1>

            <p className="mt-3 text-gray-600">
                Compartilhe informações sobre a acessibilidade dos
                estabelecimentos e ajude outras pessoas a escolher
                seus destinos com mais confiança.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                    <label
                        htmlFor="estabelecimento"
                        className="mb-2 block font-medium"
                    >
                        Estabelecimento
                    </label>

                    <select
                        id="estabelecimento"
                        value={estabelecimentoId}
                        onChange={(event) =>
                            setEstabelecimentoId(event.target.value)
                        }
                        required
                        disabled={carregandoEstabelecimentos}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    >
                        <option value="">
                            {carregandoEstabelecimentos
                                ? "Carregando estabelecimentos..."
                                : "Selecione um estabelecimento"}
                        </option>

                        {estabelecimentos.map((estabelecimento) => (
                            <option
                                key={estabelecimento.id}
                                value={estabelecimento.id}
                            >
                                {estabelecimento.nome} —{" "}
                                {estabelecimento.cidade}
                            </option>
                        ))}
                    </select>

                    {!carregandoEstabelecimentos &&
                        estabelecimentos.length === 0 && (
                            <p className="mt-2 text-sm text-gray-600">
                                Nenhum estabelecimento disponível.
                                Cadastre um estabelecimento antes de
                                contribuir.
                            </p>
                        )}
                </div>

                <div>
                    <label
                        htmlFor="tipo"
                        className="mb-2 block font-medium"
                    >
                        Qual informação deseja compartilhar?
                    </label>

                    <select
                        id="tipo"
                        value={tipo}
                        onChange={(event) => setTipo(event.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    >
                        <option value="">Selecione uma opção</option>
                        <option value="rampa_acesso">
                            Rampa de acesso
                        </option>
                        <option value="banheiro_adaptado">
                            Banheiro adaptado
                        </option>
                        <option value="vaga_reservada">
                            Vaga reservada
                        </option>
                        <option value="outro">
                            Outro recurso de acessibilidade
                        </option>
                    </select>
                </div>

                <fieldset>
                    <legend className="mb-3 font-medium">
                        Qual é a condição de acessibilidade?
                    </legend>

                    <div className="space-y-3">
                        {["Sim", "Não", "Não sei informar"].map(
                            (opcao) => (
                                <label
                                    key={opcao}
                                    className="flex cursor-pointer items-center gap-3"
                                >
                                    <input
                                        type="radio"
                                        name="informacao"
                                        value={opcao}
                                        checked={informacao === opcao}
                                        onChange={(event) =>
                                            setInformacao(
                                                event.target.value
                                            )
                                        }
                                        required
                                        className="h-4 w-4"
                                    />
                                    {opcao}
                                </label>
                            )
                        )}
                    </div>
                </fieldset>

                <div>
                    <label
                        htmlFor="nome"
                        className="mb-2 block font-medium"
                    >
                        Seu nome (opcional)
                    </label>

                    <input
                        id="nome"
                        value={nome}
                        onChange={(event) => setNome(event.target.value)}
                        maxLength={100}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3"
                        placeholder="Digite seu nome, se desejar"
                    />
                </div>

                <div>
                    <label
                        htmlFor="relato"
                        className="mb-2 block font-medium"
                    >
                        Relato ou observações (opcional)
                    </label>

                    <textarea
                        id="relato"
                        value={relato}
                        onChange={(event) => setRelato(event.target.value)}
                        maxLength={5000}
                        rows={5}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3"
                        placeholder="Conte mais sobre a informação compartilhada."
                    />

                    <p className="mt-1 text-sm text-gray-500">
                        Sua contribuição será enviada para análise antes
                        de ser considerada verificada.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={
                        carregando ||
                        carregandoEstabelecimentos ||
                        estabelecimentos.length === 0
                    }
                    className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {carregando
                        ? "Enviando..."
                        : "Enviar contribuição"}
                </button>

                {mensagem && (
                    <div
                        role="status"
                        aria-live="polite"
                        className={`rounded-lg border p-4 ${
                            erro
                                ? "border-red-300 bg-red-50 text-red-800"
                                : "border-green-300 bg-green-50 text-green-800"
                        }`}
                    >   
                        {mensagem}
                    </div>
                )}
            </form>
        </main>
    );
}
