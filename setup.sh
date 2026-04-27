#!/usr/bin/env bash
set -e

echo ""
echo "  ====================================================="
echo "   GHE Academic Portal — Automated Setup (Mac / Linux)"
echo "  ====================================================="
echo ""

# ── STEP 1: Check Node.js ──────────────────────────────
echo "[1/4] Checking Node.js..."
if ! command -v node &>/dev/null; then
    echo "  Node.js not found. Attempting to install..."
    if command -v brew &>/dev/null; then
        brew install node
    elif command -v apt-get &>/dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif command -v dnf &>/dev/null; then
        curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
        sudo dnf install -y nodejs
    else
        echo "  [!] Cannot auto-install Node.js on this system."
        echo "      Please install from: https://nodejs.org/en/download"
        exit 1
    fi
fi
echo "  Node.js $(node --version) — OK"

# ── STEP 2: Check npm ──────────────────────────────────
echo "[2/4] Checking npm..."
if ! command -v npm &>/dev/null; then
    echo "  [!] npm not found. Please reinstall Node.js from https://nodejs.org"
    exit 1
fi
echo "  npm $(npm --version) — OK"

# ── STEP 3: Install dependencies ──────────────────────
echo ""
echo "[3/4] Installing project dependencies..."
cd "$(dirname "$0")"
npm install
echo "  Dependencies installed — OK"

# ── STEP 4: Launch dev server ─────────────────────────
echo ""
echo "[4/4] Starting development server..."
echo ""
echo "  ====================================================="
echo "   Portal running at: http://localhost:5173"
echo "   Press Ctrl+C to stop."
echo "  ====================================================="
echo ""
npm run dev
