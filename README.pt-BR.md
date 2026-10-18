# Ancover Environment Presence Checker

**Experimental.** Verifica uma lista explícita de variáveis de ambiente e informa somente seus nomes e estados: presentes, ausentes, vazias ou com substituição não resolvida. Nenhum valor é impresso. Os próprios nomes podem ser sensíveis; revise-os antes de compartilhar.

Requisito: **Node.js 22+**, sem dependências adicionais.

```sh
node --test tests/check.test.mjs
node skills/env-presence-check/scripts/check.mjs --contract examples/contract.json --env-file examples/environment.sample
```

Crie um contrato JSON com `required` e, opcionalmente, `optional`, contendo nomes em maiúsculas. O exemplo usa apenas dados sintéticos. Para verificar o processo que lança o script, substitua `--env-file CAMINHO` por `--process`; isso não acessa outro terminal, container ou serviço remoto.

Saídas: 0 para presença dos requisitos, 1 para requisitos ausentes/vazios/não resolvidos e 2 para erro de entrada ou ambiente. O parser aceita um subconjunto conservador de dotenv; não avalia substituições nem suporta valores multilinha ou escapes em aspas. Valores somente com espaços são considerados vazios. Erros não exibem linhas, valores ou caminhos.

Não valida credenciais, conectividade, precedência do Compose ou prontidão de deploy. Não é scanner de segredos nem ferramenta para limpar logs arbitrários. Não há telemetria, rede ou gravação de arquivos. Instale extraindo o código; atualize revisando o diff e repetindo os testes; desinstale removendo somente o diretório extraído.

Consulte [especificação e alternativas](docs/specification.md), [evidências de validação](docs/validation.md) e [segurança](SECURITY.md). Os formatos de pacote não comprovam execução conversacional nos agentes. Licença MIT.
