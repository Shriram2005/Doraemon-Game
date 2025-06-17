// Environment Class - Creates Nobita's House and surroundings
class Environment {
    constructor(scene, loadingManager) {
        this.scene = scene;
        this.loadingManager = loadingManager;
        this.objects = [];
        this.interactiveObjects = [];
        
        this.createEnvironment();
    }
    
    createEnvironment() {
        this.createGround();
        this.createHouse();
        this.createGarden();
        this.createFurniture();
        this.createDecorations();
        this.createTrees();
        this.createSky();
    }
    
    createGround() {
        // Main ground
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundTexture = this.createGrassTexture();
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            map: groundTexture,
            color: 0x90EE90
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // House floor
        const houseFloorGeometry = new THREE.PlaneGeometry(20, 15);
        const floorTexture = this.createWoodTexture();
        const houseFloorMaterial = new THREE.MeshLambertMaterial({ 
            map: floorTexture,
            color: 0xDEB887
        });
        
        const houseFloor = new THREE.Mesh(houseFloorGeometry, houseFloorMaterial);
        houseFloor.rotation.x = -Math.PI / 2;
        houseFloor.position.set(0, 0.01, -5);
        houseFloor.receiveShadow = true;
        this.scene.add(houseFloor);
    }
    
    createGrassTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        // Create grass pattern
        context.fillStyle = '#90EE90';
        context.fillRect(0, 0, 256, 256);
        
