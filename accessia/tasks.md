# AccessIA — Lista de Tarefas

## Objetivo da primeira versão

Entregar uma versão funcional do AccessIA para consultar estabelecimentos e visualizar informações de acessibilidade, utilizando Next.js e MySQL.

## 1. Banco de dados e API

- [x] Banco de dados `accessia` criado.
- [x] Tabelas iniciais `estabelecimentos` e `contribuicoes` criadas.
- [x] Conexão com MySQL configurada por variáveis de ambiente.
- [x] API de estabelecimentos integrada ao MySQL.
- [x] Rota `/api/estabelecimentos` respondendo com HTTP 200.
- [x] Consulta SQL da API com as colunas de estabelecimentos necessárias.
- [x] Inserir estabelecimentos de teste no banco.
- [x] Confirmar que a API retorna os registros cadastrados.
- [x] Implementar tratamento de erros nas rotas de listagem e consulta por ID.
- [x] Implementar a rota `/api/estabelecimentos/[id]`.
- [x] Validar IDs inválidos com resposta HTTP 400.
- [ ] Testar o retorno HTTP 404 para estabelecimentos inexistentes.
- [ ] Testar o comportamento quando o banco de dados estiver indisponível.

## 2. Páginas de estabelecimentos

- [ ] Conferir a página `/estabelecimentos`.
- [ ] Garantir que a página apresenta os dados reais do MySQL.
- [ ] Exibir uma mensagem quando não houver resultados.
- [ ] Implementar estados de carregamento e erro.
- [ ] Conferir a página de detalhes `/estabelecimentos/[id]`.
- [ ] Garantir que cada página de detalhes apresenta o estabelecimento correto.
- [ ] Tratar estabelecimentos inexistentes.

## 3. Qualidade e segurança

- [ ] Revisar e remover logs temporários de diagnóstico.
- [ ] Confirmar que as credenciais estão no `.env.local`.
- [ ] Confirmar que `.env.local` não está sendo enviado ao GitHub.
- [ ] Executar `npm run lint`.
- [ ] Executar `npx tsc --noEmit`.
- [ ] Executar `npm run build` e corrigir eventuais erros.
- [ ] Investigar o aviso de múltiplos arquivos `package-lock.json` sem apagar arquivos às cegas.
- [ ] Revisar o aviso de `metadataBase`.

## 4. Documentação

- [ ] Conferir e finalizar o `AGENTS.md`.
- [ ] Manter este arquivo atualizado conforme o projeto evoluir.
- [ ] Registrar as alterações importantes realizadas.

## 5. Funcionalidades futuras

- [ ] Implementar autenticação com Firebase.
- [ ] Desenvolver login e cadastro.
- [ ] Implementar contribuições de usuários.
- [ ] Implementar avaliações e envio de fotos.
- [ ] Planejar a validação das contribuições.
- [ ] Revisar a responsividade e a acessibilidade da interface.

## Regras de trabalho

- Priorizar o que é necessário para a primeira versão.
- Ler os arquivos existentes antes de modificá-los.
- Não marcar tarefas como concluídas sem verificar o funcionamento.
- Não expor senhas ou credenciais.
- Não executar alterações destrutivas no banco sem autorização.
- Não realizar commits ou pushes sem autorização explícita.