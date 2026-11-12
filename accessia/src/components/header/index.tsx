
import Link from "next/link";

export function Header() {
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
                    </ul>
                </nav>
            </div>
        </header>
    );
}
