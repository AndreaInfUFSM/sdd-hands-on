#!/usr/bin/env bash
set -euo pipefail

echo "Preparing environment for the Spec-Driven Development hands-on..."
echo

print_ok() {
  echo "✅ $1"
}

print_info() {
  echo "ℹ️  $1"
}

print_error() {
  echo "❌ $1"
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

version_line() {
  "$@" 2>/dev/null | head -n 1
}

get_node_major() {
  node --version 2>/dev/null | sed 's/^v//' | cut -d. -f1
}

get_node_minor() {
  node --version 2>/dev/null | sed 's/^v//' | cut -d. -f2
}

refresh_path() {
  # uv commonly installs executables here.
  if [[ -d "$HOME/.local/bin" ]]; then
    export PATH="$HOME/.local/bin:$PATH"
  fi

  # OpenCode's installer may use this directory.
  if [[ -d "$HOME/.opencode/bin" ]]; then
    export PATH="$HOME/.opencode/bin:$PATH"
  fi

  # Reload common profile files for this script process.
  # This cannot modify the parent terminal process.
  if [[ -f "$HOME/.profile" ]]; then
    # shellcheck disable=SC1090
    source "$HOME/.profile" || true
  fi

  if [[ -f "$HOME/.bashrc" ]]; then
    # shellcheck disable=SC1090
    source "$HOME/.bashrc" || true
  fi
}

require_command() {
  local cmd="$1"

  if ! command_exists "$cmd"; then
    print_error "$cmd is required but was not found."
    exit 1
  fi
}

echo "1. Checking base development environment"
echo "----------------------------------------"

require_command git
print_ok "git found: $(version_line git --version)"

require_command node
print_ok "node found: $(version_line node --version)"

require_command npm
print_ok "npm found: $(version_line npm --version)"

node_major="$(get_node_major)"
node_minor="$(get_node_minor)"

if [[ "$node_major" =~ ^[0-9]+$ ]] && [[ "$node_minor" =~ ^[0-9]+$ ]]; then
  if (( node_major > 20 || (node_major == 20 && node_minor >= 19) )); then
    print_ok "Node.js version is compatible with OpenSpec."
  else
    print_error "Node.js 20.19.0 or newer is required."
    echo "   Current version: $(node --version)"
    exit 1
  fi
else
  print_error "Could not determine the Node.js version."
  exit 1
fi

echo
echo "2. Preparing uv"
echo "---------------"

if command_exists uv; then
  print_ok "uv already installed: $(version_line uv --version)"
else
  print_info "Installing uv..."
  curl -LsSf https://astral.sh/uv/install.sh | sh

  refresh_path

  if ! command_exists uv; then
    print_error "uv was installed but is not available on PATH."
    exit 1
  fi

  print_ok "uv installed: $(version_line uv --version)"
fi

echo
echo "3. Preparing Spec Kit / Specify CLI"
echo "-----------------------------------"

if command_exists specify; then
  print_ok "specify already installed: $(version_line specify version)"
else
  print_info "Installing Specify CLI..."
  uv tool install specify-cli

  refresh_path

  if ! command_exists specify; then
    print_error "Specify CLI installation completed but 'specify' is not available on PATH."
    exit 1
  fi

  print_ok "specify installed: $(version_line specify version)"
fi

echo
echo "4. Preparing OpenSpec CLI"
echo "-------------------------"

if command_exists openspec; then
  print_ok "openspec already installed: $(version_line openspec --version)"
else
  print_info "Installing OpenSpec..."
  npm install -g @fission-ai/openspec@latest

  refresh_path

  if ! command_exists openspec; then
    print_error "OpenSpec installation completed but 'openspec' is not available on PATH."
    exit 1
  fi

  print_ok "openspec installed: $(version_line openspec --version)"
fi

echo
echo "5. Preparing OpenCode CLI"
echo "-------------------------"

if command_exists opencode; then
  print_ok "opencode already installed: $(version_line opencode --version)"
else
  print_info "Installing OpenCode..."
  curl -fsSL https://opencode.ai/install | bash

  refresh_path

  if ! command_exists opencode; then
    print_error "OpenCode installation completed but 'opencode' is not available on PATH."
    exit 1
  fi

  print_ok "opencode installed: $(version_line opencode --version)"
fi

echo
echo "6. Configuring OpenCode"
echo "-----------------------"

OPENCODE_MODEL="opencode/big-pickle"
OPENCODE_CONFIG="opencode.json"

node - "$OPENCODE_CONFIG" "$OPENCODE_MODEL" <<'NODE'
const fs = require("fs");

const [configPath, model] = process.argv.slice(2);

let config = {};

if (fs.existsSync(configPath)) {
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    console.error(`Could not parse existing ${configPath}: ${error.message}`);
    process.exit(1);
  }
}

config.$schema ??= "https://opencode.ai/config.json";
config.model = model;

fs.writeFileSync(
  configPath,
  JSON.stringify(config, null, 2) + "\n"
);
NODE

print_ok "OpenCode default model configured: $OPENCODE_MODEL"

echo
echo "7. Final verification"
echo "---------------------"

refresh_path

print_ok "git:      $(version_line git --version)"
print_ok "node:     $(version_line node --version)"
print_ok "npm:      $(version_line npm --version)"
print_ok "uv:       $(version_line uv --version)"
print_ok "specify:  $(version_line specify version)"
print_ok "openspec: $(version_line openspec --version)"
print_ok "opencode: $(version_line opencode --version)"

if [[ -f "$OPENCODE_CONFIG" ]] && grep -q '"model": "opencode/big-pickle"' "$OPENCODE_CONFIG"; then
  print_ok "OpenCode model: opencode/big-pickle"
else
  print_error "OpenCode model configuration could not be verified."
  exit 1
fi

echo
echo "Environment is ready for the hands-on."