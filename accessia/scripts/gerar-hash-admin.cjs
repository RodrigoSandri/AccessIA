
const bcrypt = require("bcryptjs");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Digite a senha administrativa atual: ", async (senha) => {
  try {
    if (senha.length < 12) {
      console.log("A senha precisa ter pelo menos 12 caracteres.");
      process.exitCode = 1;
      return;
    }

    const hash = await bcrypt.hash(senha, 12);

    if (hash.length !== 60) {
      throw new Error("O hash gerado não possui 60 caracteres.");
    }

    console.log("\nHash bcrypt gerado com sucesso!");
    console.log("Tamanho:", hash.length);
    console.log("Formato:", /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(hash) ? "Válido" : "Inválido");
    console.log("\nHash para copiar:");
    console.log(hash);
    console.log("\nNo .env.local, coloque uma barra \\ antes de cada $.");
  } catch (erro) {
    console.error("Erro ao gerar hash:", erro.message);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
});
