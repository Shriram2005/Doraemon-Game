// Main initialization script
document.addEventListener('DOMContentLoaded', function() {
    // Wait for all dependencies to load
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }
    
    // Initialize the game
    try {
        window.game = new DoraemonGame();
        console.log('Doraemon 3D World initialized successfully');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        showErrorMessage('Failed to load the game. Please refresh the page.');
    }
    
    // Setup additional event listeners
    setupGlobalEventListeners();
    
    // Setup performance monitoring
    setupPerformanceMonitoring();
    
    // Setup responsive design handlers
    setupResponsiveHandlers();
});

function setupGlobalEventListeners() {
    // Fullscreen change events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // Visibility change (for pausing when tab is not active)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Error handling
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledPromiseRejection);
    
    // Resource loading errors
    window.addEventListener('error', handleResourceError, true);
}

function handleFullscreenChange() {
    const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    );
    
    if (window.game) {
        // Adjust renderer size after fullscreen change
        setTimeout(() => {
            window.game.onWindowResize();
        }, 100);
    }
}

function handleVisibilityChange() {
    if (window.game) {
        if (document.hidden) {
            // Pause game when tab is not visible
            if (!window.game.isPaused) {
                window.game.togglePause();
            }
        }
    }
}

function handleGlobalError(event) {
    console.error('Global error:', event.error);
    showErrorMessage('An error occurred. The game may not function properly.');
}

function handleUnhandledPromiseRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
}

function handleResourceError(event) {
    if (event.target !== window) {
        console.error('Resource loading error:', event.target.src || event.target.href);
    }
}

function setupPerformanceMonitoring() {
    // Simple FPS counter
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;
    
    function updateFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = currentTime;
            
            // Update FPS display if exists
            const fpsElement = document.getElementById('fps');
            if (fpsElement) {
                fpsElement.textContent = `FPS: ${fps}`;
            }
            
            // Warn if FPS is too low
            if (fps < 30 && window.game && window.game.isLoaded) {
                console.warn('Low FPS detected:', fps);
            }
        }
        
        requestAnimationFrame(updateFPS);
    }
    
    requestAnimationFrame(updateFPS);
}

function setupResponsiveHandlers() {
    // Handle device orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (window.game) {
                window.game.onWindowResize();
            }
        }, 500);
    });
    
    // Handle window resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.game) {
                window.game.onWindowResize();
            }
        }, 250);
    });
}

function showErrorMessage(message) {
    // Create error overlay
    const errorOverlay = document.createElement('div');
    errorOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    
    errorOverlay.innerHTML = `
        <h2>⚠️ Error</h2>
        <p>${message}</p>
        <button onclick="location.reload()" style="
            background: #0066cc;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
        ">Reload Page</button>
    `;
    
    document.body.appendChild(errorOverlay);
}

// Utility functions for game features
function createFPSCounter() {
    const fpsElement = document.createElement('div');
    fpsElement.id = 'fps';
    fpsElement.style.cssText = `
        position: absolute;
        top: 120px;
        right: 20px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 14px;
        z-index: 100;
    `;
    fpsElement.textContent = 'FPS: --';
    document.getElementById('gameContainer').appendChild(fpsElement);
}

// Initialize FPS counter
document.addEventListener('DOMContentLoaded', () => {
    createFPSCounter();
});

// Browser compatibility checks
function checkBrowserCompatibility() {
    const warnings = [];
    
    // Check WebGL support
    if (!window.WebGLRenderingContext) {
        warnings.push('WebGL is not supported');
    }
    
    // Check for required APIs
    if (!window.requestAnimationFrame) {
        warnings.push('RequestAnimationFrame not supported');
    }
    
    if (!document.pointerLockElement !== undefined) {
        warnings.push('Pointer Lock API not fully supported');
    }
    
    // Check for Web Audio API
    if (!window.AudioContext && !window.webkitAudioContext) {
        warnings.push('Web Audio API not supported - audio will be disabled');
    }
    
    if (warnings.length > 0) {
        console.warn('Browser compatibility issues:', warnings);
        
        // Show warning to user
        const warningMessage = 'Your browser may not fully support all features of this game:\n' + 
                              warnings.join('\n') + 
                              '\n\nFor the best experience, please use a modern browser like Chrome, Firefox, or Edge.';
        
        if (confirm(warningMessage + '\n\nDo you want to continue anyway?')) {
            return true;
        } else {
            showErrorMessage('Browser not supported. Please use a modern browser.');
            return false;
        }
    }
    
    return true;
}