        // Add grass details
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const shade = Math.random() * 0.3 + 0.7;
            context.fillStyle = `rgba(0, 128, 0, ${shade})`;
            context.fillRect(x, y, 2, 4);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        
        return texture;
    }
    
    createWoodTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        // Create wood pattern
        context.fillStyle = '#DEB887';
        context.fillRect(0, 0, 256, 256);
        
        // Add wood grain
        for (let i = 0; i < 50; i++) {
            context.strokeStyle = `rgba(139, 69, 19, ${Math.random() * 0.3 + 0.1})`;
            context.lineWidth = Math.random() * 3 + 1;
            context.beginPath();
            context.moveTo(0, Math.random() * 256);
            context.lineTo(256, Math.random() * 256);
            context.stroke();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        
        return texture;
    }
    
    createHouse() {
        const houseGroup = new THREE.Group();
        
        // Main house structure
        const wallGeometry = new THREE.BoxGeometry(20, 8, 15);
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xF5DEB3 });
        const walls = new THREE.Mesh(wallGeometry, wallMaterial);
        walls.position.set(0, 4, -5);
        walls.castShadow = true;
        walls.receiveShadow = true;
        houseGroup.add(walls);
        
        // Roof
        const roofGeometry = new THREE.ConeGeometry(14, 6, 4);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(0, 11, -5);
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        houseGroup.add(roof);
        
        // Windows
        this.createWindows(houseGroup);
        
        // Doors
        this.createDoors(houseGroup);
        
        // Interior walls (simplified room divisions)
        this.createInteriorWalls(houseGroup);
        
        this.scene.add(houseGroup);
        this.objects.push(houseGroup);
    }
    
    createWindows(houseGroup) {
        const windowGeometry = new THREE.PlaneGeometry(2, 2);
        const windowMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.7
        });
        
        // Front windows
        for (let i = 0; i < 3; i++) {
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(-6 + i * 6, 5, 2.51);
            houseGroup.add(window);
            
            // Window frame
            const frameGeometry = new THREE.RingGeometry(0.8, 1, 16);
            const frameMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(-6 + i * 6, 5, 2.52);
            houseGroup.add(frame);
        }
        
        // Side windows
        for (let i = 0; i < 2; i++) {
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(10.01, 5, -8 + i * 8);
            window.rotation.y = Math.PI / 2;
            houseGroup.add(window);
        }
    }
    
    createDoors(houseGroup) {
        // Main entrance door
        const doorGeometry = new THREE.BoxGeometry(1.5, 4, 0.2);
        const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 2, 2.6);
        door.castShadow = true;
        houseGroup.add(door);
        
        // Door handle
        const handleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const handleMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(0.6, 2, 2.7);
        houseGroup.add(handle);
        
        // Sliding door to garden
        const slidingDoorGeometry = new THREE.PlaneGeometry(3, 6);
        const slidingDoorMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xF0F0F0,
            transparent: true,
            opacity: 0.8
        });
        const slidingDoor = new THREE.Mesh(slidingDoorGeometry, slidingDoorMaterial);
        slidingDoor.position.set(-8, 3, -12.51);
        slidingDoor.rotation.y = Math.PI;
        houseGroup.add(slidingDoor);
        
        this.interactiveObjects.push({
            mesh: slidingDoor,
            type: 'door',
            action: 'slide'
        });
    }
    
    createInteriorWalls(houseGroup) {
        // Living room divider
        const dividerGeometry = new THREE.BoxGeometry(0.2, 8, 8);
        const dividerMaterial = new THREE.MeshLambertMaterial({ color: 0xF5DEB3 });
        
        const divider1 = new THREE.Mesh(dividerGeometry, dividerMaterial);
        divider1.position.set(6, 4, -8);
        houseGroup.add(divider1);
        
        const divider2 = new THREE.Mesh(dividerGeometry, dividerMaterial);
        divider2.position.set(-6, 4, -8);
        houseGroup.add(divider2);
    }
    
    createGarden() {
        // Garden area
        const gardenGroup = new THREE.Group();
        
        // Garden border
        const borderGeometry = new THREE.BoxGeometry(0.3, 0.5, 15);
        const borderMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        
        for (let i = 0; i < 4; i++) {
            const border = new THREE.Mesh(borderGeometry, borderMaterial);
            const angle = (i * Math.PI) / 2;
            border.position.set(
                Math.sin(angle) * 12,
                0.25,
                -5 + Math.cos(angle) * 12
            );
            border.rotation.y = angle;
            gardenGroup.add(border);
        }
        
        // Flower beds
        this.createFlowerBeds(gardenGroup);
        
        // Garden path
        this.createGardenPath(gardenGroup);
        
        this.scene.add(gardenGroup);
    }
    
    createFlowerBeds(gardenGroup) {
        // Flower bed geometry
        const bedGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 8);
        const bedMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        
        const flowerPositions = [
            { x: -15, z: -5 },
            { x: 15, z: -5 },
            { x: -15, z: -15 },
            { x: 15, z: -15 }
        ];
        
        flowerPositions.forEach(pos => {
            const bed = new THREE.Mesh(bedGeometry, bedMaterial);
            bed.position.set(pos.x, 0.15, pos.z);
            gardenGroup.add(bed);
            
            // Add flowers
            for (let i = 0; i < 8; i++) {
                const flower = this.createFlower();
                flower.position.set(
                    pos.x + (Math.random() - 0.5) * 2.5,
                    0.5,
                    pos.z + (Math.random() - 0.5) * 2.5
                );
                gardenGroup.add(flower);
            }
        });
    }
    
    createFlower() {
        const flowerGroup = new THREE.Group();
        
        // Stem
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
        const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.4;
        flowerGroup.add(stem);
        
        // Petals
        const petalGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const colors = [0xFF69B4, 0xFF1493, 0xFFB6C1, 0xFF69B4, 0xDDA0DD];
        const petalMaterial = new THREE.MeshLambertMaterial({ 
            color: colors[Math.floor(Math.random() * colors.length)]
        });
        
        for (let i = 0; i < 6; i++) {
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            const angle = (i * Math.PI * 2) / 6;
            petal.position.set(
                Math.cos(angle) * 0.2,
                0.8,
                Math.sin(angle) * 0.2
            );
            petal.scale.set(1, 0.3, 1);
            flowerGroup.add(petal);
        }
        
        // Center
        const centerGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const centerMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        center.position.y = 0.8;
        flowerGroup.add(center);
        
        return flowerGroup;
    }
    
    createGardenPath() {
        const pathGeometry = new THREE.PlaneGeometry(2, 20);
        const pathMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
        const path = new THREE.Mesh(pathGeometry, pathMaterial);
        path.rotation.x = -Math.PI / 2;
        path.position.set(0, 0.02, -5);
        path.receiveShadow = true;
        this.scene.add(path);
    }
    
    createFurniture() {
        // Living room furniture
        this.createLivingRoomFurniture();
        
        // Nobita's room furniture
        this.createNobitaRoomFurniture();
        
        // Kitchen furniture
        this.createKitchenFurniture();
    }
    
    createLivingRoomFurniture() {
        const furnitureGroup = new THREE.Group();
        
        // Sofa
        const sofaGeometry = new THREE.BoxGeometry(4, 1.5, 2);
        const sofaMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const sofa = new THREE.Mesh(sofaGeometry, sofaMaterial);
        sofa.position.set(-3, 0.75, -2);
        sofa.castShadow = true;
        furnitureGroup.add(sofa);
        
        // Coffee table
        const tableGeometry = new THREE.BoxGeometry(2, 0.5, 1);
        const tableMaterial = new THREE.MeshLambertMaterial({ color: 0xD2691E });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.set(-3, 0.25, 0);
        table.castShadow = true;
        furnitureGroup.add(table);
        
        // TV
        const tvGeometry = new THREE.BoxGeometry(3, 2, 0.3);
        const tvMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const tv = new THREE.Mesh(tvGeometry, tvMaterial);
        tv.position.set(-8, 2, -2);
        tv.castShadow = true;
        furnitureGroup.add(tv);
        
        // TV screen
        const screenGeometry = new THREE.PlaneGeometry(2.5, 1.5);
        const screenMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x1E90FF,
            emissive: 0x001155
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(-7.85, 2, -2);
        furnitureGroup.add(screen);
        
        this.scene.add(furnitureGroup);
    }
    
    createNobitaRoomFurniture() {
        const roomGroup = new THREE.Group();
        
        // Bed
        const bedGeometry = new THREE.BoxGeometry(3, 0.8, 6);
        const bedMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 });
        const bed = new THREE.Mesh(bedGeometry, bedMaterial);
        bed.position.set(7, 0.4, -8);
        bed.castShadow = true;
        roomGroup.add(bed);
        
        // Pillow
        const pillowGeometry = new THREE.BoxGeometry(1, 0.3, 1.5);
        const pillowMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const pillow = new THREE.Mesh(pillowGeometry, pillowMaterial);
        pillow.position.set(7, 0.95, -10.5);
        roomGroup.add(pillow);
        
        // Desk
        const deskGeometry = new THREE.BoxGeometry(2, 0.1, 1);
        const deskMaterial = new THREE.MeshLambertMaterial({ color: 0xD2691E });
        const desk = new THREE.Mesh(deskGeometry, deskMaterial);
        desk.position.set(8.5, 1.5, -5);
        desk.castShadow = true;
        roomGroup.add(desk);
        
        // Desk legs
        const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0xD2691E });
        
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(
                8.5 + (i % 2 === 0 ? -0.9 : 0.9),
                0.75,
                -5 + (i < 2 ? -0.4 : 0.4)
            );
            roomGroup.add(leg);
        }
        
        // Chair
        const chairGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.8);
        const chairMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const chair = new THREE.Mesh(chairGeometry, chairMaterial);
        chair.position.set(7, 1, -5);
        chair.castShadow = true;
        roomGroup.add(chair);
        
        // Chair back
        const chairBackGeometry = new THREE.BoxGeometry(0.8, 1, 0.1);
        const chairBack = new THREE.Mesh(chairBackGeometry, chairMaterial);
        chairBack.position.set(7, 1.5, -5.35);
        roomGroup.add(chairBack);
        
        this.scene.add(roomGroup);
    }
    
    createKitchenFurniture() {
        const kitchenGroup = new THREE.Group();
        
        // Kitchen counter
        const counterGeometry = new THREE.BoxGeometry(6, 1.5, 1.5);
        const counterMaterial = new THREE.MeshLambertMaterial({ color: 0xDDDDDD });
        const counter = new THREE.Mesh(counterGeometry, counterMaterial);
        counter.position.set(-6, 0.75, -10);
        counter.castShadow = true;
        kitchenGroup.add(counter);
        
        // Refrigerator
        const fridgeGeometry = new THREE.BoxGeometry(1.2, 4, 1.2);
        const fridgeMaterial = new THREE.MeshLambertMaterial({ color: 0xF0F0F0 });
        const fridge = new THREE.Mesh(fridgeGeometry, fridgeMaterial);
        fridge.position.set(-9, 2, -10);
        fridge.castShadow = true;
        kitchenGroup.add(fridge);
        
        this.scene.add(kitchenGroup);
    }
    
    createDecorations() {
        // Picture frames
        this.createPictureFrames();
        
        // Plants
        this.createIndoorPlants();
        
        // Lamps
        this.createLamps();
    }
    
    createPictureFrames() {
        const frameGeometry = new THREE.PlaneGeometry(1, 1.2);
        const frameMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        
        const positions = [
            { x: -9.9, y: 5, z: -2, rotation: { y: Math.PI / 2 } },
            { x: 9.9, y: 5, z: -8, rotation: { y: -Math.PI / 2 } }
        ];
        
        positions.forEach(pos => {
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(pos.x, pos.y, pos.z);
            frame.rotation.y = pos.rotation.y;
            this.scene.add(frame);
        });
    }
    
    createIndoorPlants() {
        const positions = [
            { x: -8, z: 1 },
            { x: 8, z: -3 },
            { x: -2, z: -11 }
        ];
        
        positions.forEach(pos => {
            const plant = this.createPotPlant();
            plant.position.set(pos.x, 0, pos.z);
            this.scene.add(plant);
        });
    }
    
    createPotPlant() {
        const plantGroup = new THREE.Group();
        
        // Pot
        const potGeometry = new THREE.CylinderGeometry(0.4, 0.3, 0.8, 12);
        const potMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const pot = new THREE.Mesh(potGeometry, potMaterial);
        pot.position.y = 0.4;
        pot.castShadow = true;
        plantGroup.add(pot);
        
        // Plant stem
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.05, 1.5);
        const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 1.55;
        plantGroup.add(stem);
        
        // Leaves
        const leafGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x32CD32 });
        
        for (let i = 0; i < 6; i++) {
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            const angle = (i * Math.PI * 2) / 6;
            leaf.position.set(
                Math.cos(angle) * 0.4,
                2 + Math.random() * 0.5,
                Math.sin(angle) * 0.4
            );
            leaf.scale.set(1, 0.2, 2);
            leaf.rotation.z = angle;
            plantGroup.add(leaf);
        }
        
        return plantGroup;
    }
    
    createLamps() {
        // Floor lamp
        const lampGroup = new THREE.Group();
        
        // Lamp base
        const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.05;
        lampGroup.add(base);
        
        // Lamp pole
        const poleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 3);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 1.5;
        lampGroup.add(pole);
        
        // Lamp shade
        const shadeGeometry = new THREE.ConeGeometry(0.8, 1, 12, 1, true);
        const shadeMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xF5F5DC,
            side: THREE.DoubleSide
        });
        const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
        shade.position.y = 3.2;
        lampGroup.add(shade);
        
        // Position lamps
        const lampPositions = [
            { x: -5, z: 1 },
            { x: 5, z: -11 }
        ];
        
        lampPositions.forEach(pos => {
            const lamp = lampGroup.clone();
            lamp.position.set(pos.x, 0, pos.z);
            this.scene.add(lamp);
        });
    }
    
    createTrees() {
        const treePositions = [
            { x: -25, z: 10 },
            { x: 25, z: 10 },
            { x: -30, z: -20 },
            { x: 30, z: -20 },
            { x: 0, z: 25 },
            { x: -20, z: -30 },
            { x: 20, z: -30 }
        ];
        
        treePositions.forEach(pos => {
            const tree = this.createTree();
            tree.position.set(pos.x, 0, pos.z);
            this.scene.add(tree);
        });
    }
    
    createTree() {
        const treeGroup = new THREE.Group();
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 6, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 3;
        trunk.castShadow = true;
        treeGroup.add(trunk);
        
        // Foliage
        const foliageGeometry = new THREE.SphereGeometry(3, 12, 12);
        const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 8;
        foliage.castShadow = true;
        treeGroup.add(foliage);
        
        // Additional foliage layers for realism
        const foliage2 = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage2.position.set(1, 7, 1);
        foliage2.scale.set(0.8, 0.8, 0.8);
        treeGroup.add(foliage2);
        
        const foliage3 = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage3.position.set(-1, 7.5, -1);
        foliage3.scale.set(0.9, 0.9, 0.9);
        treeGroup.add(foliage3);
        
        return treeGroup;
    }
    
    createSky() {
        // Procedural sky using gradient
        const skyGeometry = new THREE.SphereGeometry(400, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0077ff) },
                bottomColor: { value: new THREE.Color(0xffffff) },
                offset: { value: 33 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });
        
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
    }
    
    update(deltaTime) {
        // Animate objects if needed
        this.objects.forEach(obj => {
            if (obj.userData && obj.userData.animate) {
                obj.userData.animate(deltaTime);
            }
        });
    }
    
    getInteractiveObjects() {
        return this.interactiveObjects;
    }
}
