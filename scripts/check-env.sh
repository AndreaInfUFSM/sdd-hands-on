#!/usr/bin/env bash
set -u

echo "Checking environment for the Spec-Driven Development hands-on..."
echo

has_error=0
has_warning=0

print_ok() {
  echo "✅ $1"
}

print_warn() {
  echo "⚠️  $1"
  has_warning=1
}

print_error() {
  echo "❌ $1"
  has_error=1
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

version_line() {
  "$1" --version 2>/dev/null | head -n 1
}

get_node_major() {
  node --version 2>/dev/null | sed 's/^v//' | cut -d. -f1
}

get_node_minor() {
  node --version 2>/dev/null | sed 's/^v//' | cut -d. -f2
}

check_required_command() {
  local cmd="$1"
  local install_hint="$2"

  if command_exists "$cmd"; then
    print_ok "$cmd found: $(version_line "$cmd")"
  else
    print_error "$cmd not found."
    echo "   Install hint: $install_hint"
  fi
}

echo "1. Basic development tools"
echo "--------------------------"

check_required_command "git" "Install Git using your operating system package manager."
check_required_command "node" "Install Node.js. For this hands-on, Node.js 20.19.0 or newer is recommended."
check_required_command "npm" "npm usually comes with Node.js."

echo

if command_exists node; then
  node_major="$(get_node_major)"
  node_minor="$(get_node_minor)"

  if [[ "$node_major" =~ ^[0-9]+$ ]] && [[ "$node_minor" =~ ^[0-9]+$ ]]; then
    if (( node_major > 20 || (node_major == 20 && node_minor >= 19) )); then
      print_ok "Node.js version is compatible with OpenSpec."
    else
      print_warn "Node.js may be too old for OpenSpec. Recommended: Node.js 20.19.0 or newer."
      echo "   Current: $(node --version)"
    fi
  else
    print_warn "Could not parse Node.js version."
  fi
fi

echo
echo "2. Spec Kit / Specify CLI"
echo "-------------------------"

if command_exists specify; then
  print_ok "specify found: $(version_line specify)"
  echo
  echo "   Verify installation with:"
  echo "   specify --version"
  echo
else
  print_warn "specify command not found."
  echo
  echo "   To install Spec Kit persistently:"
  echo "   uv tool install specify-cli --from git+https://github.com/github/spec-kit.git"
  echo
  echo "   After installing, verify with:"
  echo "   specify --version"
  echo  
  if command_exists uv; then
    print_ok "uv found: $(version_line uv)"
    echo
    echo "   Installing Spec Kit persistently requires uv:"
    echo "   uv tool install specify-cli --from git+https://github.com/github/spec-kit.git"
    echo

  else
    print_warn "uv not found. Spec Kit installation normally uses uv or uvx."
    echo
    echo "   Install uv first:"
    echo "   macOS/Linux:"
    echo "     curl -LsSf https://astral.sh/uv/install.sh | sh"
    echo
    echo "   Windows PowerShell:"
    echo "     irm https://astral.sh/uv/install.ps1 | iex"
    echo
    echo "   Then install Spec Kit:"
    echo "     uv tool install specify-cli --from git+https://github.com/github/spec-kit.git"
  fi

  if command_exists uvx; then
    print_ok "uvx found. One-time Spec Kit usage should also be possible."
    echo
    echo "   Example one-time command:"
    echo "   uvx --from git+https://github.com/github/spec-kit.git specify init ."
  else
    print_warn "uvx not found. It is usually installed together with uv."
  fi
fi

echo
echo "3. OpenSpec CLI"
echo "---------------"

if command_exists openspec; then
  print_ok "openspec found: $(version_line openspec)"
else
  print_warn "openspec command not found."
  echo
  echo "   To install OpenSpec globally:"
  echo "   npm install -g @fission-ai/openspec@latest"
  echo
  echo "   After installing, verify with:"
  echo "   openspec --version"
fi

echo
echo "4. OpenCode CLI"
echo "---------------"

if command_exists opencode; then
  print_ok "opencode found: $(version_line opencode)"
else
  print_warn "opencode command not found."
  echo
  echo "   To install OpenCode on macOS/Linux:"
  echo "   curl -fsSL https://opencode.ai/install | bash"
  echo
  echo "   After installing, restart your terminal or reload your shell profile if needed."
  echo
  echo "   Then verify with:"
  echo "   opencode --version"
  echo
  echo "   To start OpenCode in the current project:"
  echo "   opencode"
fi

echo
echo "5. Python / uv diagnostics"
echo "--------------------------"

if command_exists python3; then
  print_ok "python3 found: $(version_line python3)"
else
  print_warn "python3 not found. Spec Kit is installed through uv as a Python-based CLI, so install Python if uv/specify installation fails."
fi

echo
echo "Summary"
echo "-------"

if [[ "$has_error" -eq 1 ]]; then
  echo "Environment is missing required tools."
  echo "Install the missing required tools above before the hands-on."
  exit 1
fi

if [[ "$has_warning" -eq 1 ]]; then
  echo "Environment is usable, but some hands-on tools may need installation."
  echo "Follow the install hints above before starting."
  exit 0
fi

echo "Environment looks ready for the hands-on."
exit 0