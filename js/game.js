// Main Game Class
class DoraemonGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.character = null;
        this.environment = null;
        this.controls = null;
        this.audioManager = null;
        
        // Game state
        this.isFirstPerson = false;
        this.isDayMode = true;
        this.isPaused = false;
        this.isLoaded = false;
        
        // Performance settings
        this.clock = new THREE.Clock();
        this.deltaTime = 0;
        
        // Loading progress
        this.loadingManager = new THREE.LoadingManager();
        this.loadingProgress = 0;
        
        this.init();
    }
    
    init() {
        this.setupLoadingManager();
        this.setupScene();
        this.setupRenderer();
        this.setupCamera();
        this.setupLighting();
        this.setupControls();
        this.setupAudio();
        this.setupEnvironment();
        this.setupCharacter();
        this.setupEventListeners();
        this.startLoadingSequence();
    }
    
    setupLoadingManager() {
        this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
            console.log('Started loading file: ' + url + '. Loaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };
        
        this.loadingManager.onLoad = () => {
            console.log('Loading complete!');
            this.finishLoading();
        };
        
        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            this.loadingProgress = (itemsLoaded / itemsTotal) * 100;
            this.updateLoadingProgress(this.loadingProgress);
        };
        
        this.loadingManager.onError = (url) => {
            console.log('There was an error loading ' + url);
        };
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 500);
        
        // Add background
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            'assets/skybox/posx.jpg', 'assets/skybox/negx.jpg',
            'assets/skybox/posy.jpg', 'assets/skybox/negy.jpg',
            'assets/skybox/posz.jpg', 'assets/skybox/negz.jpg'
        ]);
        
        // Fallback gradient background
        this.scene.background = new THREE.Color(0x87CEEB);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        document.getElementById('gameContainer').appendChild(this.renderer.domElement);
    }
      setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000        );
        // More horizontal initial camera position for better surroundings view
        this.camera.position.set(0, 4, 12);
        this.camera.lookAt(0, 1, 0);
    }
    
    setupLighting() {
        // Ambient light
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(this.ambientLight);
        
        // Directional light (sun)
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.directionalLight.position.set(50, 100, 50);
        this.directionalLight.castShadow = true;
        
        // Shadow settings
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 500;
        this.directionalLight.shadow.camera.left = -100;
        this.directionalLight.shadow.camera.right = 100;
        this.directionalLight.shadow.camera.top = 100;
        this.directionalLight.shadow.camera.bottom = -100;
        
        this.scene.add(this.directionalLight);
        
        // Point lights for indoor lighting
        this.pointLight1 = new THREE.PointLight(0xffffff, 0.8, 50);
        this.pointLight1.position.set(0, 10, 0);
        this.pointLight1.castShadow = true;
        this.scene.add(this.pointLight1);
        
        // Hemisphere light for natural outdoor lighting
        this.hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x98FB98, 0.4);
        this.scene.add(this.hemisphereLight);
    }
    
    setupControls() {
        this.controls = new DoraemonControls(this.camera, this.renderer.domElement);
        this.controls.setGame(this);
    }
    
    setupAudio() {
        this.audioManager = new AudioManager();
    }
    
    setupEnvironment() {
        this.environment = new Environment(this.scene, this.loadingManager);
    }
    
    setupCharacter() {
        this.character = new DoraemonCharacter(this.scene, this.loadingManager);
        this.character.setGame(this);
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // View toggle
        document.getElementById('viewToggle').addEventListener('click', () => this.toggleView());
        
        // Day/Night toggle
        document.getElementById('dayNightToggle').addEventListener('click', () => this.toggleDayNight());
        
        // Keyboard events
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
        
        // Pause menu
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Escape' || event.code === 'Tab') {
                event.preventDefault();
                this.togglePause();
            }
        });
    }
    
    startLoadingSequence() {
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => this.finishLoading(), 500);
            }
            this.updateLoadingProgress(progress);
        }, 200);
    }
    
    updateLoadingProgress(progress) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        progressBar.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
    }
    
    finishLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('hidden');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            this.isLoaded = true;
            this.startGame();
        }, 500);
    }
    
    startGame() {
        this.controls.enable();
        this.audioManager.playBackgroundMusic();
        this.animate();
    }
    
    animate() {
        if (!this.isLoaded) return;
        
        requestAnimationFrame(() => this.animate());
        
        if (this.isPaused) return;
        
        this.deltaTime = this.clock.getDelta();
        
        // Update game components
        if (this.character) {
            this.character.update(this.deltaTime);
        }
        
        if (this.controls) {
            this.controls.update(this.deltaTime);
        }
        
        if (this.environment) {
            this.environment.update(this.deltaTime);
        }
        
        // Update camera position for third person view
        if (!this.isFirstPerson && this.character) {
            this.updateThirdPersonCamera();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
      updateThirdPersonCamera() {
        if (!this.character || !this.character.mesh) return;
        
        const characterPos = this.character.mesh.position;
        const characterRot = this.character.mesh.rotation;
        
        // Calculate camera position behind and above character
        const offset = new THREE.Vector3(0, 4, 6);
        
        // Apply character rotation to offset so camera follows character's facing direction
        const rotationMatrix = new THREE.Matrix4().makeRotationY(characterRot.y);
        offset.applyMatrix4(rotationMatrix);
        
        const targetPos = characterPos.clone().add(offset);
        
        // Smooth camera movement
        this.camera.position.lerp(targetPos, 0.1);
        
        // Look at character's center (torso area)
        const lookAtPos = characterPos.clone();
        lookAtPos.y += 1.0;
        this.camera.lookAt(lookAtPos);
    }
    
    toggleView() {
        this.isFirstPerson = !this.isFirstPerson;
        const button = document.getElementById('viewToggle');
        
        if (this.isFirstPerson) {
            button.textContent = '👁️ 1st Person';
            this.controls.enableFirstPerson();
        } else {
            button.textContent = '📷 3rd Person';
            this.controls.enableThirdPerson();
        }
    }
    
    toggleDayNight() {
        this.isDayMode = !this.isDayMode;
        const button = document.getElementById('dayNightToggle');
        
        if (this.isDayMode) {
            button.textContent = '🌙 Night Mode';
            this.setDayLighting();
        } else {
            button.textContent = '☀️ Day Mode';
            this.setNightLighting();
        }
    }
    
    setDayLighting() {
        this.directionalLight.intensity = 1.0;
        this.directionalLight.color.setHex(0xffffff);
        this.ambientLight.intensity = 0.6;
        this.scene.fog.color.setHex(0x87CEEB);
        this.scene.background.setHex(0x87CEEB);
        this.hemisphereLight.intensity = 0.4;
    }
    
    setNightLighting() {
        this.directionalLight.intensity = 0.2;
        this.directionalLight.color.setHex(0x4169E1);
        this.ambientLight.intensity = 0.3;
        this.scene.fog.color.setHex(0x191970);
        this.scene.background.setHex(0x191970);
        this.hemisphereLight.intensity = 0.1;
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseMenu = document.getElementById('pauseMenu');
        
        if (this.isPaused) {
            pauseMenu.style.display = 'flex';
            this.controls.disable();
        } else {
            pauseMenu.style.display = 'none';
            this.controls.enable();
        }
    }
    
    onKeyDown(event) {
        if (this.controls) {
            this.controls.onKeyDown(event);
        }
        
        // View toggle with V key
        if (event.code === 'KeyV') {
            this.toggleView();
        }
        
        // Day/Night toggle with N key
        if (event.code === 'KeyN') {
            this.toggleDayNight();
        }
    }
    
    onKeyUp(event) {
        if (this.controls) {
            this.controls.onKeyUp(event);
        }
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Public methods for pause menu
    resume() {
        this.isPaused = false;
        document.getElementById('pauseMenu').style.display = 'none';
        this.controls.enable();
    }
    
    restart() {
        location.reload();
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}

// Global functions for pause menu
function resumeGame() {
    window.game.resume();
}

function restartGame() {
    window.game.restart();
}

function toggleFullscreen() {
    window.game.toggleFullscreen();
}
