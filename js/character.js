// Doraemon Character Class
class DoraemonCharacter {
    constructor(scene, loadingManager) {
        this.scene = scene;
        this.loadingManager = loadingManager;
        this.game = null;
        
        // Character properties
        this.mesh = null;
        this.mixer = null;
        this.animations = {};
        this.currentAnimation = null;
        
        // Movement properties
        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Euler(0, 0, 0);
        
        // Physics properties
        this.isGrounded = true;
        this.jumpVelocity = 0;
        this.gravity = -30;
        this.groundY = 0;
        
        // Movement settings
        this.walkSpeed = 5;
        this.runSpeed = 10;
        this.jumpHeight = 8;
        this.rotationSpeed = 5;
        
        // Animation states
        this.isWalking = false;
        this.isRunning = false;
        this.isJumping = false;
        this.isIdle = true;
        
        this.createCharacter();
    }
      setGame(game) {
        this.game = game;
    }
    
    createCharacter() {
        // Create character mesh
        this.mesh = new THREE.Group();
        
        // Body (main blue rounded body - more anime accurate)
        const bodyGeometry = new THREE.SphereGeometry(1.0, 16, 12);
        bodyGeometry.scale(1, 1.4, 1); // Make it slightly taller like anime
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x0072CE,  // More accurate Doraemon blue
            shininess: 80,
            specular: 0x004499
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0, 0.7, 0);
        body.castShadow = true;
        body.receiveShadow = true;
        this.mesh.add(body);        
        // White belly/chest area (iconic feature)
        const bellyGeometry = new THREE.SphereGeometry(0.85, 32, 32);
        const bellyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            shininess: 60
        });
        const belly = new THREE.Mesh(bellyGeometry, bellyMaterial);
        belly.scale.set(1, 1.4, 0.35);
        belly.position.set(0, 0.7, 0.75);
        this.mesh.add(belly);
        
        // 4D Pocket (black semi-circle)
        const pocketGeometry = new THREE.CircleGeometry(0.4, 32);
        const pocketMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const pocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
        pocket.position.set(0, 0.25, 0.9);
        this.mesh.add(pocket);
        
        // Head (larger and perfectly round like anime)
        const headGeometry = new THREE.SphereGeometry(1.0, 32, 32);
        const headMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x0072CE,
            shininess: 80,
            specular: 0x004499
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 2.3, 0);
        head.castShadow = true;
        this.mesh.add(head);
        
        // Face (white oval covering most of head)
        const faceGeometry = new THREE.SphereGeometry(0.95, 32, 32);
        const faceMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            shininess: 60
        });
        const face = new THREE.Mesh(faceGeometry, faceMaterial);
        face.scale.set(0.85, 1, 0.75);
        face.position.set(0, 2.25, 0.35);
        this.mesh.add(face);        // Eyes (larger and more anime-like with proper positioning)
        const eyeGeometry = new THREE.SphereGeometry(0.22, 20, 20);
        const eyeMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x000000,
            shininess: 100
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.3, 2.4, 0.8);
        leftEye.scale.set(1, 1.3, 0.9);
        this.mesh.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.3, 2.4, 0.8);
        rightEye.scale.set(1, 1.3, 0.9);
        this.mesh.add(rightEye);
        
        // Eye highlights (white dots for anime sparkle)
        const highlightGeometry = new THREE.SphereGeometry(0.06, 12, 12);
        const highlightMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            emissive: 0x222222
        });
        
        const leftHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
        leftHighlight.position.set(-0.25, 2.45, 0.85);
        this.mesh.add(leftHighlight);
        
        const rightHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
        rightHighlight.position.set(0.35, 2.45, 0.85);
        this.mesh.add(rightHighlight);
        
        // Nose (red sphere - more prominent and shiny)
        const noseGeometry = new THREE.SphereGeometry(0.12, 20, 20);
        const noseMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff0000,
            shininess: 120,
            specular: 0xffffff
        });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, 2.15, 0.9);
        this.mesh.add(nose);
          // Mouth (curved smile - more detailed and wider)
        const mouthCurve = new THREE.EllipseCurve(0, 0, 0.35, 0.15, 0, Math.PI, false, 0);
        const mouthPoints = mouthCurve.getPoints(30);
        const mouthGeometry = new THREE.BufferGeometry().setFromPoints(mouthPoints);
        const mouthMaterial = new THREE.LineBasicMaterial({ 
            color: 0x000000, 
            linewidth: 6
        });
        const mouth = new THREE.Line(mouthGeometry, mouthMaterial);
        mouth.position.set(0, 1.9, 0.85);
        mouth.rotation.x = Math.PI;
        this.mesh.add(mouth);
        
        // Add small mouth corners for extra smile detail
        const cornerGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const cornerMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        
        const leftCorner = new THREE.Mesh(cornerGeometry, cornerMaterial);
        leftCorner.position.set(-0.3, 1.95, 0.85);
        this.mesh.add(leftCorner);
        
        const rightCorner = new THREE.Mesh(cornerGeometry, cornerMaterial);
        rightCorner.position.set(0.3, 1.95, 0.85);
        this.mesh.add(rightCorner);// Whiskers (6 black lines - more detailed and realistic)
        const whiskerGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.9);
        const whiskerMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x000000,
            shininess: 20
        });
        
        // Left whiskers
        for (let i = 0; i < 3; i++) {
            const whisker = new THREE.Mesh(whiskerGeometry, whiskerMaterial);
            const height = (i - 1) * 0.18;
            whisker.position.set(-0.7, 2.15 + height, 0.7);
            whisker.rotation.z = Math.PI / 2;
            whisker.rotation.y = -0.15;
            this.mesh.add(whisker);
        }
        
        // Right whiskers
        for (let i = 0; i < 3; i++) {
            const whisker = new THREE.Mesh(whiskerGeometry, whiskerMaterial);
            const height = (i - 1) * 0.18;
            whisker.position.set(0.7, 2.15 + height, 0.7);
            whisker.rotation.z = Math.PI / 2;
            whisker.rotation.y = 0.15;
            this.mesh.add(whisker);
        }
        
        // Collar (red band around neck - more detailed)
        const collarGeometry = new THREE.TorusGeometry(1.1, 0.1, 10, 40);
        const collarMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff0000,
            shininess: 80
        });
        const collar = new THREE.Mesh(collarGeometry, collarMaterial);
        collar.position.set(0, 1.5, 0);
        this.mesh.add(collar);
        
        // Bell (golden with shine and details)
        const bellGeometry = new THREE.SphereGeometry(0.18, 20, 20);
        const bellMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffd700,
            shininess: 150,
            specular: 0xffffff,
            emissive: 0x221100
        });
        const bell = new THREE.Mesh(bellGeometry, bellMaterial);
        bell.position.set(0, 1.5, 1.0);
        this.mesh.add(bell);
        
        // Bell details (small line and cross)
        const bellLineGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.12);
        const bellLineMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        const bellLine = new THREE.Mesh(bellLineGeometry, bellLineMaterial);
        bellLine.position.set(0, 1.56, 1.0);
        this.mesh.add(bellLine);
        
        // Bell cross detail
        const bellCrossGeometry = new THREE.BoxGeometry(0.06, 0.02, 0.02);
        const bellCross1 = new THREE.Mesh(bellCrossGeometry, bellLineMaterial);
        bellCross1.position.set(0, 1.5, 1.05);
        this.mesh.add(bellCross1);
        
        const bellCross2 = new THREE.Mesh(bellCrossGeometry, bellLineMaterial);
        bellCross2.position.set(0, 1.5, 1.05);
        bellCross2.rotation.z = Math.PI / 2;
        this.mesh.add(bellCross2);        // Arms (more rounded and anime-like with better proportions)
        const armGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.9, 12);
        const armMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x0072CE,
            shininess: 80
        });
          const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-1.0, 0.9, 0);
        leftArm.rotation.z = 0.2; // Less angled for better alignment
        leftArm.castShadow = true;
        this.mesh.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(1.0, 0.9, 0);
        rightArm.rotation.z = -0.2; // Less angled for better alignment
        rightArm.castShadow = true;
        this.mesh.add(rightArm);
        
        // Hands (white spheres, properly aligned with arms)
        const handGeometry = new THREE.SphereGeometry(0.25, 20, 20);
        const handMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            shininess: 60
        });
        
        const leftHand = new THREE.Mesh(handGeometry, handMaterial);
        leftHand.position.set(-1.4, 0.4, 0); // Better aligned with left arm
        leftHand.castShadow = true;
        this.mesh.add(leftHand);
        
        const rightHand = new THREE.Mesh(handGeometry, handMaterial);
        rightHand.position.set(1.4, 0.4, 0); // Better aligned with right arm
        rightHand.castShadow = true;
        this.mesh.add(rightHand);
          // Legs (shorter and stubbier like anime)
        const legGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.7, 12);
        const legMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x0072CE,
            shininess: 80
        });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.4, -0.4, 0);
        leftLeg.castShadow = true;
        this.mesh.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.4, -0.4, 0);
        rightLeg.castShadow = true;
        this.mesh.add(rightLeg);
        
        // Feet (larger white oval feet - more anime accurate)
        const footGeometry = new THREE.SphereGeometry(0.4, 20, 20);
        const footMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            shininess: 60
        });
        
        const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
        leftFoot.scale.set(1.4, 0.5, 1.9);
        leftFoot.position.set(-0.4, -0.9, 0.15);
        leftFoot.castShadow = true;
        this.mesh.add(leftFoot);
        
        const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
        rightFoot.scale.set(1.4, 0.5, 1.9);
        rightFoot.position.set(0.4, -0.9, 0.15);
        rightFoot.castShadow = true;
        this.mesh.add(rightFoot);
        // Position character
        this.mesh.position.copy(this.position);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
          // Store references for animation
        this.bodyParts = {
            body: body,
            head: head,
            leftArm: leftArm,
            rightArm: rightArm,
            leftLeg: leftLeg,
            rightLeg: rightLeg,
            leftHand: leftHand,
            rightHand: rightHand,
            leftFoot: leftFoot,
            rightFoot: rightFoot,
            bell: bell,
            face: face,
            belly: belly,
            nose: nose,
            collar: collar
        };
        
        this.scene.add(this.mesh);
        this.setupAnimations();
    }
    
    createDoraemonGeometry() {
        // This method can be expanded for more complex geometry
        return new THREE.SphereGeometry(1, 32, 32);
    }
    
    createDoraemonMaterials() {
        return {
            body: new THREE.MeshLambertMaterial({ color: 0x0066cc }),
            face: new THREE.MeshLambertMaterial({ color: 0xffffff }),
            pocket: new THREE.MeshLambertMaterial({ color: 0x000000 })
        };
    }
    
    setupAnimations() {
        // Simple animation system using manual keyframes
        this.animations = {
            idle: this.createIdleAnimation(),
            walk: this.createWalkAnimation(),
            run: this.createRunAnimation(),
            jump: this.createJumpAnimation()
        };
        
        this.currentAnimation = 'idle';
        this.animationTime = 0;
    }    createIdleAnimation() {
        return {
            duration: 3,
            loop: true,
            keyframes: {
                body: [
                    { time: 0, position: { y: 0.7 }, rotation: { y: 0 } },
                    { time: 1.5, position: { y: 0.75 }, rotation: { y: 0.05 } },
                    { time: 3, position: { y: 0.7 }, rotation: { y: 0 } }
                ],
                head: [
                    { time: 0, rotation: { x: 0, y: 0 } },
                    { time: 1, rotation: { x: 0.02, y: 0.1 } },
                    { time: 2, rotation: { x: 0.02, y: -0.1 } },
                    { time: 3, rotation: { x: 0, y: 0 } }
                ],
                bell: [
                    { time: 0, rotation: { x: 0 } },
                    { time: 1.5, rotation: { x: 0.05 } },
                    { time: 3, rotation: { x: 0 } }
                ],
                leftArm: [
                    { time: 0, rotation: { x: 0, z: 0.35 } },
                    { time: 1.5, rotation: { x: 0.1, z: 0.4 } },
                    { time: 3, rotation: { x: 0, z: 0.35 } }
                ],
                rightArm: [
                    { time: 0, rotation: { x: 0, z: -0.35 } },
                    { time: 1.5, rotation: { x: 0.1, z: -0.4 } },
                    { time: 3, rotation: { x: 0, z: -0.35 } }                ]
            }
        };
    }
    
    createWalkAnimation() {
        return {
            duration: 1,
            loop: true,
            keyframes: {
                leftArm: [
                    { time: 0, rotation: { x: 0.4, z: 0.35 } },
                    { time: 0.5, rotation: { x: -0.4, z: 0.35 } },
                    { time: 1, rotation: { x: 0.4, z: 0.35 } }
                ],
                rightArm: [
                    { time: 0, rotation: { x: -0.4, z: -0.35 } },
                    { time: 0.5, rotation: { x: 0.4, z: -0.35 } },
                    { time: 1, rotation: { x: -0.4, z: -0.35 } }
                ],
                leftLeg: [
                    { time: 0, rotation: { x: 0.3 } },
                    { time: 0.5, rotation: { x: -0.3 } },
                    { time: 1, rotation: { x: 0.3 } }
                ],
                rightLeg: [
                    { time: 0, rotation: { x: -0.3 } },
                    { time: 0.5, rotation: { x: 0.3 } },
                    { time: 1, rotation: { x: -0.3 } }
                ],
                body: [
                    { time: 0, position: { y: 0.7 } },
                    { time: 0.25, position: { y: 0.75 } },
                    { time: 0.5, position: { y: 0.7 } },
                    { time: 0.75, position: { y: 0.75 } },
                    { time: 1, position: { y: 0.7 } }
                ]
            }
        };
    }
      createRunAnimation() {
        return {
            duration: 0.6,
            loop: true,
            keyframes: {
                leftArm: [
                    { time: 0, rotation: { x: 0.8, z: 0.3 } },
                    { time: 0.3, rotation: { x: -0.8, z: 0.3 } },
                    { time: 0.6, rotation: { x: 0.8, z: 0.3 } }
                ],
                rightArm: [
                    { time: 0, rotation: { x: -0.8, z: -0.3 } },
                    { time: 0.3, rotation: { x: 0.8, z: -0.3 } },
                    { time: 0.6, rotation: { x: -0.8, z: -0.3 } }
                ],
                leftLeg: [
                    { time: 0, rotation: { x: 0.6 } },
                    { time: 0.3, rotation: { x: -0.6 } },
                    { time: 0.6, rotation: { x: 0.6 } }
                ],
                rightLeg: [
                    { time: 0, rotation: { x: -0.6 } },
                    { time: 0.3, rotation: { x: 0.6 } },
                    { time: 0.6, rotation: { x: -0.6 } }
                ],
                body: [
                    { time: 0, position: { y: 0.6 }, rotation: { z: 0.1 } },
                    { time: 0.15, position: { y: 0.8 }, rotation: { z: 0 } },
                    { time: 0.3, position: { y: 0.6 }, rotation: { z: -0.1 } },
                    { time: 0.45, position: { y: 0.8 }, rotation: { z: 0 } },
                    { time: 0.6, position: { y: 0.6 }, rotation: { z: 0.1 } }
                ],
                bell: [
                    { time: 0, rotation: { x: 0.1 } },
                    { time: 0.3, rotation: { x: -0.1 } },
                    { time: 0.6, rotation: { x: 0.1 } }
                ]
            }
        };
    }
      createJumpAnimation() {
        return {
            duration: 0.8,
            loop: false,
            keyframes: {
                body: [
                    { time: 0, position: { y: 0.6 }, rotation: { x: 0 } },
                    { time: 0.2, position: { y: 0.8 }, rotation: { x: -0.2 } },
                    { time: 0.4, position: { y: 1.2 }, rotation: { x: 0 } },
                    { time: 0.6, position: { y: 0.8 }, rotation: { x: 0.1 } },
                    { time: 0.8, position: { y: 0.6 }, rotation: { x: 0 } }
                ],
                leftArm: [
                    { time: 0, rotation: { x: 0, z: 0.3 } },
                    { time: 0.2, rotation: { x: -1.2, z: 0.8 } },
                    { time: 0.8, rotation: { x: 0, z: 0.3 } }
                ],
                rightArm: [
                    { time: 0, rotation: { x: 0, z: -0.3 } },
                    { time: 0.2, rotation: { x: -1.2, z: -0.8 } },
                    { time: 0.8, rotation: { x: 0, z: -0.3 } }
                ],
                leftLeg: [
                    { time: 0, rotation: { x: 0 } },
                    { time: 0.2, rotation: { x: -0.5 } },
                    { time: 0.4, rotation: { x: -0.8 } },
                    { time: 0.8, rotation: { x: 0 } }
                ],
                rightLeg: [
                    { time: 0, rotation: { x: 0 } },
                    { time: 0.2, rotation: { x: -0.5 } },
                    { time: 0.4, rotation: { x: -0.8 } },
                    { time: 0.8, rotation: { x: 0 } }
                ],
                bell: [
                    { time: 0, rotation: { x: 0 } },
                    { time: 0.2, rotation: { x: -0.3 } },
                    { time: 0.4, rotation: { x: 0.2 } },
                    { time: 0.8, rotation: { x: 0 } }
                ]
            }
        };
    }
    
    update(deltaTime) {
        this.updatePhysics(deltaTime);
        this.updateAnimation(deltaTime);
        this.updateMesh();
    }
    
    updatePhysics(deltaTime) {
        // Apply gravity
        if (!this.isGrounded) {
            this.velocity.y += this.gravity * deltaTime;
        }
        
        // Update position
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        
        // Ground collision
        if (this.position.y <= this.groundY) {
            this.position.y = this.groundY;
            this.velocity.y = 0;
            this.isGrounded = true;
            this.isJumping = false;
        }
    }
    
    updateAnimation(deltaTime) {
        if (!this.animations[this.currentAnimation]) return;
        
        this.animationTime += deltaTime;
        const animation = this.animations[this.currentAnimation];
        
        if (this.animationTime >= animation.duration) {
            if (animation.loop) {
                this.animationTime = 0;
            } else {
                this.animationTime = animation.duration;
                if (this.currentAnimation === 'jump') {
                    this.setAnimation('idle');
                }
            }
        }
        
        this.applyAnimation(animation, this.animationTime);
    }
    
    applyAnimation(animation, time) {
        const progress = time / animation.duration;
        
        Object.keys(animation.keyframes).forEach(partName => {
            const part = this.bodyParts[partName];
            if (!part) return;
            
            const keyframes = animation.keyframes[partName];
            
            // Find current keyframe
            let currentFrame = null;
            let nextFrame = null;
            
            for (let i = 0; i < keyframes.length - 1; i++) {
                if (time >= keyframes[i].time && time <= keyframes[i + 1].time) {
                    currentFrame = keyframes[i];
                    nextFrame = keyframes[i + 1];
                    break;
                }
            }
            
            if (currentFrame && nextFrame) {
                const frameProgress = (time - currentFrame.time) / (nextFrame.time - currentFrame.time);
                
                // Interpolate position
                if (currentFrame.position && nextFrame.position) {
                    Object.keys(currentFrame.position).forEach(axis => {
                        const start = currentFrame.position[axis] || 0;
                        const end = nextFrame.position[axis] || 0;
                        part.position[axis] = start + (end - start) * frameProgress;
                    });
                }
                
                // Interpolate rotation
                if (currentFrame.rotation && nextFrame.rotation) {
                    Object.keys(currentFrame.rotation).forEach(axis => {
                        const start = currentFrame.rotation[axis] || 0;
                        const end = nextFrame.rotation[axis] || 0;
                        part.rotation[axis] = start + (end - start) * frameProgress;
                    });
                }
            }
        });
    }
    
    updateMesh() {
        if (this.mesh) {
            this.mesh.position.copy(this.position);
            this.mesh.rotation.copy(this.rotation);
        }
    }
    
    // Movement methods
    move(direction, isRunning = false) {
        const speed = isRunning ? this.runSpeed : this.walkSpeed;
        const movement = direction.multiplyScalar(speed);
        
        this.velocity.x = movement.x;
        this.velocity.z = movement.z;
        
        // Set animation
        if (movement.length() > 0) {
            this.setAnimation(isRunning ? 'run' : 'walk');
            this.isWalking = !isRunning;
            this.isRunning = isRunning;
            this.isIdle = false;
            
            // Rotate character to face movement direction
            const angle = Math.atan2(movement.x, movement.z);
            this.rotation.y = angle;
        } else {
            this.stop();
        }
    }
    
    stop() {
        this.velocity.x = 0;
        this.velocity.z = 0;
        this.isWalking = false;
        this.isRunning = false;
        this.isIdle = true;
        
        if (!this.isJumping) {
            this.setAnimation('idle');
        }
    }
    
    jump() {
        if (this.isGrounded) {
            this.velocity.y = this.jumpHeight;
            this.isGrounded = false;
            this.isJumping = true;
            this.setAnimation('jump');
        }
    }
    
    setAnimation(animationName) {
        if (this.currentAnimation !== animationName && this.animations[animationName]) {
            this.currentAnimation = animationName;
            this.animationTime = 0;
        }
    }
    
    getPosition() {
        return this.position.clone();
    }
    
    getRotation() {
        return this.rotation.clone();
    }
}
