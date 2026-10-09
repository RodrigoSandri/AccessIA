import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json([
        {
            id: 1,
            nome: "Restaurante Cantinho do Pescador",
            cidade: "Torres",
            categoria: "Restaurante"
        },
        {
            id: 2,
            nome: "Parque da Guarita",
            cidade: "Torres",
            categoria: "Parque"
        },
        {
            id: 3,
            nome: "Praia da Guarita",
            cidade: "Torres",
            categoria: "praia"
        },
        {
            id: 4,
            nome: "Praia Grande",
            cidade: "Torres",
            categoria: "praia"
        },
        {
            id: 5,
            nome: "Praia da Cal",
            cidade: "Torres",
            categoria: "Praia"
        },
        {
            id: 6,
            nome: "Prainha",
            cidade: "Torres",
            categoria: "Prainha"
        },
        {
            id: 7,
            nome: "Morro do Farol",
            cidade: "Torres",
            categoria: "Mirante"
        },
        {
            id: 8,
            nome: "Lagoa do Violão",
            cidade: "Torres",
            categoria: "Lagoa"
        },
        {
            id: 9,
            nome: "Ilha dos Lobos",
            cidade: "Torres",
            categoria: "Reserva Natural"
        },
        {
            id: 10,
            nome: "Ponte Pêsil",
            cidade: "Torres",
            categoria: "Rio"
        },
        {
            id: 11,
            nome: "Rio Mampituba",
            cidade: "Torres",
            categoria: "Rio"
        },
        {
            id: 12,
            nome: "Praça XV de Novembro",
            cidade: "Torres",
            categoria: "Praça"
        },
        {
            id: 13,
            nome: "Praça Pinheiro Machado",
            cidade: "Torres",
            categoria: "Praça"
        },
        {
            id: 14,
            nome: "Calçadão da Praia Grande",
            cidade: "Torres",
            categoria: "Área de Lazer"
        },
        {
            id: 15,
            nome: "Centro de Torres",
            cidade: "Torres",
            categoria: "Área comercial"
        }
    ]); 
}