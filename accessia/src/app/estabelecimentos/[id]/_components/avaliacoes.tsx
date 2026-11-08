
"use client";

import { useEffect, useState } from "react";

interface Avaliacao {
    id: number;
    estabelecimento_id: number;
    nota: number;
    comentario: string | null;
    criado_em: string;
}

interface AvaliacoesProps {
    estabelecimentoId: number;
}

export function Avaliacoes({
    estabelecimentoId,
}: AvaliacoesProps) {
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [nota, setNota] = useState(0);
    const [comentario, setComentario] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState(false);

    async function carregarAvaliacoes() {
        try {
            const resposta = await fetch(
                `/api/avaliacoes?estabelecimento_id=${estabelecimentoId}`
            );

            if (!resposta.ok) {
                throw new Error("Erro ao buscar avaliações.");
            }

            const dados: Avaliacao[] = await resposta.json();
            setAvaliacoes(dados);
        } catch (error) {
            console.error(error);
            setMensagem("Não foi possível carregar as avaliações.");
            setErro(true);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarAvaliacoes();
    }, [estabelecimentoId]);

    const media =
        avaliacoes.length > 0
            ? avaliacoes.reduce((total, item) => total + item.nota, 0) /
              avaliacoes.length
            : 0;

    async function enviarAvaliacao(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (nota < 1 || nota > 5) {
            setMensagem("Selecione uma nota de 1 a 5 estrelas.");
            setErro(true);
            return;
        }

        setEnviando(true);
        setMensagem("");
        setErro(false);

        try {
            const resposta = await fetch("/api/avaliacoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    estabelecimento_id: estabelecimentoId,
                    nota,
                    comentario,
                }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.erro || "Não foi possível registrar a avaliação."
                );
            }

            setMensagem("Avaliação registrada com sucesso!");
            setNota(0);
            setComentario("");

            await carregarAvaliacoes();
        } catch (error) {
            setMensagem(
                error instanceof Error
                    ? error.message
                    : "Erro ao registrar avaliação."
            );
            setErro(true);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <section
            aria-labelledby="titulo-avaliacoes"
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
        >
            <h3
                id="titulo-avaliacoes"
                className="text-xl font-bold text-zinc-900"
            >
                Avaliações dos usuários
            </h3>

            {carregando ? (
                <p className="mt-4 text-zinc-600">
                    Carregando avaliações...
                </p>
            ) : (
                <>
                    <div className="mt-4 rounded-lg bg-zinc-50 p-4">
                        <p className="font-semibold text-zinc-800">
                            Média das avaliações
                        </p>

                        <p className="mt-1 text-lg text-zinc-700">
                            {avaliacoes.length > 0
                                ? `${media.toFixed(1)} de 5 estrelas`
                                : "Este estabelecimento ainda não possui avaliações."}
                        </p>

                        <p className="text-sm text-zinc-600">
                            {avaliacoes.length}{" "}
                            {avaliacoes.length === 1
                                ? "avaliação"
                                : "avaliações"}
                        </p>
                    </div>

                    <div className="mt-5 space-y-4">
                        {avaliacoes.map((avaliacao) => (
                            <article
                                key={avaliacao.id}
                                className="rounded-lg border border-zinc-200 p-4"
                            >
                                <p className="font-semibold text-zinc-800">
                                    {"★".repeat(avaliacao.nota)}
                                    {"☆".repeat(5 - avaliacao.nota)}
                                    <span className="ml-2 text-sm text-zinc-600">
                                        {avaliacao.nota}/5
                                    </span>
                                </p>

                                {avaliacao.comentario && (
                                    <p className="mt-2 whitespace-pre-line text-zinc-700">
                                        {avaliacao.comentario}
                                    </p>
                                )}

                                <p className="mt-2 text-xs text-zinc-500">
                                    {new Date(
                                        avaliacao.criado_em
                                    ).toLocaleDateString("pt-BR")}
                                </p>
                            </article>
                        ))}
                    </div>
                </>
            )}

            <div className="mt-8 border-t border-zinc-200 pt-6">
                <h4 className="text-lg font-semibold text-zinc-900">
                    Avalie este estabelecimento
                </h4>

                <form onSubmit={enviarAvaliacao} className="mt-4 space-y-4">
                    <fieldset>
                        <legend className="mb-2 font-medium text-zinc-800">
                            Sua nota
                        </legend>

                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((valor) => (
                                <button
                                    key={valor}
                                    type="button"
                                    onClick={() => setNota(valor)}
                                    aria-label={`${valor} estrelas`}
                                    aria-pressed={nota === valor}
                                    className={`text-3xl ${
                                        valor <= nota
                                            ? "text-yellow-500"
                                            : "text-zinc-300"
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <div>
                        <label
                            htmlFor="comentario-avaliacao"
                            className="mb-2 block font-medium text-zinc-800"
                        >
                            Comentário (opcional)
                        </label>

                        <textarea
                            id="comentario-avaliacao"
                            value={comentario}
                            onChange={(event) =>
                                setComentario(event.target.value)
                            }
                            maxLength={2000}
                            rows={4}
                            className="w-full rounded-lg border border-zinc-300 p-3 text-zinc-800 focus:border-blue-500 focus:outline-none"
                            placeholder="Conte como foi sua experiência..."
                        />
                    </div>

                    {mensagem && (
                        <p
                            role="alert"
                            className={
                                erro ? "text-red-700" : "text-green-700"
                            }
                        >
                            {mensagem}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={enviando || carregando}
                        className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {enviando ? "Enviando..." : "Enviar avaliação"}
                    </button>
                </form>
            </div>
        </section>
    );
}
