import Link from "next/link";

export default function NotFound(){
    return(
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-center font-bold mt-9 text-6xl">Erro 404, Estabelecimento não encontrado!</h1>
            <p>Esse Estabelecimento que você tentou acessar não existe!</p>

            <Link href='/'>
              Voltar para home 
            </Link>
        </div>
    )
}