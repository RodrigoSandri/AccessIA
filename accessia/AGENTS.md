
# AGENTS.md — AccessIA

## 1. Contexto do projeto

AccessIA é uma aplicação web colaborativa para ajudar pessoas com deficiência e pessoas idosas a consultar informações de acessibilidade de estabelecimentos antes de visitá-los.

O objetivo é promover autonomia, confiança e acesso a informações sobre acessibilidade.

## 2. Tecnologias

- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- MySQL
- mysql2/promise
- Git e GitHub

Firebase Authentication está previsto para uma etapa futura. Não considerar a autenticação já implementada.

## 3. Estrutura do projeto

- `src/app/`: páginas e rotas da aplicação.
- `src/app/api/`: endpoints da API.
- `src/components/`: componentes reutilizáveis.
- `src/lib/db.ts`: conexão com o MySQL.
- `.env.local`: variáveis de ambiente locais.
- `tasks.md`: lista de tarefas e prioridades.

Antes de criar ou alterar arquivos, inspecionar a estrutura e o código existente.

## 4. Regras de desenvolvimento

1. Usar TypeScript com tipos consistentes.
2. Respeitar a arquitetura existente do Next.js App Router.
3. Reutilizar componentes quando fizer sentido.
4. Evitar código duplicado e dependências desnecessárias.
5. Fazer alterações pequenas e explicar cada arquivo modificado.
6. Não presumir que funcionalidades estão prontas sem verificar o código.
7. Não sobrescrever implementações existentes sem analisar seus efeitos.
8. Consultar `tasks.md` antes de iniciar uma tarefa e atualizá-lo após validar o resultado.

## 5. Banco de dados e segurança

- Usar as variáveis `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME`.
- Nunca colocar senhas diretamente no código.
- Nunca imprimir senhas nos logs ou incluí-las em arquivos versionados.
- Não enviar `.env.local` ao GitHub.
- Não apagar dados nem alterar tabelas sem autorização explícita.
- Conferir os nomes e tipos das colunas antes de escrever consultas SQL.
- Tratar erros sem expor detalhes internos ao usuário final.

## 6. API de estabelecimentos

O endpoint `/api/estabelecimentos` consulta o banco MySQL.

A consulta atual utiliza os campos:

- `id`
- `nome`
- `cidade`
- `categoria`
- `endereco`
- `descricao`
- `rampa_acesso`
- `banheiro_adaptado`
- `vaga_reservada`

Preservar os nomes reais das colunas e confirmar a estrutura do banco antes de alterá-los.

Uma resposta `[]` indica que a consulta retornou uma lista vazia, não necessariamente um erro.

## 7. Acessibilidade

Considerar diferentes necessidades de acessibilidade, não apenas deficiência física.

Priorizar:

- HTML semântico;
- navegação por teclado;
- formulários com rótulos claros;
- contraste e legibilidade;
- mensagens compreensíveis;
- layout responsivo;
- informações de acessibilidade organizadas.

Não afirmar que um estabelecimento é acessível sem informações que sustentem essa conclusão.

## 8. Processo de trabalho

Antes de implementar:

1. Ler este arquivo e `tasks.md`.
2. Inspecionar os arquivos relacionados.
3. Explicar a solução proposta.
4. Identificar os arquivos que serão alterados.

Após implementar:

1. Revisar as alterações.
2. Executar as verificações disponíveis.
3. Corrigir os erros encontrados.
4. Atualizar `tasks.md` somente com progresso confirmado.
5. Resumir o resultado e indicar a próxima tarefa.

Não realizar commits ou pushes sem autorização do responsável pelo projeto.