// Run compatibility check
document.addEventListener('DOMContentLoaded', () => {
    if (!checkBrowserCompatibility()) {
        return;
    }
});

// Touch controls for mobile devices
function setupMobileControls() {
    if (!('ontouchstart' in window)) return;
    
    // Create virtual joystick for mobile
    const joystickContainer = document.createElement('div');
    joystickContainer.style.cssText = `
        position: fixed;
        bottom: 50px;
        left: 50px;
        width: 100px;
        height: 100px;
        background: rgba(255, 255, 255, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        z-index: 1000;
        display: none;
    `;
    
    const joystick = document.createElement('div');
    joystick.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
    `;
    
    joystickContainer.appendChild(joystick);
    document.body.appendChild(joystickContainer);
    
    // Create action buttons
    const actionButtons = document.createElement('div');
    actionButtons.style.cssText = `
        position: fixed;
        bottom: 50px;
        right: 50px;
        z-index: 1000;
        display: none;
    `;
    
    const jumpButton = document.createElement('button');
    jumpButton.textContent = 'Jump';
    jumpButton.style.cssText = `
        display: block;
        width: 60px;
        height: 60px;
        background: rgba(0, 102, 204, 0.8);
        color: white;
        border: none;
        border-radius: 50%;
        margin-bottom: 10px;
        font-size: 12px;
    `;
    
    const runButton = document.createElement('button');
    runButton.textContent = 'Run';
    runButton.style.cssText = `
        display: block;
        width: 60px;
        height: 60px;
        background: rgba(255, 102, 0, 0.8);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 12px;
    `;
    
    actionButtons.appendChild(jumpButton);
    actionButtons.appendChild(runButton);
    document.body.appendChild(actionButtons);
    
    // Show mobile controls on touch devices
    if ('ontouchstart' in window) {
        joystickContainer.style.display = 'block';
        actionButtons.style.display = 'block';
    }
    
    // Handle touch events for virtual joystick
    let isDragging = false;
    let centerX = 0;
    let centerY = 0;
    
    joystickContainer.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        const rect = joystickContainer.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - centerX;
        const deltaY = touch.clientY - centerY;
        const distance = Math.min(35, Math.sqrt(deltaX * deltaX + deltaY * deltaY));
        const angle = Math.atan2(deltaY, deltaX);
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        joystick.style.transform = `translate(${x - 15}px, ${y - 15}px)`;
        
        // Send movement commands to game
        if (window.game && window.game.controls) {
            const normalizedX = x / 35;
            const normalizedY = y / 35;
            
            // Simulate keyboard input
            if (Math.abs(normalizedY) > 0.3) {
                if (normalizedY < 0) {
                    window.game.controls.keys.forward = true;
                    window.game.controls.keys.backward = false;
                } else {
                    window.game.controls.keys.forward = false;
                    window.game.controls.keys.backward = true;
                }
            } else {
                window.game.controls.keys.forward = false;
                window.game.controls.keys.backward = false;
            }
            
            if (Math.abs(normalizedX) > 0.3) {
                if (normalizedX < 0) {
                    window.game.controls.keys.left = true;
                    window.game.controls.keys.right = false;
                } else {
                    window.game.controls.keys.left = false;
                    window.game.controls.keys.right = true;
                }
            } else {
                window.game.controls.keys.left = false;
                window.game.controls.keys.right = false;
            }
        }
    });
    
    document.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        isDragging = false;
        
        joystick.style.transform = 'translate(-50%, -50%)';
        
        // Reset movement
        if (window.game && window.game.controls) {
            window.game.controls.keys.forward = false;
            window.game.controls.keys.backward = false;
            window.game.controls.keys.left = false;
            window.game.controls.keys.right = false;
        }
    });
    
    // Handle action buttons
    jumpButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (window.game && window.game.controls) {
            window.game.controls.keys.jump = true;
        }
    });
    
    jumpButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (window.game && window.game.controls) {
            window.game.controls.keys.jump = false;
        }
    });
    
    runButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (window.game && window.game.controls) {
            window.game.controls.keys.run = true;
        }
    });
    
    runButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (window.game && window.game.controls) {
            window.game.controls.keys.run = false;
        }
    });
}

// Initialize mobile controls
document.addEventListener('DOMContentLoaded', () => {
    setupMobileControls();
});
