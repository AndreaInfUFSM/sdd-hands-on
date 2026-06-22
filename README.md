# SDD Hands-on



![](docs/assets/sdd-handdrawn-banner.svg)

<p align="center">
    <strong>Experimente: 1 aplicação + 3 SDD frameworks</strong>
</p>

## ➡️ Sumário


- [O que tem aqui?](#%EF%B8%8F-o-que-tem-aqui)
- [Para que serve?](#%EF%B8%8F-para-que-serve)
- [Configure seu ambiente de execução](#%EF%B8%8F-configure-seu-ambiente-de-execução)
- [Verifique o ambiente](#%EF%B8%8F-verifique-o-ambiente)
- [Anotações sobre cada experimento](#%EF%B8%8F-anotações-sobre-cada-experimento)
- [Arquivos e pastas](#%EF%B8%8F-arquivos-e-pastas)
- [Síntese comparativa](#%EF%B8%8F-síntese-comparativa)
- [Saiba mais](#%EF%B8%8F-saiba-mais)


## ➡️ O que tem aqui?

- Este repositório reúne experimentos com três frameworks de **desenvolvimento guiado por especificações** (*Spec-Driven Development*, SDD): SpecKit, OpenSpec e BMAD.


- Os 3 frameworks foram aplicados à geração inicial de uma mesma aplicação: o **Desafio do Dia**, uma aplicação web simples para apresentar um desafio diário com uma questão sobre programação.

- Apesar de simples, a arquitetura especificada não é óbvia/clássica, pois usa um backend com Google Apps Script. Esse detalhe visa complicar sutilmente o processo.

- Neste repositório você encontra scripts de configuração, documentação, requisitos de entrada  e arquivos resultantes gerados durante os experimentos. O repositório pode ser executado em um **GitHub Codespace** ou **Dev Container** local no VS Code.


## ➡️ Para que serve?

Use este repositório para:

- Fazer uma prática rápida com esses 3 frameworks, abreviando o processo de instalação de dependências 

- Conhecer exemplos de saída dos processos a partir de uma mesma entrada



## ➡️ Configure seu ambiente de execução


<details>
<summary><strong>Opção 1: Remotamente no GitHub Codespaces</strong></summary>

- Faça login no GitHub
- Acesse este repositório: https://github.com/AndreaInfUFSM/sdd-hands-on
- Clique em Code -> Codespaces -> + (Create a codespace on main)
- Aguarde pacientemente a criação do codespace

</details>

<br> 

<details>
<summary><strong>Opção 2: Localmente com Docker e VS Code</strong></summary>

- Instale [Docker Engine](https://docs.docker.com/engine/install/) e VS Code
- Teste o funcionamento do Docker localmente
  
  ```
  sudo docker run hello-world
  ```

  Se isso não funcionar, revise a instalação até dar certo, senão nem adianta seguir os passos seguintes
- Clone este repositório localmente: https://github.com/AndreaInfUFSM/sdd-hands-on
- Abra o repositório com VS Code e instale a extensão [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- Aguarde pacientemente a criação do container (dá para acompanhar os logs para se certificar de que a criação está em andamento)

</details>

<br> 

⚠️ O ambiente de execução inclui ferramentas básicas para os experimentos. O restante deve ser instalado **manualmente**.




## ➡️ Verifique o ambiente


- Depois de iniciar seu ambiente de execução, abra um terminal dentro do repositório/container e execute:

  ```bash
  bash scripts/check-env.sh
  ```

- Esse script verifica as principais ferramentas usadas no hands-on e apresenta instruções de instalação manual para o que estiver faltando.


## ➡️ Anotações sobre cada experimento

Escolha sua ferramenta e veja as anotações detalhadas sobre ela.

| Framework | Documentação |
|---|---|
| Spec Kit | [docs/README-01-speckit.md](docs/README-01-speckit.md) |
| OpenSpec | [docs/README-02-openspec.md](docs/README-02-openspec.md) |
| BMAD Quick | [docs/README-03-bmad-quick.md](docs/README-03-bmad-quick.md) |


## ➡️ Arquivos e pastas

- Arquivo de requisitos compartilhado: [examples/shared/requirements/challenge-of-the-day-app.md](examples/shared/requirements/challenge-of-the-day-app.md)


- Pastas com arquivos de especificação e código gerado usando cada framework:

  - [examples/01-speckit](examples/01-speckit/)
  - [examples/02-openspec](examples/02-openspec/)
  - [examples/03-bmad-quick](examples/03-bmad-quick/)






## ➡️ Síntese comparativa

### Who / When

- Spec Kit: criado por Microsoft Github / [Sept 2025](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit)
- OpenSpec: criado e mantido por Fission AI / [Jan 2026](https://github.com/Fission-AI/OpenSpec/releases/tag/v1.0.0)
- BMAD: criado por Brian Madison e mantido por comunidade / [Abr 2025](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)




### Processo 

Resumidamente, estes são os passos dos processos definidos com cada framework, em comparação com um processo manual organizado:

```
Spec Kit:   specify → plan → tasks → implement
OpenSpec:   propose → apply → archive
BMAD:       analyst/PM/architect/dev workflows
Manual:     requirements.md → plan.md → tasks.md → code
```

### Experiência

- SpecKit: experiência mais longa e restritiva devido à necessidade de inicializar repositório e realizar no mínimo 4 etapas; os nomes das etapas são intuitivos e pedagogicamente superiores
- OpenSpec foi a experiência mais leve e rápida, com 3 etapas apenas; os nomes das etapas são pouco intuitivos
- BMAD foi a experiência mais completa e que levou a um código backend superior na plataforma em questão, em termos de nomes de funções, pois usou  sufixo "_" para funções auxiliares



## ➡️ Saiba mais 

### SpecKit

- Documentação oficial: https://github.github.com/spec-kit/
- Repositório no GitHub: https://github.com/github/spec-kit

### OpenSpec

- Documentação oficial: https://openspec.dev/
- Repositório no GitHub: https://github.com/Fission-AI/OpenSpec



### BMAD

- Documentação oficial: https://docs.bmad-method.org/
- Repositório no GitHub: https://github.com/bmad-code-org/BMAD-METHOD

## ➡️ Observações

- Este repositório é exploratório. O objetivo é comparar como diferentes ferramentas de SDD estruturam requisitos, planejamento, artefatos gerados e tentativas de implementação. 
- A aplicação gerada não foi testada e certamente precisaria de refinamento, mas o código tem indícios de que segue boa parte das especificações.
- O ambiente do GitHub Codespaces roda Linux, e todos os comandos neste repositório só foram testados nesse sistema, mas provavelmente também sejam viáveis em Windows.

