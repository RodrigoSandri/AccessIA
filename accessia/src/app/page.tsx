
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "AccessIA - Descubra lugares acessíveis",
  description:
    "Encontre estabelecimentos acessíveis, consulte informações de acessibilidade e escolha seu destino com mais autonomia e confiança.",
  openGraph: {
    title: "AccessIA - Descubra lugares acessíveis",
    description:
      "Encontre estabelecimentos acessíveis, consulte informações de acessibilidade e escolha seu destino com mais autonomia e confiança.",
    images: ["/accessia-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function Home() {
  return (
    <div>
      <h1>Bem-vindo ao AccessIA!</h1>
      <p>
        Descubra lugares acessíveis. Escolha seu destino com confiança.
      </p>
    </div>
  )
}