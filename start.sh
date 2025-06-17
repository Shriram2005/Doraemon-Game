#!/bin/bash

# Doraemon 3D World Launcher
# Quick start script for the game

echo "🤖 Starting Doraemon 3D World..."
echo "================================"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found!"
    echo "Please run this script from the game directory."
    exit 1
fi

# Function to open browser
open_browser() {
    local url="http://localhost:8000"
    
    # Wait a moment for server to start
    sleep 2
    
    # Try to open browser (different commands for different systems)
    if command -v xdg-open > /dev/null; then
        xdg-open "$url"  # Linux
    elif command -v open > /dev/null; then
        open "$url"      # macOS
    elif command -v start > /dev/null; then
        start "$url"     # Windows (if using Git Bash or similar)
    else
        echo "🌐 Please open your browser and go to: $url"
    fi
}

# Start server in background and open browser
if command -v python3 > /dev/null; then
    echo "Starting Python 3 server..."
    python3 -m http.server 8000 &
    SERVER_PID=$!
elif command -v python > /dev/null; then
    echo "Starting Python 2 server..."
    python -m SimpleHTTPServer 8000 &
    SERVER_PID=$!
elif command -v node > /dev/null && command -v npx > /dev/null; then
    echo "Starting Node.js server..."
    npx http-server -p 8000 &
    SERVER_PID=$!
else
    echo "❌ No suitable web server found!"
    echo "Please install Python or Node.js"
    exit 1
fi

echo "✅ Server started on port 8000"
echo "🌐 Opening browser..."

# Open browser
open_browser

echo ""
echo "🎮 Game Controls:"
echo "  W/A/S/D or Arrow Keys - Move around"
echo "  Space - Jump"
echo "  Shift - Run"
echo "  Mouse - Look around"
echo "  V - Toggle camera view"
echo "  N - Day/Night mode"
echo "  Esc - Pause menu"
echo ""
echo "Press Ctrl+C to stop the server"

# Wait for user to stop
trap "echo ''; echo 'Stopping server...'; kill $SERVER_PID 2>/dev/null; exit 0" INT

# Keep script running
wait $SERVER_PID
