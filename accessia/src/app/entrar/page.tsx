"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, RefObject } from "react";

type Campo = "email" | "senha";
type Valores = Record<Campo, string>;
type Erros = Partial<Record<Campo, string>>;
type Situacao = "inicial" | "carregando" | "sucesso" | "erro";

const ORDEM_CAMPOS: Campo[] = ["email", "senha"];

const VALORES_INICIAIS: Valores = {
  email: "",
  senha: "",
};

const PADRAO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MENSAGEM_CORRIGIR = "Corrija os campos indicados e tente novamente.";
const MENSAGEM_CREDENCIAIS = "E-mail ou senha incorretos.";

function validar(valores: Valores): Erros {
  const erros: Erros = {};
  const email = valores.email.trim();

  if (!email) {
    erros.email = "Informe seu e-mail.";
  } else if (email.length > 255 || !PADRAO_EMAIL.test(email)) {
    erros.email = "Informe um e-mail válido.";
  }

  if (!valores.senha) {
    erros.senha = "Informe sua senha.";
  }

  return erros;
}

function descreverEspera(cabecalho: string | null): string {
  const segundos = Number(cabecalho);

  if (!cabecalho || !Number.isFinite(segundos) || segundos <= 0) {
    return "mais tarde";
  }

  const minutos = Math.ceil(segundos / 60);

  return minutos <= 1
    ? "em cerca de 1 minuto"
    : `em cerca de ${minutos} minutos`;
}

function classeDoCampo(temErro: boolean) {
  const base =
    "w-full rounded-lg border px-3 py-2 text-gray-900 outline-none focus:ring-2";

  return temErro
    ? `${base} border-red-600 focus:border-red-600 focus:ring-red-200`
    : `${base} border-gray-300 focus:border-blue-600 focus:ring-blue-200`;
}

interface CampoFormularioProps {
  nome: Campo;
  rotulo: string;
  tipo: "text" | "email" | "password";
  placeholder: string;
  autoComplete: string;
  valor: string;
  erro?: string;
  maxLength?: number;
  referencia: RefObject<HTMLInputElement | null>;
  aoAlterar: (evento: ChangeEvent<HTMLInputElement>) => void;
}

