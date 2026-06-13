# SDD Hands-on

<p align="center">
  <a href="README.pt-BR.md">🇧🇷 Português</a>
  ·
  <a href="README.en.md">🇺🇸 English</a>
</p>

![](docs/assets/sdd-handdrawn-banner.png)

This repository contains experiments with three **Spec-Driven Development** approaches applied to the generation of a simple web app.

The reference application is **Challenge of the Day**, a small app for presenting daily programming challenges.

The repository includes requirements, setup scripts, documentation, and generated files produced during the experiments. It can also be executed in a **GitHub Codespace**.

## Experiments

| Folder | Method | Goal |
|---|---|---|
| `examples/01-speckit` | Spec Kit | Generate the app through the Spec Kit workflow |
| `examples/02-openspec` | OpenSpec | Generate the app using OpenSpec with OpenCode |
| `examples/03-bmad-quick` | BMAD Quick | Generate the app using the BMAD quick development flow |

The shared requirements file is located at:

```text
examples/shared/requirements/challenge-of-the-day-app.md
```

## Repository structure

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

## Running in Codespaces

This repository includes a development container configuration, so it can be opened directly in **GitHub Codespaces**.

The environment includes basic tools for the experiments, such as Node.js, Python, Git, GitHub CLI, OpenSpec, and useful extensions for Copilot, JSON, and Mermaid.

## Checking the environment

Run:

```bash
./scripts/check-env.sh
```

The script checks the main tools used in the hands-on and prints installation hints when something is missing.

## Notes

This repository is exploratory. The goal is not to present a polished final app, but to compare how different SDD tools structure requirements, planning, generated artifacts, and implementation attempts.
