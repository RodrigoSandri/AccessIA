import { createHmac } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";

export const NOME_COOKIE_USUARIO = "accessia_usuario";
export const DURACAO_SESSAO_USUARIO_SEGUNDOS = 7 * 24 * 60 * 60;

export interface UsuarioAutenticado {
    id: number;
    nome: string;
    email: string;
}

const EMISSOR = "accessia";
const PUBLICO = "accessia-usuario";
const CONTEXTO_CHAVE = "sessao-usuario:v1";
const ID_MAXIMO = 4_294_967_295;
const PADRAO_ID = /^[1-9][0-9]{0,9}$/;

interface LinhaUsuario extends RowDataPacket {
    id: number;
    nome: string;
    email: string;
}

function obterChave(): Uint8Array | null {
    const segredo = process.env.AUTH_SECRET;

    if (!segredo || !segredo.trim()) {
        return null;
    }

    return new Uint8Array(
        createHmac("sha256", segredo).update(CONTEXTO_CHAVE).digest()
    );
}

function idValido(id: unknown): id is number {
    return (
        typeof id === "number" &&
        Number.isSafeInteger(id) &&
        id >= 1 &&
        id <= ID_MAXIMO
    );
}


export async function criarTokenSessaoUsuario(
    usuarioId: number
): Promise<string | null> {
    const chave = obterChave();

    if (!chave || !idValido(usuarioId)) {
        return null;
    }

    try {
        return await new SignJWT({})
            .setProtectedHeader({ alg: "HS256" })
            .setSubject(String(usuarioId))
            .setIssuer(EMISSOR)
            .setAudience(PUBLICO)
            .setIssuedAt()
            .setExpirationTime(`${DURACAO_SESSAO_USUARIO_SEGUNDOS}s`)
            .sign(chave);
    } catch {
        return null;
    }
}


export async function verificarTokenSessaoUsuario(
    token: string
): Promise<number | null> {
    const chave = obterChave();

    if (!chave || !token) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(token, chave, {
            algorithms: ["HS256"],
            issuer: EMISSOR,
            audience: PUBLICO,
            maxTokenAge: `${DURACAO_SESSAO_USUARIO_SEGUNDOS}s`,
            requiredClaims: ["sub", "iss", "aud", "iat", "exp"],
        });

        if (typeof payload.sub !== "string" || !PADRAO_ID.test(payload.sub)) {
            return null;
        }

        const id = Number(payload.sub);

        return idValido(id) ? id : null;
    } catch {
        return null;
    }
}


export async function obterUsuarioAutenticado(): Promise<UsuarioAutenticado | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(NOME_COOKIE_USUARIO)?.value;

        if (!token) {
            return null;
        }

        const id = await verificarTokenSessaoUsuario(token);

        if (id === null) {
            return null;
        }

        const [linhas] = await pool.execute<LinhaUsuario[]>(
            "SELECT id, nome, email FROM usuarios WHERE id = ? LIMIT 1",
            [id]
        );

        if (linhas.length !== 1) {
            return null;
        }

        const { nome, email } = linhas[0];

        if (
            Number(linhas[0].id) !== id ||
            typeof nome !== "string" ||
            typeof email !== "string"
        ) {
            return null;
        }

        return { id, nome, email };
    } catch (erro) {
        const code =
            typeof erro === "object" &&
            erro !== null &&
            "code" in erro &&
            typeof erro.code === "string"
                ? erro.code
                : undefined;

        console.error("Falha ao validar a sessão do usuário:", { code });

        return null;
    }
}

/** Grava o cookie de sessão do usuário na resposta. */
export function definirCookieSessaoUsuario(
    resposta: NextResponse,
    token: string
): void {
    resposta.cookies.set(NOME_COOKIE_USUARIO, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: DURACAO_SESSAO_USUARIO_SEGUNDOS,
    });
}

export function limparCookieSessaoUsuario(resposta: NextResponse): void {
    resposta.cookies.set(NOME_COOKIE_USUARIO, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}