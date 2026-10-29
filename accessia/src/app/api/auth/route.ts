
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const senha = typeof body.senha === "string" ? body.senha : "";

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    const authSecret = process.env.AUTH_SECRET;

    if (!adminEmail || !passwordHash || !authSecret) {
      console.error("Configuração de autenticação administrativa incompleta.");
      return NextResponse.json(
        { erro: "Login administrativo indisponível no momento." },
        { status: 500 },
      );
    }

    if (!email || !senha) {
      return NextResponse.json(
        { erro: "Informe o e-mail e a senha." },
        { status: 400 },
      );
    }

    const senhaValida = await bcrypt.compare(senha, passwordHash);

    if (email !== adminEmail || !senhaValida) {
      return NextResponse.json(
        { erro: "E-mail ou senha incorretos." },
        { status: 401 },
      );
    }

    const secret = new TextEncoder().encode(authSecret);

    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("admin")
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secret);

    const response = NextResponse.json({
      mensagem: "Login realizado com sucesso.",
    });

    response.cookies.set("accessia_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json(
      { erro: "Não foi possível processar o login." },
      { status: 400 },
    );
  }
}
