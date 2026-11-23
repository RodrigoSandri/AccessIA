import Link from "next/link";

import { obterUsuarioAutenticado } from "@/lib/sessao-usuario";
import { BotaoSair } from "./botao-sair";

export async function Header() {
    const usuario = await obterUsuarioAutenticado();

    return (
        <header className="flex px-2 py-4 bg-zinc-900 text-white">
            <div className="flex items-center justify-between w-full mx-auto max-w-7xl">
                <Link href="/" className="font-bold">
                    AccessIA
                </Link>

                <nav>
                    <ul className="flex flex-wrap items-center justify-center gap-4">
                        <li>
                            <Link href="/">Home</Link>
                        </li>

                        <li>
                            <Link href="/estabelecimentos">
                                Estabelecimentos
                            </Link>
                        </li>

                        <li>
                            <Link href="/contribuir">Contribuir</Link>
                        </li>

                        <li>
                            <Link href="/recompensas">Recompensas</Link>
                        </li>

                        <li>
                            <Link href="/dashboard">Dashboard</Link>
                        </li>

                        {usuario ? (
                            <>
                                <li className="max-w-40 truncate text-zinc-300">
                                    Olá, {usuario.nome.split(" ")[0]}
                                </li>

                                <li>
                                    <BotaoSair />
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link href="/entrar">Entrar</Link>
                                </li>

                                <li>
                                    <Link href="/cadastro">Cadastrar</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}