function CampoFormulario({
  nome,
  rotulo,
  tipo,
  placeholder,
  autoComplete,
  valor,
  erro,
  maxLength,
  referencia,
  aoAlterar,
}: CampoFormularioProps) {
  const idErro = `${nome}-erro`;

  return (
    <div>
      <label
        htmlFor={nome}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {rotulo}
      </label>

      <input
        ref={referencia}
        id={nome}
        name={nome}
        type={tipo}
        value={valor}
        onChange={aoAlterar}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        required
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? idErro : undefined}
        className={classeDoCampo(Boolean(erro))}
      />

      {erro && (
        <p id={idErro} className="mt-1 text-sm text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}

export default function Entrar() {
  const [valores, setValores] = useState<Valores>(VALORES_INICIAIS);
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState("");
  const [situacao, setSituacao] = useState<Situacao>("inicial");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);
  const linkInicioRef = useRef<HTMLAnchorElement>(null);

  const referencias = {
    email: emailRef,
    senha: senhaRef,
  };

  const carregando = situacao === "carregando";

  useEffect(() => {
    if (situacao === "sucesso") {
      linkInicioRef.current?.focus();
    }
  }, [situacao]);

  function aoAlterar(evento: ChangeEvent<HTMLInputElement>) {
    const campo = evento.target.name as Campo;
    const valor = evento.target.value;

    setValores((anterior) => ({ ...anterior, [campo]: valor }));

    setErros((anterior) => {
      if (!anterior[campo]) {
        return anterior;
      }

      const proximo = { ...anterior };
      delete proximo[campo];
      return proximo;
    });
  }

  function focarPrimeiroInvalido(errosEncontrados: Erros) {
    const primeiro = ORDEM_CAMPOS.find((campo) => errosEncontrados[campo]);

    if (primeiro) {
      referencias[primeiro].current?.focus();
    }
  }

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (carregando) {
      return;
    }

    const errosEncontrados = validar(valores);

    if (Object.keys(errosEncontrados).length > 0) {
      setErros(errosEncontrados);
      setErroGeral(MENSAGEM_CORRIGIR);
      setSituacao("erro");
      focarPrimeiroInvalido(errosEncontrados);
      return;
    }

    setErros({});
    setErroGeral("");
    setSituacao("carregando");

    try {
      const resposta = await fetch("/api/usuarios/sessao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: valores.email.trim().toLowerCase(),
          senha: valores.senha,
        }),
      });

      const dados: {
        erro?: string;
        usuario?: { nome?: string };
      } | null = await resposta.json().catch(() => null);

      if (resposta.status === 200) {
        setNomeUsuario(
          typeof dados?.usuario?.nome === "string" ? dados.usuario.nome : "",
        );
        setValores(VALORES_INICIAIS);
        setMostrarSenha(false);
        setSituacao("sucesso");
        return;
      }

      if (resposta.status === 401) {
        setValores((anterior) => ({ ...anterior, senha: "" }));
        setErroGeral(MENSAGEM_CREDENCIAIS);
        setSituacao("erro");
        senhaRef.current?.focus();
        return;
      }

      if (resposta.status === 429) {
        const espera = descreverEspera(resposta.headers.get("Retry-After"));

        setErroGeral(
          `Muitas tentativas de login. Tente novamente ${espera}.`,
        );
        setSituacao("erro");
        return;
      }

      if (resposta.status === 503) {
        setErroGeral(
          "O login está temporariamente indisponível. Tente novamente em alguns instantes.",
        );
        setSituacao("erro");
        return;
      }

      setErroGeral(
        dados?.erro ?? "Não foi possível entrar. Tente novamente.",
      );
      setSituacao("erro");
    } catch {
      setErroGeral(
        "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      );
      setSituacao("erro");
    }
  }

  const mensagemStatus =
    situacao === "carregando"
      ? "Entrando..."
      : situacao === "sucesso"
        ? `Login realizado com sucesso${nomeUsuario ? `. Olá, ${nomeUsuario}` : ""}.`
        : "";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <section className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Entrar no AccessIA
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          Entre com o e-mail e a senha da sua conta para participar da
          construção de espaços mais acessíveis.
        </p>

        <div role="status" aria-live="polite" aria-atomic="true">
          {mensagemStatus && (
            <p
              className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
                situacao === "sucesso"
                  ? "border-green-300 bg-green-50 text-green-900"
                  : "border-blue-200 bg-blue-50 text-blue-900"
              }`}
            >
              {mensagemStatus}
            </p>
          )}
        </div>

        <div role="alert" aria-live="assertive" aria-atomic="true">
          {erroGeral && (
            <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
              {erroGeral}
            </p>
          )}
        </div>

        {situacao !== "sucesso" && (
          <form
            className="space-y-4"
            onSubmit={aoEnviar}
            noValidate
            aria-busy={carregando}
          >
            <CampoFormulario
              nome="email"
              rotulo="E-mail"
              tipo="email"
              placeholder="Digite seu e-mail"
              autoComplete="username"
              valor={valores.email}
              erro={erros.email}
              maxLength={255}
              referencia={emailRef}
              aoAlterar={aoAlterar}
            />

            <CampoFormulario
              nome="senha"
              rotulo="Senha"
              tipo={mostrarSenha ? "text" : "password"}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              valor={valores.senha}
              erro={erros.senha}
              referencia={senhaRef}
              aoAlterar={aoAlterar}
            />

            <div className="flex items-center gap-2">
              <input
                id="mostrar-senha"
                type="checkbox"
                checked={mostrarSenha}
                onChange={(evento: ChangeEvent<HTMLInputElement>) =>
                  setMostrarSenha(evento.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              />

              <label htmlFor="mostrar-senha" className="text-sm text-gray-700">
                Mostrar senha
              </label>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          {situacao !== "sucesso" && (
            <>
              Ainda não tem conta?{" "}
              <Link
                href="/cadastro"
                className="font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                Criar conta
              </Link>
              <span aria-hidden="true"> · </span>
            </>
          )}

          <Link
            ref={linkInicioRef}
            href="/"
            className="font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Voltar para a página inicial
          </Link>
        </p>
      </section>
    </main>
  );
}
