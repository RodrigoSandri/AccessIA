import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { verificarLimiteRequisicoes } from "@/lib/limite-requisicoes";
import {
  criarTokenSessaoUsuario,
  definirCookieSessaoUsuario,
  limparCookieSessaoUsuario,
  obterUsuarioAutenticado,
} from "@/lib/sessao-usuario";

const ESCOPO_LIMITE_LOGIN = "login-usuarios";
const MAXIMO_TENTATIVAS_LOGIN = 10;
const JANELA_LOGIN_SEGUNDOS = 15 * 60;
const BYTES_MAXIMOS_SENHA = 72;
const MENSAGEM_CREDENCIAIS = "E-mail ou senha incorretos.";
const SEM_CACHE = { "Cache-Control": "no-store" };

interface LinhaUsuario extends RowDataPacket {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
}

let hashFicticio: Promise<string> | null = null;

function obterHashFicticio(): Promise<string> {
  if (!hashFicticio) {
    hashFicticio = bcrypt.hash(randomBytes(24).toString("hex"), 12);
  }

  return hashFicticio;
}

function responder(
  corpo: Record<string, unknown>,
  status: number,
  cabecalhos: Record<string, string> = {},
) {
  return NextResponse.json(corpo, {
    status,
    headers: { ...SEM_CACHE, ...cabecalhos },
  });
}

export async function POST(request: Request) {
  const resultadoLimite = await verificarLimiteRequisicoes(
    request,
    ESCOPO_LIMITE_LOGIN,
    MAXIMO_TENTATIVAS_LOGIN,
    JANELA_LOGIN_SEGUNDOS,
  );

  if (resultadoLimite.indisponivel) {
    return responder(
      { erro: "Serviço temporariamente indisponível. Tente novamente." },
      503,
      { "Retry-After": String(resultadoLimite.retryAfter) },
    );
  }

  if (!resultadoLimite.permitido) {
    return responder(
      { erro: "Muitas tentativas de login. Tente novamente mais tarde." },
      429,
      { "Retry-After": String(resultadoLimite.retryAfter) },
    );
  }

  let corpo: unknown;

  try {
    corpo = await request.json();
  } catch {
    return responder({ erro: "Requisição inválida." }, 400);
  }

  if (typeof corpo !== "object" || corpo === null || Array.isArray(corpo)) {
    return responder({ erro: "Requisição inválida." }, 400);
  }

  const dados = corpo as Record<string, unknown>;

  const email =
    typeof dados.email === "string" ? dados.email.trim().toLowerCase() : "";

  const senha = typeof dados.senha === "string" ? dados.senha : "";

  if (!email || !senha) {
    return responder({ erro: "Informe o e-mail e a senha." }, 400);
  }

  if (email.length > 255 || Buffer.byteLength(senha, "utf8") > BYTES_MAXIMOS_SENHA) {
    return responder({ erro: MENSAGEM_CREDENCIAIS }, 401);
  }

  try {
    const [linhas] = await pool.execute<LinhaUsuario[]>(
      "SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ? LIMIT 1",
      [email],
    );

    const usuario = linhas.length === 1 ? linhas[0] : null;
    const hashComparado = usuario?.senha_hash ?? (await obterHashFicticio());
    const senhaConfere = await bcrypt.compare(senha, hashComparado);

    if (!usuario || !senhaConfere) {
      return responder({ erro: MENSAGEM_CREDENCIAIS }, 401);
    }

    const token = await criarTokenSessaoUsuario(usuario.id);

    if (!token) {
      console.error("Login de usuário indisponível: sessão não pôde ser criada.");

      return responder(
        { erro: "Login indisponível no momento. Tente novamente mais tarde." },
        500,
      );
    }

    const resposta = responder(
      {
        mensagem: "Login realizado com sucesso.",
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
      },
      200,
    );

    definirCookieSessaoUsuario(resposta, token);

    return resposta;
  } catch (erro) {
    console.error("Erro ao autenticar usuário:", {
      code: (erro as { code?: string } | null)?.code,
    });

    return responder({ erro: "Não foi possível realizar o login." }, 500);
  }
}

export async function GET() {
  const usuario = await obterUsuarioAutenticado();

  if (!usuario) {
    return responder({ autenticado: false }, 200);
  }

  return responder({ autenticado: true, usuario }, 200);
}

export async function DELETE() {
  const resposta = responder({ mensagem: "Sessão encerrada com sucesso." }, 200);

  limparCookieSessaoUsuario(resposta);

  return resposta;
}