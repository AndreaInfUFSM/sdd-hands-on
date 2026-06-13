<!--
author: Andrea Charão
title: Primeiros passos com Spec Kit
language: pt
comment: Anotações sobre o uso do OpenSpec com OpenCode para iniciar uma aplicação simples.
import: https://raw.githubusercontent.com/LiaTemplates/mermaid_template/0.1.4/README.md
-->

[![LiaScript](https://raw.githubusercontent.com/LiaScript/LiaScript/master/badges/course.svg)](https://liascript.github.io/course/?https://raw.githubusercontent.com/AndreaInfUFSM/ssd-hands-on/main/examples/README-openspec.md)



# Primeiros passos com OpenSpec

Um registro sobre o que aprendi ao usar o **OpenSpec** com **OpenCode** para iniciar uma aplicação simples.


## OpenSpec

**OpenSpec** é um framework para apoiar **desenvolvimento guiado por especificações** (*Spec-Driven Development*) com agentes de IA e ferramentas de linha de comando.

A ideia central é parecida com a de outras ferramentas de SDD: antes de pedir diretamente a implementação, o trabalho começa com uma proposta de mudança, passa pela aplicação dessa mudança no código e termina com o arquivamento da especificação. 

```mermaid @mermaid
flowchart LR
    A[propose] --> B[apply]
    B --> C[archive]
```

Na prática, o OpenSpec ajuda a transformar um pedido para um agente de IA em um fluxo um pouco mais organizado.

Links úteis:

- [Documentação oficial](https://openspec.dev/)
- [Repositório no GitHub](https://github.com/Fission-AI/OpenSpec)

![Página do OpenSpec](https://opengraph.githubassets.com/openspec/Fission-AI/OpenSpec)


## Usando o OpenSpec

Para usar o OpenSpec nesta experiência, o fluxo básico foi:

- inicializar o OpenSpec no projeto
- selecionar a ferramenta/agente a ser usada
- abrir o agente no terminal do VS Code
- copiar um arquivo de requisitos para a área de especificações (isso para manter a especificação inicial idêntica à usada com outros frameworks de SDD)
- pedir ao agente para propor, aplicar e arquivar a mudança



### Dependências


- `node`/`npm`, para instalação do OpenSpec quando necessário
- `openspec`, para inicializar e manter os artefatos de especificação
- Um gerenciador de agentes, por exemplo opencode

Opcionais/seleções usados:

- `opencode`, usado nesta experiência como agente no terminal
- `git`, porque o trabalho faz mais sentido em um repositório versionado
- VS Code, usado como ambiente de trabalho



### Instalação 

- Instalar OpenSpec
- Opcional: instalar OpenCode (ou outro agente suportado)

#### OpenSpec

Instalação conforme a documentação em https://github.com/Fission-AI/OpenSpec/blob/main/docs/installation.md:

```bash
npm install -g @fission-ai/openspec@latest
```

#### OpenCode

Instalação:

```bash
curl -fsSL https://opencode.ai/install | bash
```


### Inicialização

Dentro da pasta do projeto:

```bash
openspec init
```

Durante a inicialização:

- `[Enter]` para escolher a ferramenta
- `[Space]` para selecionar `opencode`

Pastas criadas:

```text
openspec/
.opencode/
```

Explicação sobre as pastas:

- `openspec/`: guarda os artefatos do fluxo de especificação
- `.opencode/`: configuração/comandos relacionados ao agente selecionado


## Comandos mínimos

| Comando | Para que serve |
|---|---|
| `/opsx-propose` | Cria uma proposta de mudança a partir dos requisitos informados |
| `/opsx-apply` | Aplica a proposta, gerando ou modificando o código |
| `/opsx-archive` | Arquiva a mudança depois da aplicação |





---

## Experiência neste repositório

- App **Desafio do Dia** para estudantes de Paradigmas de Programação
- Objetivo: criar uma primeira versão da aplicação a partir de requisitos já documentados
- Agente usado: `opencode`
- Ferramenta de especificação: `openspec`
- Ambiente: terminal do VS Code

### Primeira rodada do workflow

Passos realizados:

1. Inicializei o OpenSpec na pasta [02-openspec](02-openspec/):

   ```bash
   openspec init
   ```

2. Escolhi a ferramenta/agente durante a inicialização:

   ```text
   [Enter] para escolher ferramenta
   [Space] para selecionar opencode
   ```

3. Verifiquei as pastas criadas:

   ```text
   .opencode/
   openspec/
   ```

4. Abri o agente no terminal do VS Code:

   ```bash
   opencode
   ```

5. Copiei o arquivo de requisitos do app para dentro da pasta de especificações do OpenSpec.

6. Pedi a criação da primeira versão do app:

   ```text
   /opsx-propose Create the first version of the Challenge of the Day app, following the requirements in specs/challenge-of-the-day-app.md
   ```

7. Apliquei a proposta:

   ```text
   /opsx-apply
   ```

8. Arquivei a mudança:

   ```text
   /opsx-archive
   ```


### Reflexões / Conclusão

Diferenças em relação ao processo anterior (01-speckit):

- Usei outro agente (OpenCode) que parece bastante usado com OpenSpec. Para uma comparação mais justa, deveria ser usado o mesmo agente
- Sem tempo para uma segunda rodada, nem inspeção do código gerado

Reflexões e observações:

- Processo foi mais rápido, comparado com a primeira rodada com SpecKit (vale lembrar que tanto o agente como o framework impactam nesse tempo)
- OpenSpec não interfere (ou se importa) no versionamento com git, ao contrário do SpecKit
- Quantidade de artefatos/documentação gerados parece ser menor (conferir)

