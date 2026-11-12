
import Link from "next/link";

export default function Cadastro() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <section className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Criar conta
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          Cadastre-se no AccessIA e participe da construção de espaços mais acessíveis.
        </p>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="nome"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Nome completo
            </label>

            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Digite seu nome completo"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="senha"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Senha
            </label>

            <input
              id="senha"
              name="senha"
              type="password"
              placeholder="Crie uma senha"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="confirmarSenha"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Confirmar senha
            </label>

            <input
              id="confirmarSenha"
              name="confirmarSenha"
              type="password"
              placeholder="Digite novamente sua senha"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800"
          >
            Criar conta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já possui uma conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
