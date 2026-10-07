import Link from "next/link";

export default function NotFound(){
    return(
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-center font-bold">Estabelecimento não encontrado!</h1>
            <p>Esse Estabelecimento que você tentou acessar não existe!</p>
            <Link href='/'>
              Voltar para home 
            </Link>
        </div>
    )
}