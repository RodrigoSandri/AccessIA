
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { pool } from "@/lib/db";
import { verificarLimiteRequisicoes } from "@/lib/limite-requisicoes";

export async function POST(request: Request) {
  const resultadoLimite = await verificarLimiteRequisicoes(
    request,
    "cadastro-usuarios",
  );

  if (resultadoLimite.indisponivel) {
    return NextResponse.json(
      { erro: "Serviço temporariamente indisponível. Tente novamente." },
      {
        status: 503,
        headers: {
          "Retry-After": String(resultadoLimite.retryAfter),
        },
      },
    );
  }

  if (!resultadoLimite.permitido) {
    return NextResponse.json(
      { erro: "Muitas tentativas de cadastro. Tente novamente mais tarde." },
      {
        status: 429,
        headers: {
          "Retry-After": String(resultadoLimite.retryAfter),
        },
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { erro: "Requisição inválida." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { erro: "Requisição inválida." },
      { status: 400 },
    );
  }

  const dados = body as Record<string, unknown>;

  try {
    const nome =
      typeof dados.nome === "string" ? dados.nome.trim() : "";

    const email =
      typeof dados.email === "string"
        ? dados.email.trim().toLowerCase()
        : "";

    const senha =
      typeof dados.senha === "string" ? dados.senha : "";

    if (!nome || nome.length > 100) {
      return NextResponse.json(
        { erro: "Informe um nome válido com até 100 caracteres." },
        { status: 400 },
      );
    }

    if (
      !email ||
      email.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { erro: "Informe um e-mail válido." },
        { status: 400 },
      );
    }

    if (senha.length < 12) {
      return NextResponse.json(
        { erro: "A senha deve ter pelo menos 12 caracteres." },
        { status: 400 },
      );
    }

    if (Buffer.byteLength(senha, "utf8") > 72) {
      return NextResponse.json(
        {
          erro: "A senha é muito longa. O limite é 72 bytes; acentos e emojis ocupam mais de um byte por caractere.",
        },
        { status: 400 },
      );
    }

    const [usuariosExistentes] = await pool.execute(
      "SELECT id FROM usuarios WHERE email = ? LIMIT 1",
      [email],
    );

    if ((usuariosExistentes as unknown[]).length > 0) {
      return NextResponse.json(
        { erro: "Este e-mail já está cadastrado." },
        { status: 409 },
      );
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    const [resultado] = await pool.execute<ResultSetHeader>(
      `INSERT INTO usuarios (nome, email, senha_hash)
       VALUES (?, ?, ?)`,
      [nome, email, senhaHash],
    );

    return NextResponse.json(
      {
        mensagem: "Conta criada com sucesso.",
        usuario: {
          id: resultado.insertId,
          nome,
          email,
        },
      },
      { status: 201 },
    );
  } catch (erro) {
    if (
      typeof erro === "object" &&
      erro !== null &&
      "code" in erro &&
      erro.code === "ER_DUP_ENTRY"
    ) {
      return NextResponse.json(
        { erro: "Este e-mail já está cadastrado." },
        { status: 409 },
      );
    }

    console.error("Erro ao cadastrar usuário:", {
      code: (erro as { code?: string } | null)?.code,
    });

    return NextResponse.json(
      { erro: "Não foi possível criar a conta." },
      { status: 500 },
    );
  }
}
