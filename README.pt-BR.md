# SDD Hands-on

<p align="center">
  <a href="README.pt-BR.md">🇧🇷 Português</a>
  ·
  <a href="README.en.md">🇺🇸 English</a>
</p>

![](docs/assets/sdd-handdrawn-banner.png)


Este repositório reúne experimentos com três abordagens de **desenvolvimento guiado por especificações** (*Spec-Driven Development*, SDD), aplicadas à geração de uma aplicação web simples.

A aplicação usada como referência é o **Desafio do Dia**, uma pequena aplicação para apresentar desafios diários de programação.

O repositório contém requisitos, scripts de configuração, documentação e os arquivos resultantes gerados durante os experimentos. Também pode ser executado em um **GitHub Codespace**.

## Experimentos

| Pasta | Método | Objetivo |
|---|---|---|
| [examples/01-speckit](examples/01-speckit/) | Spec Kit | Gerar a aplicação usando o fluxo do Spec Kit |
| [examples/02-openspec](examples/02-openspec/) | OpenSpec | Gerar a aplicação usando OpenSpec com OpenCode |
| [examples/03-bmad-quick](examples/03-bmad-quick/) | BMAD Quick | Gerar a aplicação usando o fluxo rápido do BMAD |

O arquivo de requisitos compartilhado está em: [examples/shared/requirements/challenge-of-the-day-app.md](examples/shared/requirements/challenge-of-the-day-app.md)



## Estrutura do repositório

```text
.
├── devcontainer.json
├── scripts/
│   ├── check-env.sh
│   └── init-speckit-project.sh
├── docs/
│   ├── README-speckit.md
│   ├── README-openspec.md
│   └── README-bmad.md
└── examples/
    ├── 01-speckit/
    ├── 02-openspec/
    ├── 03-bmad-quick/
    └── shared/requirements/
```

## Executando no Codespaces

Este repositório inclui uma configuração de ambiente de desenvolvimento, permitindo sua execução diretamente no **GitHub Codespaces**.

O ambiente inclui ferramentas básicas para os experimentos, como Node.js e Git. O restante terá que ser instalado manualmente.

## Verificando o ambiente

Execute:

```bash
bash scripts/check-env.sh
```

O script verifica as principais ferramentas usadas no hands-on e apresenta instruções de instalação quando algo estiver faltando.

## Observações

Este repositório é exploratório. O objetivo é comparar como diferentes ferramentas de SDD estruturam requisitos, planejamento, artefatos gerados e tentativas de implementação. A aplicação gerada não foi testada e certamente precisaria de refinamento, mas o código tem indícios de que segue boa parte das especificações.
