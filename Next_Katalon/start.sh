#!/bin/bash
# Convenience script to start the API server

cd "$(dirname "$0")"
echo "Starting Katalon Analyzer API Server..."
echo "Press Ctrl+C to stop"
python3 api_server.py

