
import { pool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

interface EstabelecimentoProps extends RowDataPacket {
    id: number;
    nome: string;
    cidade: string;
    categoria: string;
    endereco: string | null;
    descricao: string | null;
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
    const idNumerico = Number(id);

    if (!Number.isSafeInteger(idNumerico) || idNumerico <= 0) {
        return (
            <p className="text-center text-zinc-700">
                Estabelecimento não encontrado.
            </p>
        );
    }

    let estabelecimento: EstabelecimentoProps | undefined;

    try {
        const [rows] = await pool.execute<EstabelecimentoProps[]>(
            `SELECT
                id,
                nome,
                cidade,
                categoria,
                endereco,
                descricao,
                rampa_acesso,
                banheiro_adaptado,
                vaga_reservada
            FROM estabelecimentos
            WHERE id = ?`,
            [idNumerico]
        );

        estabelecimento = rows[0];
    } catch (error) {
        console.error("Erro ao carregar estabelecimento:", error);

        return (
            <p className="text-center text-red-700" role="alert">
                Não foi possível carregar os dados. Tente novamente mais tarde.
            </p>
        );
    }

    if (!estabelecimento) {
        return (
            <p className="text-center text-zinc-700">
                Estabelecimento não encontrado.
            </p>
        );
    }

    return (
        <section className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-bold text-zinc-900">
                    {estabelecimento.nome}
                </h2>

                <div className="space-y-2 text-zinc-700">
                    <p>
                        <strong>Cidade:</strong>{" "}
                        {estabelecimento.cidade}
                    </p>

                    <p>
                        <strong>Categoria:</strong>{" "}
                        {estabelecimento.categoria}
                    </p>

                    <p>
                        <strong>Endereço:</strong>{" "}
                        {estabelecimento.endereco || "Não informado"}
                    </p>

                    <p>
                        <strong>Descrição:</strong>{" "}
                        {estabelecimento.descricao || "Não informada"}
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-bold text-zinc-900">
                    Informações de acessibilidade
                </h3>

                <div className="space-y-3 text-zinc-700">
                    <p>
                        <strong>Rampa de acesso:</strong>{" "}
                        {formatarAcessibilidade(
                            estabelecimento.rampa_acesso
                        )}
                    </p>

                    <p>
                        <strong>Banheiro adaptado:</strong>{" "}
                        {formatarAcessibilidade(
                            estabelecimento.banheiro_adaptado
                        )}
                    </p>

                    <p>
                        <strong>Vaga reservada:</strong>{" "}
                        {formatarAcessibilidade(
                            estabelecimento.vaga_reservada
                        )}
                    </p>
                </div>
            </div>
        </section>
    );
}
