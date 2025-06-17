// Controls Class - Handles input and camera movement
class DoraemonControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.game = null;
        
        // Control states
        this.isEnabled = false;
        this.isFirstPerson = false;
        
        // Movement keys
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            run: false,
            jump: false
        };
        
        // Mouse control
        this.mouseX = 0;
        this.mouseY = 0;
        this.sensitivity = 0.002;
        this.isPointerLocked = false;
        
        // Camera settings
        this.minPolarAngle = 0; // radians
        this.maxPolarAngle = Math.PI; // radians
        this.rotateSpeed = 1.0;          // Third person camera settings - more horizontal view
        this.thirdPersonDistance = 12; // Good distance for visibility
        this.thirdPersonHeight = 3;    // Reduced height for more horizontal view
        this.thirdPersonAngle = 0.1;   // Much smaller angle for horizontal viewing
        this.cameraOffset = new THREE.Vector3(0, this.thirdPersonHeight, this.thirdPersonDistance);
          // First person camera settings
        this.firstPersonHeight = 2.5; // Adjusted for new character height
        
        this.setupEventListeners();
    }
    
    setGame(game) {
        this.game = game;
    }
    
    setupEventListeners() {
        // Pointer lock events
        document.addEventListener('click', () => this.requestPointerLock());
        document.addEventListener('pointerlockchange', () => this.onPointerLockChange());
        document.addEventListener('pointerlockerror', () => this.onPointerLockError());
        
        // Mouse movement
        document.addEventListener('mousemove', (event) => this.onMouseMove(event));
        
        // Keyboard events are handled by the game class
        // to avoid conflicts with other systems
        
        // Prevent context menu
        this.domElement.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
        
        // Touch events for mobile support
        this.setupTouchControls();
    }
    
    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.domElement.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1) {
                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;
            }
        });
        
        this.domElement.addEventListener('touchmove', (event) => {
            event.preventDefault();
            
            if (event.touches.length === 1) {
                const deltaX = event.touches[0].clientX - touchStartX;
                const deltaY = event.touches[0].clientY - touchStartY;
                
                this.mouseX += deltaX * this.sensitivity * 2;
                this.mouseY += deltaY * this.sensitivity * 2;
                
                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;
            }
        });
    }
    
    requestPointerLock() {
        if (this.isEnabled && !this.isPointerLocked) {
            this.domElement.requestPointerLock();
        }
    }
    
    onPointerLockChange() {
        if (document.pointerLockElement === this.domElement) {
            this.isPointerLocked = true;
        } else {
            this.isPointerLocked = false;
        }
    }
    
    onPointerLockError() {
        console.error('Pointer lock failed');
    }
    
    onMouseMove(event) {
        if (!this.isEnabled || !this.isPointerLocked) return;
        
        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        
        this.mouseX -= movementX * this.sensitivity;
        this.mouseY -= movementY * this.sensitivity;
        
        // Limit vertical rotation
        this.mouseY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.mouseY));
        
        if (this.isFirstPerson) {
            this.updateFirstPersonCamera();
        }
    }
      onKeyDown(event) {
        if (!this.isEnabled) return;
        
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.keys.forward = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.keys.backward = true;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = true;
                break;
            case 'Space':
                event.preventDefault();
                this.keys.jump = true;
                break;
            case 'ShiftLeft':
                this.keys.run = true;
                break;
        }
    }
    
    onKeyUp(event) {
        if (!this.isEnabled) return;
        
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.keys.forward = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.keys.backward = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = false;
                break;
            case 'Space':
                this.keys.jump = false;
                break;
            case 'ShiftLeft':
                this.keys.run = false;
                break;
        }
    }
    
    update(deltaTime) {
        if (!this.isEnabled || !this.game || !this.game.character) return;
        
        this.updateCharacterMovement(deltaTime);
        
        if (!this.isFirstPerson) {
            this.updateThirdPersonCamera(deltaTime);
        }
    }
    
    updateCharacterMovement(deltaTime) {
        const character = this.game.character;
        const moveVector = new THREE.Vector3();
        
        // Calculate movement direction
        if (this.keys.forward) moveVector.z -= 1;
        if (this.keys.backward) moveVector.z += 1;
        if (this.keys.left) moveVector.x -= 1;
        if (this.keys.right) moveVector.x += 1;
        
        // Normalize movement vector
        if (moveVector.length() > 0) {
            moveVector.normalize();
            
            // Apply camera rotation to movement direction
            if (this.isFirstPerson) {
                const cameraDirection = new THREE.Vector3();
                this.camera.getWorldDirection(cameraDirection);
                cameraDirection.y = 0; // Keep movement horizontal
                cameraDirection.normalize();
                
                const cameraRight = new THREE.Vector3();
                cameraRight.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));
                
                const finalDirection = new THREE.Vector3();
                finalDirection.addScaledVector(cameraDirection, -moveVector.z);
                finalDirection.addScaledVector(cameraRight, moveVector.x);
                finalDirection.normalize();
                
                character.move(finalDirection, this.keys.run);
            } else {
                // In third person, adjust movement relative to camera
                const cameraQuaternion = this.camera.quaternion.clone();
                moveVector.applyQuaternion(cameraQuaternion);
                moveVector.y = 0; // Keep movement horizontal
                moveVector.normalize();
                
                character.move(moveVector, this.keys.run);
            }
        } else {
            character.stop();
        }
        
        // Handle jumping
        if (this.keys.jump) {
            character.jump();
            this.keys.jump = false; // Prevent continuous jumping
        }
    }
    
    updateFirstPersonCamera() {
        if (!this.game || !this.game.character || !this.game.character.mesh) return;
        
        const character = this.game.character;
        const characterPos = character.mesh.position;
        
        // Position camera at character's eye level
        this.camera.position.copy(characterPos);
        this.camera.position.y += this.firstPersonHeight;
        
        // Apply mouse rotation
        const euler = new THREE.Euler(this.mouseY, this.mouseX, 0, 'YXZ');
        this.camera.quaternion.setFromEuler(euler);
        
        // Update character rotation to match camera Y rotation
        character.rotation.y = this.mouseX;
    }    updateThirdPersonCamera(deltaTime) {
        if (!this.game || !this.game.character || !this.game.character.mesh) return;
        
        const character = this.game.character;
        const characterPos = character.mesh.position;
        
        // Calculate ideal camera position with better angle
        const idealOffset = this.cameraOffset.clone();
        
        // Apply mouse rotation to offset (horizontal rotation)
        const rotationY = this.mouseX;
        const rotationMatrix = new THREE.Matrix4().makeRotationY(rotationY);
        idealOffset.applyMatrix4(rotationMatrix);
          // Add vertical mouse movement for pitch control (more limited range for horizontal view)
        const verticalAngle = Math.max(-0.3, Math.min(0.2, this.mouseY)); // Much more limited vertical range
        
        // Better camera positioning - more horizontal behind Doraemon
        const distance = this.thirdPersonDistance; // 12 for good visibility
        const height = this.thirdPersonHeight + Math.sin(verticalAngle) * 1.5; // Reduced height variation
        const backDistance = distance * Math.cos(verticalAngle);
        
        // Calculate final camera position
        const cameraDirection = new THREE.Vector3(0, 0, backDistance);
        cameraDirection.applyMatrix4(rotationMatrix);
        
        const idealPosition = characterPos.clone();
        idealPosition.add(cameraDirection);
        idealPosition.y += height;
        
        // Smooth camera movement
        this.camera.position.lerp(idealPosition, 10 * deltaTime);
          // Calculate look-at position (more horizontal view of surroundings)
        const lookAtPosition = characterPos.clone();
        lookAtPosition.y += 0.8; // Lower look-at point for more horizontal view
        
        // Smooth look-at transition
        this.camera.lookAt(lookAtPosition);
    }
    
    enableFirstPerson() {
        this.isFirstPerson = true;
        
        if (this.game && this.game.character && this.game.character.mesh) {
            // Hide character in first person
            this.game.character.mesh.visible = false;
        }
        
        this.requestPointerLock();
    }
    
    enableThirdPerson() {
        this.isFirstPerson = false;
        
        if (this.game && this.game.character && this.game.character.mesh) {
            // Show character in third person
            this.game.character.mesh.visible = true;
        }
    }
    
    enable() {
        this.isEnabled = true;
        this.domElement.style.cursor = 'none';
    }
    
    disable() {
        this.isEnabled = false;
        this.isPointerLocked = false;
        this.domElement.style.cursor = 'auto';
        
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
        
        // Reset all keys
        Object.keys(this.keys).forEach(key => {
            this.keys[key] = false;
        });
    }
    
    // Utility methods
    getDirection() {
        const direction = new THREE.Vector3();
        
        if (this.isFirstPerson) {
            this.camera.getWorldDirection(direction);
        } else {
            // For third person, calculate direction from camera to character
            if (this.game && this.game.character && this.game.character.mesh) {
                direction.subVectors(this.game.character.mesh.position, this.camera.position);
            }
        }
        
        direction.y = 0; // Keep horizontal
        direction.normalize();
        
        return direction;
    }
    
    isMoving() {
        return this.keys.forward || this.keys.backward || this.keys.left || this.keys.right;
    }
    
    dispose() {
        this.disable();
        
        // Remove event listeners
        document.removeEventListener('click', this.requestPointerLock);
        document.removeEventListener('pointerlockchange', this.onPointerLockChange);
        document.removeEventListener('pointerlockerror', this.onPointerLockError);
        document.removeEventListener('mousemove', this.onMouseMove);
    }
}
