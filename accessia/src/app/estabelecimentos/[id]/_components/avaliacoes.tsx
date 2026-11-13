
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

export function Avaliacoes({ estabelecimentoId }: AvaliacoesProps) {
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

            setAvaliacoes(
                dados.sort(
                    (a, b) =>
                        new Date(b.criado_em).getTime() -
                        new Date(a.criado_em).getTime()
                )
            );
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

    const mediaArredondada = Math.round(media);

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
                <p className="mt-4 text-sm text-zinc-600">
                    Carregando avaliações...
                </p>
            ) : (
                <>
                    <div className="mt-4 rounded-lg bg-zinc-50 p-5">
                        <p className="font-semibold text-zinc-800">
                            Média das avaliações
                        </p>

                        {avaliacoes.length > 0 ? (
                            <>
                                <div
                                    className="mt-2 flex flex-wrap items-center gap-2"
                                    aria-label={`Média de ${media.toFixed(1)} de 5 estrelas`}
                                >
                                    <span className="text-2xl font-bold text-zinc-900">
                                        {media.toFixed(1)}
                                    </span>

                                    <span className="text-xl tracking-wide text-yellow-500">
                                        {"★".repeat(mediaArredondada)}
                                        <span className="text-zinc-300">
                                            {"☆".repeat(5 - mediaArredondada)}
                                        </span>
                                    </span>

                                    <span className="text-sm text-zinc-600">
                                        de 5 estrelas
                                    </span>
                                </div>

                                <p className="mt-1 text-sm text-zinc-600">
                                    {avaliacoes.length}{" "}
                                    {avaliacoes.length === 1
                                        ? "avaliação registrada"
                                        : "avaliações registradas"}
                                </p>
                            </>
                        ) : (
                            <p className="mt-2 text-sm text-zinc-600">
                                Este estabelecimento ainda não possui
                                avaliações. Seja o primeiro a compartilhar
                                sua experiência!
                            </p>
                        )}
                    </div>

                    {avaliacoes.length > 0 && (
                        <div className="mt-6 space-y-4">
                            <h4 className="font-semibold text-zinc-900">
                                Relatos dos usuários
                            </h4>

                            {avaliacoes.map((avaliacao) => (
                                <article
                                    key={avaliacao.id}
                                    className="rounded-lg border border-zinc-200 p-4"
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className="text-xl tracking-wide text-yellow-500"
                                            aria-label={`${avaliacao.nota} de 5 estrelas`}
                                        >
                                            {"★".repeat(avaliacao.nota)}
                                            <span className="text-zinc-300">
                                                {"☆".repeat(5 - avaliacao.nota)}
                                            </span>
                                        </span>

                                        <span className="text-sm font-medium text-zinc-700">
                                            {avaliacao.nota}/5
                                        </span>
                                    </div>

                                    {avaliacao.comentario ? (
                                        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-700">
                                            {avaliacao.comentario}
                                        </p>
                                    ) : (
                                        <p className="mt-3 text-sm italic text-zinc-500">
                                            Avaliação sem comentário.
                                        </p>
                                    )}

                                    <p className="mt-3 text-xs text-zinc-500">
                                        {new Date(
                                            avaliacao.criado_em
                                        ).toLocaleDateString("pt-BR")}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </>
            )}

            <div className="mt-8 border-t border-zinc-200 pt-6">
                <h4 className="text-lg font-semibold text-zinc-900">
                    Avalie este estabelecimento
                </h4>

                <p className="mt-1 text-sm text-zinc-600">
                    Sua experiência pode ajudar outras pessoas a conhecer
                    melhor a acessibilidade deste local.
                </p>

                <form onSubmit={enviarAvaliacao} className="mt-5 space-y-4">
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
                                    className={`text-3xl transition ${
                                        valor <= nota
                                            ? "text-yellow-500"
                                            : "text-zinc-300 hover:text-yellow-400"
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
                            className="w-full rounded-lg border border-zinc-300 p-3 text-zinc-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Conte como foi sua experiência..."
                        />

                        <p className="mt-1 text-right text-xs text-zinc-500">
                            {comentario.length}/2000 caracteres
                        </p>
                    </div>

                    {mensagem && (
                        <p
                            role="alert"
                            className={
                                erro
                                    ? "text-sm text-red-700"
                                    : "text-sm text-green-700"
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
