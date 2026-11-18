
import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import type { RowDataPacket } from "mysql2";
import { pool } from "./db";

type ResultadoLimite = {
  permitido: boolean;
  indisponivel: boolean;
  retryAfter: number;
};

function normalizarIp(ip: string): string | null {
  const endereco = ip.trim().replace(/^\[|\]$/g, "").split("%")[0];

  if (isIP(endereco) === 4) {
    return endereco;
  }

  if (isIP(endereco) !== 6) {
    return null;
  }

  let enderecoExpandido = endereco.toLowerCase();

  if (enderecoExpandido.includes(".")) {
    const partes = enderecoExpandido.split(":");
    const ipv4 = partes.pop();

    if (!ipv4 || isIP(ipv4) !== 4) {
      return null;
    }

    const octetos = ipv4.split(".").map(Number);
    const grupo1 = ((octetos[0] << 8) | octetos[1]).toString(16);
    const grupo2 = ((octetos[2] << 8) | octetos[3]).toString(16);

    enderecoExpandido = `${partes.join(":")}:${grupo1}:${grupo2}`;
  }

  const partes = enderecoExpandido.split("::");
  const esquerda = partes[0] ? partes[0].split(":") : [];
  const direita = partes[1] ? partes[1].split(":") : [];
  const faltantes = 8 - esquerda.length - direita.length;

  const grupos =
    partes.length === 2
      ? [...esquerda, ...Array(faltantes).fill("0"), ...direita]
      : esquerda;

  if (grupos.length !== 8) {
    return null;
  }

  const normalizados = grupos.map((grupo) => grupo.padStart(4, "0"));

  if (
    normalizados.slice(0, 5).every((grupo) => grupo === "0000") &&
    normalizados[5] === "ffff"
  ) {
    const primeiro = parseInt(normalizados[6].slice(0, 2), 16);
    const segundo = parseInt(normalizados[6].slice(2), 16);
    const terceiro = parseInt(normalizados[7].slice(0, 2), 16);
    const quarto = parseInt(normalizados[7].slice(2), 16);

    return `${primeiro}.${segundo}.${terceiro}.${quarto}`;
  }

  return `${normalizados.slice(0, 4).join(":")}:0:0:0:0`;
}

function obterIpConfiavel(request: Request): string {
  if (process.env.VERCEL !== "1") {
    return "sem-ip-confiavel";
  }

  const cabecalhos = [
    request.headers.get("x-vercel-forwarded-for"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-forwarded-for"),
  ];

  for (const cabecalho of cabecalhos) {
    if (!cabecalho) {
      continue;
    }

    const ip = normalizarIp(cabecalho.split(",")[0]);

    if (ip) {
      return ip;
    }
  }

  return "sem-ip-confiavel";
}

function gerarHash(escopo: string, ip: string, segredo: string): string {
  return createHmac("sha256", segredo)
    .update(`limite-requisicoes:v1:${escopo}:${ip}`)
    .digest("hex");
}

export async function verificarLimiteRequisicoes(
  request: Request,
  escopo: string,
  limite = 10,
  janelaSegundos = 3600,
): Promise<ResultadoLimite> {
  const segredo = process.env.AUTH_SECRET;

  if (
    !segredo?.trim() ||
    !escopo.trim() ||
    escopo.length > 40 ||
    !Number.isInteger(limite) ||
    limite < 1 ||
    !Number.isInteger(janelaSegundos) ||
    janelaSegundos < 1
  ) {
    return {
      permitido: false,
      indisponivel: true,
      retryAfter: 60,
    };
  }

  const ip = obterIpConfiavel(request);
  const chaveHash = gerarHash(escopo, ip, segredo);

  try {
    await pool.execute(
      `INSERT INTO limites_requisicoes
        (escopo, chave_hash, tentativas, janela_inicio)
       VALUES (?, ?, 1, NOW())
       ON DUPLICATE KEY UPDATE
         tentativas = IF(
           TIMESTAMPDIFF(SECOND, janela_inicio, NOW()) >= ?,
           1,
           tentativas + 1
         ),
         janela_inicio = IF(
           TIMESTAMPDIFF(SECOND, janela_inicio, NOW()) >= ?,
           NOW(),
           janela_inicio
         )`,
      [escopo, chaveHash, janelaSegundos, janelaSegundos],
    );

    const [linhas] = await pool.execute<
      Array<
        RowDataPacket & {
          tentativas: number;
          segundos_decorridos: number;
        }
      >
    >(
      `SELECT
         tentativas,
         TIMESTAMPDIFF(SECOND, janela_inicio, NOW()) AS segundos_decorridos
       FROM limites_requisicoes
       WHERE escopo = ? AND chave_hash = ?`,
      [escopo, chaveHash],
    );

    if (linhas.length === 0) {
      throw new Error("Registro do limite não encontrado");
    }

    const tentativas = Number(linhas[0].tentativas);
    const decorridos = Number(linhas[0].segundos_decorridos);
    const retryAfter = Math.max(1, janelaSegundos - decorridos);

    return {
      permitido: tentativas <= limite,
      indisponivel: false,
      retryAfter,
    };
  } catch {
    return {
      permitido: false,
      indisponivel: true,
      retryAfter: 60,
    };
  }
}
