const bcrypt = require("bcryptjs");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Digite a senha exclusiva do AccessIA: ", async (senha) => {
  if (senha.length < 12) {
    console.log("A senha precisa ter pelo menos 12 caracteres.");
    rl.close();
    process.exitCode = 1;
    return;
  }

  const hash = await bcrypt.hash(senha, 12);

  console.log("\nHash gerado com sucesso:");
  console.log(hash);

  rl.close();
});