#!/bin/bash

# Doraemon 3D World Deployment Script
# This script helps deploy the game to various platforms

echo "🤖 Doraemon 3D World Deployment Script"
echo "======================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to start local server
start_local_server() {
    echo "Starting local development server..."
    
    if command_exists python3; then
        echo "Using Python 3 HTTP server"
        python3 -m http.server 8000
    elif command_exists python; then
        echo "Using Python 2 HTTP server"
        python -m SimpleHTTPServer 8000
    elif command_exists node && command_exists npx; then
        echo "Using Node.js HTTP server"
        npx http-server -p 8000
    elif command_exists php; then
        echo "Using PHP built-in server"
        php -S localhost:8000
    else
        echo "❌ No suitable web server found!"
        echo "Please install Python, Node.js, or PHP to run a local server"
        exit 1
    fi
}

# Function to validate files
validate_files() {
    echo "Validating project files..."
    
    required_files=(
        "index.html"
        "js/main.js"
        "js/game.js"
        "js/character.js"
        "js/environment.js"
        "js/controls.js"
        "js/audio.js"
        "css/styles.css"
        "README.md"
        "package.json"
    )
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            echo "✅ $file"
        else
            echo "❌ $file (missing)"
            exit 1
        fi
    done
    
    echo "All required files are present!"
}

# Function to optimize for production
optimize_for_production() {
    echo "Optimizing for production..."
    
    # Create optimized version
    mkdir -p dist
    
    # Copy all files to dist
    cp -r * dist/ 2>/dev/null || true
    
    # Remove development files from dist
    rm -rf dist/deploy.sh dist/dist
    
    echo "Production files created in 'dist' directory"
}

# Function to check browser compatibility
check_browser_compatibility() {
    echo "Browser compatibility check..."
    echo "✅ Chrome 60+"
    echo "✅ Firefox 55+"
    echo "✅ Safari 12+"
    echo "✅ Edge 79+"
    echo ""
    echo "Required features:"
    echo "✅ WebGL 1.0"
    echo "✅ Web Audio API"
    echo "✅ Pointer Lock API"
    echo "✅ ES6 JavaScript"
}

# Function to display deployment instructions
show_deployment_instructions() {
    echo ""
    echo "🚀 Deployment Instructions"
    echo "========================="
    echo ""
    echo "Local Development:"
    echo "  ./deploy.sh --serve"
    echo ""
    echo "Static Web Hosting (GitHub Pages, Netlify, Vercel):"
    echo "  1. Upload all files to your hosting service"
    echo "  2. Set index.html as the entry point"
    echo "  3. Ensure HTTPS is enabled for Pointer Lock API"
    echo ""
    echo "Traditional Web Server (Apache, Nginx):"
    echo "  1. Copy files to web root directory"
    echo "  2. Ensure MIME types are configured for .js files"
    echo "  3. Enable gzip compression for better performance"
    echo ""
    echo "CDN Deployment:"
    echo "  1. Upload files to CDN"
    echo "  2. Update any absolute paths to relative paths"
    echo "  3. Configure caching headers appropriately"
}

# Main script logic
case "$1" in
    --serve)
        validate_files
        start_local_server
        ;;
    --validate)
        validate_files
        ;;
    --optimize)
        validate_files
        optimize_for_production
        ;;
    --check)
        check_browser_compatibility
        ;;
    --help)
        show_deployment_instructions
        ;;
    *)
        echo "Usage: $0 [--serve|--validate|--optimize|--check|--help]"
        echo ""
        echo "Options:"
        echo "  --serve     Start local development server"
        echo "  --validate  Check if all required files are present"
        echo "  --optimize  Create optimized production build"
        echo "  --check     Show browser compatibility information"
        echo "  --help      Show detailed deployment instructions"
        echo ""
        echo "Quick start: $0 --serve"
        ;;
esac
