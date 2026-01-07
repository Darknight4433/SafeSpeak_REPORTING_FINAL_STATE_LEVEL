#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/start-vosk.sh [host] [port]
HOST=${1:-127.0.0.1}
PORT=${2:-5000}

echo "Starting Vosk server on ${HOST}:${PORT}"
python -m uvicorn stt.vosk_server:app --host ${HOST} --port ${PORT}
