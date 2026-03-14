#!/bin/bash
cd "$(dirname "$0")"
echo "Starting blog dev server..."
npm run dev -- --port 5173 --host &
echo ""
echo "  Blog:   http://localhost:5173/"
echo "  Editor: http://localhost:5173/editor/"
echo ""
echo "Press Ctrl+C to stop."
wait
