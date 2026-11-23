"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BotaoSair(){
    const router = useRouter();
    const [saindo, setSaindo] = useState(false);

    async function Sair(){
        setSaindo(true);

        try{
            await fetch("/api/usuarios/sessao", { method: "DELETE"});
        } finally {
            setSaindo(false);
            router.push("/");
            router.refresh();
        }
    }

    return (
        <button
            type="button"
            onClick={Sair}
            disabled={saindo}
            className="cursor-pointer hover:underline disabled:opacity-60"
            >
                {saindo ? "Saindo..." : "Sair   "}
            </button>
    );
}