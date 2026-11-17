"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, RefObject } from "react";

type Campo = "nome" | "email" | "senha" | "confirmarSenha";
type Valores = Record<Campo, string>;
type Erros = Partial<Record<Campo, string>>;
type Situacao = "inicial" | "carregando" | "sucesso" | "erro";

const ORDEM_CAMPOS: Campo[] = ["nome", "email", "senha", "confirmarSenha"];

const VALORES_INICIAIS: Valores = {
  nome: "",
  email: "",
  senha: "",
  confirmarSenha: "",
};

const TAMANHO_MINIMO_SENHA = 12;
const BYTES_MAXIMOS_SENHA = 72;
const PADRAO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MENSAGEM_CORRIGIR = "Corrija os campos indicados e tente novamente.";

function validar(valores: Valores): Erros {
  const erros: Erros = {};
  const nome = valores.nome.trim();
  const email = valores.email.trim().toLowerCase();

  if (!nome) {
    erros.nome = "Informe seu nome completo.";
  } else if (nome.length > 100) {
    erros.nome = "O nome deve ter até 100 caracteres.";
  }

  if (!email) {
    erros.email = "Informe seu e-mail.";
  } else if (email.length > 255 || !PADRAO_EMAIL.test(email)) {
    erros.email = "Informe um e-mail válido.";
  }

  if (!valores.senha) {
    erros.senha = "Crie uma senha.";
  } else if (valores.senha.length < TAMANHO_MINIMO_SENHA) {
    erros.senha = "A senha deve ter pelo menos 12 caracteres.";
  } else if (
    new TextEncoder().encode(valores.senha).length > BYTES_MAXIMOS_SENHA
  ) {
    erros.senha =
      "A senha é muito longa. O limite é 72 bytes; acentos e emojis ocupam mais de um byte por caractere.";
  }

  if (!valores.confirmarSenha) {
    erros.confirmarSenha = "Confirme sua senha.";
  } else if (valores.confirmarSenha !== valores.senha) {
    erros.confirmarSenha = "A confirmação de senha não é igual à senha.";
  }

  return erros;
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
  ajuda?: string;
  maxLength?: number;
  minLength?: number;
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
  ajuda,
  maxLength,
  minLength,
  referencia,
  aoAlterar,
}: CampoFormularioProps) {
  const idAjuda = `${nome}-ajuda`;
  const idErro = `${nome}-erro`;
  const descricao = [ajuda ? idAjuda : "", erro ? idErro : ""]
    .filter(Boolean)
    .join(" ");

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
        minLength={minLength}
        required
        aria-invalid={Boolean(erro)}
        aria-describedby={descricao || undefined}
        className={classeDoCampo(Boolean(erro))}
      />

      {ajuda && (
        <p id={idAjuda} className="mt-1 text-sm text-gray-600">
          {ajuda}
        </p>
      )}

      {erro && (
        <p id={idErro} className="mt-1 text-sm text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}

export default function Cadastro() {
  const [valores, setValores] = useState<Valores>(VALORES_INICIAIS);
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState("");
  const [situacao, setSituacao] = useState<Situacao>("inicial");

  const nomeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);
  const confirmarSenhaRef = useRef<HTMLInputElement>(null);
  const linkInicioRef = useRef<HTMLAnchorElement>(null);

  const referencias = {
    nome: nomeRef,
    email: emailRef,
    senha: senhaRef,
    confirmarSenha: confirmarSenhaRef,
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
      const resposta = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: valores.nome.trim(),
          email: valores.email.trim().toLowerCase(),
          senha: valores.senha,
        }),
      });

      const dados: { erro?: string } | null = await resposta
        .json()
        .catch(() => null);

      if (resposta.status === 201) {
        setValores(VALORES_INICIAIS);
        setSituacao("sucesso");
        return;
      }

      if (resposta.status === 409) {
        const errosServidor: Erros = {
          email: dados?.erro ?? "Este e-mail já está cadastrado.",
        };

        setErros(errosServidor);
        setErroGeral(MENSAGEM_CORRIGIR);
        setSituacao("erro");
        focarPrimeiroInvalido(errosServidor);
        return;
      }

      setErroGeral(
        dados?.erro ?? "Não foi possível criar a conta. Tente novamente.",
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
      ? "Criando sua conta..."
      : situacao === "sucesso"
        ? "Conta criada com sucesso. Obrigado por participar do AccessIA. O login de usuários ainda não está disponível nesta versão."
        : "";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <section className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Criar conta
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          Cadastre-se no AccessIA e participe da construção de espaços mais acessíveis.
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
              nome="nome"
              rotulo="Nome completo"
              tipo="text"
              placeholder="Digite seu nome completo"
              autoComplete="name"
              valor={valores.nome}
              erro={erros.nome}
              maxLength={100}
              referencia={nomeRef}
              aoAlterar={aoAlterar}
            />

            <CampoFormulario
              nome="email"
              rotulo="E-mail"
              tipo="email"
              placeholder="Digite seu e-mail"
              autoComplete="email"
              valor={valores.email}
              erro={erros.email}
              maxLength={255}
              referencia={emailRef}
              aoAlterar={aoAlterar}
            />

            <CampoFormulario
              nome="senha"
              rotulo="Senha"
              tipo="password"
              placeholder="Crie uma senha"
              autoComplete="new-password"
              valor={valores.senha}
              erro={erros.senha}
              ajuda="Mínimo de 12 caracteres."
              minLength={TAMANHO_MINIMO_SENHA}
              referencia={senhaRef}
              aoAlterar={aoAlterar}
            />

            <CampoFormulario
              nome="confirmarSenha"
              rotulo="Confirmar senha"
              tipo="password"
              placeholder="Digite novamente sua senha"
              autoComplete="new-password"
              valor={valores.confirmarSenha}
              erro={erros.confirmarSenha}
              minLength={TAMANHO_MINIMO_SENHA}
              referencia={confirmarSenhaRef}
              aoAlterar={aoAlterar}
            />

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
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