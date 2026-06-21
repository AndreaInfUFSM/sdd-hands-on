#!/usr/bin/env bash
set -e

echo "Checking SDD Hands-on container..."
echo

node --version
npm --version
python3 --version
git --version
gh --version || true
openspec --version || true
uv --version || true

echo
echo "Environment check complete."