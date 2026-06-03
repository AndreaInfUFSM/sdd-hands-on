#!/usr/bin/env bash
set -euo pipefail

# scripts/init-speckit-project.sh
#
# Initialize Spec Kit inside one isolated project folder.
#
# Usage:
#   ./scripts/init-speckit-project.sh examples/01-speckit
#   ./scripts/init-speckit-project.sh examples/01-speckit --integration copilot
#   ./scripts/init-speckit-project.sh examples/01-speckit --force

TARGET_DIR="${1:-}"
INTEGRATION="copilot"
FORCE="false"

if [[ -z "$TARGET_DIR" ]]; then
  echo "Usage: ./scripts/init-speckit-project.sh <target-dir> [--integration NAME] [--force]"
  exit 1
fi

shift || true

while [[ $# -gt 0 ]]; do
  case "$1" in
    --integration)
      INTEGRATION="${2:-}"
      shift 2
      ;;
    --force)
      FORCE="true"
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if [[ ! -d "$TARGET_DIR" ]]; then
  echo "Error: target directory does not exist: $TARGET_DIR"
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "Error: git is not installed."
  exit 1
fi

if ! command -v uvx >/dev/null 2>&1; then
  echo "Error: uvx is not installed or not in PATH."
  echo "Install uv/uvx first in the devcontainer."
  exit 1
fi

cd "$TARGET_DIR"

echo "Target project: $(pwd)"
echo "Integration: $INTEGRATION"

if [[ ! -d ".git" ]]; then
  echo "Initializing isolated Git repo..."
  git init
fi

if [[ -d ".specify" && "$FORCE" != "true" ]]; then
  echo "Spec Kit already initialized in this folder."
  echo "Use --force to re-run."
  exit 0
fi

echo "Initializing Spec Kit inside this project folder..."

uvx --from git+https://github.com/github/spec-kit.git \
  specify init . \
  --integration "$INTEGRATION" \
  --script sh \
  --ignore-agent-tools

echo
echo "Done."
echo "Spec Kit should now live inside:"
echo "  $(pwd)/.specify"
echo "  $(pwd)/specs"