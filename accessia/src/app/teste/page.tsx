
"use client";

import { useEffect, useState } from "react";

interface Estabelecimento{
  id: number;
  nome: string;
  cidade: string;
  categoria: string;
}

export default function PageTeste(){
  const [estabelecimentos, setEstabelecimentos] =
    useState<Estabelecimento[]>([]);

  useEffect(() => {
    fetch("/api/estabelecimentos")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao carregar estabelecimentos");
        }

        return res.json();
      })
      .then((data: Estabelecimento[]) => {
        setEstabelecimentos(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 mt-5 text-center text-3xl font-bold">
        Página Cliente
      </h1>

      <div className="mx-2 flex flex-col gap-4">
        {estabelecimentos.map((estabelecimento) => (
          <div
            key={estabelecimento.id}
            className="rounded-md bg-gray-200 p-4"
          >
            <h2 className="font-bold">
              {estabelecimento.nome}
            </h2>

            <p>Cidade: {estabelecimento.cidade}</p>
            <p>Categoria: {estabelecimento.categoria}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
