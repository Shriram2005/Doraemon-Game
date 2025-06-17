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
        // Much larger ground area
        const groundGeometry = new THREE.PlaneGeometry(400, 400);
        const groundTexture = this.createGrassTexture();
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            map: groundTexture,
            color: 0x90EE90
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Larger house foundation
        const houseFloorGeometry = new THREE.PlaneGeometry(35, 25);
        const floorTexture = this.createWoodTexture();
        const houseFloorMaterial = new THREE.MeshLambertMaterial({ 
            map: floorTexture,
            color: 0xDEB887
        });
        
        const houseFloor = new THREE.Mesh(houseFloorGeometry, houseFloorMaterial);
        houseFloor.rotation.x = -Math.PI / 2;
        houseFloor.position.set(0, 0.01, -8);
        houseFloor.receiveShadow = true;
        this.scene.add(houseFloor);
        
        // Add stone pathway
        this.createStonePath();
        
        // Add courtyard area
        this.createCourtyard();
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
        
        // Much larger main house structure
        const wallGeometry = new THREE.BoxGeometry(30, 12, 20);
        const wallMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xF5DEB3,
            shininess: 30
        });
        const walls = new THREE.Mesh(wallGeometry, wallMaterial);
        walls.position.set(0, 6, -8);
        walls.castShadow = true;
        walls.receiveShadow = true;
        houseGroup.add(walls);
        
        // Better, larger roof with multiple sections
        const mainRoofGeometry = new THREE.ConeGeometry(18, 8, 4);
        const roofMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8B0000,
            shininess: 50
        });
        const mainRoof = new THREE.Mesh(mainRoofGeometry, roofMaterial);
        mainRoof.position.set(0, 16, -8);
        mainRoof.rotation.y = Math.PI / 4;
        mainRoof.castShadow = true;
        houseGroup.add(mainRoof);
        
        // Secondary roof sections
        const sideRoofGeometry = new THREE.ConeGeometry(10, 6, 4);
        const leftRoof = new THREE.Mesh(sideRoofGeometry, roofMaterial);
        leftRoof.position.set(-12, 13, -3);
        leftRoof.rotation.y = Math.PI / 4;
        leftRoof.castShadow = true;
        houseGroup.add(leftRoof);
        
        const rightRoof = new THREE.Mesh(sideRoofGeometry, roofMaterial);
        rightRoof.position.set(12, 13, -3);
        rightRoof.rotation.y = Math.PI / 4;
        rightRoof.castShadow = true;
        houseGroup.add(rightRoof);
        
        // Add chimney
        this.createChimney(houseGroup);
        
        // Add house details
        this.createHouseDetails(houseGroup);
        
        // Enhanced windows
        this.createWindows(houseGroup);
        
        // Enhanced doors
        this.createDoors(houseGroup);
        
        // Enhanced interior walls
        this.createInteriorWalls(houseGroup);
        
        // Add balcony
        this.createBalcony(houseGroup);
        
        // Add entrance stairs
        this.createEntranceStairs(houseGroup);
        
        this.scene.add(houseGroup);
        this.objects.push(houseGroup);
    }
      createWindows(houseGroup) {
        const windowGeometry = new THREE.PlaneGeometry(3, 3);
        const windowMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.7,
            shininess: 100
        });
        
        // Front windows - more and larger
        for (let i = 0; i < 5; i++) {
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(-12 + i * 6, 7, 2.01);
            houseGroup.add(window);
            
            // Enhanced window frame
            const frameGeometry = new THREE.BoxGeometry(3.2, 3.2, 0.1);
            const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(-12 + i * 6, 7, 2.05);
            houseGroup.add(frame);
            
            // Window dividers
            const dividerGeometry = new THREE.BoxGeometry(0.1, 3, 0.05);
            const dividerMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
            const verticalDivider = new THREE.Mesh(dividerGeometry, dividerMaterial);
            verticalDivider.position.set(-12 + i * 6, 7, 2.06);
            houseGroup.add(verticalDivider);
            
            const horizontalDivider = new THREE.Mesh(dividerGeometry, dividerMaterial);
            horizontalDivider.rotation.z = Math.PI / 2;
            horizontalDivider.position.set(-12 + i * 6, 7, 2.06);
            houseGroup.add(horizontalDivider);
        }
        
        // Side windows
        for (let i = 0; i < 3; i++) {
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(15.01, 7, -15 + i * 7);
            window.rotation.y = Math.PI / 2;
            houseGroup.add(window);
            
            // Side window frames
            const frameGeometry = new THREE.BoxGeometry(0.1, 3.2, 3.2);
            const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(15.05, 7, -15 + i * 7);
            houseGroup.add(frame);
        }
        
        // Second floor windows
        for (let i = 0; i < 3; i++) {
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(-8 + i * 8, 11, 2.01);
            houseGroup.add(window);
            
            const frameGeometry = new THREE.BoxGeometry(3.2, 3.2, 0.1);
            const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(-8 + i * 8, 11, 2.05);
            houseGroup.add(frame);
        }
    }
      createDoors(houseGroup) {
        // Main entrance door - larger and more detailed
        const doorGeometry = new THREE.BoxGeometry(2.5, 6, 0.3);
        const doorMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8B4513,
            shininess: 60
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 3, 3.8);
        door.castShadow = true;
        houseGroup.add(door);
        
        // Door panels
        const panelGeometry = new THREE.BoxGeometry(1, 1.5, 0.05);
        const panelMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
        
        for (let i = 0; i < 4; i++) {
            const panel = new THREE.Mesh(panelGeometry, panelMaterial);
            const x = (i % 2) * 1.2 - 0.6;
            const y = Math.floor(i / 2) * 2 + 2.5;
            panel.position.set(x, y, 3.85);
            houseGroup.add(panel);
        }
        
        // Door handle and lock
        const handleGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const handleMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFD700,
            shininess: 100
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(1, 3, 3.9);
        houseGroup.add(handle);
        
        // Door frame
        const frameGeometry = new THREE.BoxGeometry(3, 6.5, 0.2);
        const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 3.25, 3.7);
        houseGroup.add(frame);
        
        // Enhanced sliding door to garden
        const slidingDoorGeometry = new THREE.PlaneGeometry(4, 8);
        const slidingDoorMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xF0F0F0,
            transparent: true,
            opacity: 0.8,
            shininess: 80
        });
        const slidingDoor = new THREE.Mesh(slidingDoorGeometry, slidingDoorMaterial);
        slidingDoor.position.set(-12, 4, -18.01);
        slidingDoor.rotation.y = Math.PI;
        houseGroup.add(slidingDoor);
        
        // Sliding door frame
        const slidingFrameGeometry = new THREE.BoxGeometry(4.2, 8.2, 0.1);
        const slidingFrame = new THREE.Mesh(slidingFrameGeometry, frameMaterial);
        slidingFrame.position.set(-12, 4, -18.05);
        houseGroup.add(slidingFrame);
        
        this.interactiveObjects.push({
            mesh: slidingDoor,
            type: 'door',
            action: 'slide'
        });
    }
      createInteriorWalls(houseGroup) {
        // Enhanced room divisions for larger house
        const dividerGeometry = new THREE.BoxGeometry(0.3, 12, 15);
        const dividerMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xF5DEB3,
            shininess: 20
        });
        
        // Living room dividers
        const divider1 = new THREE.Mesh(dividerGeometry, dividerMaterial);
        divider1.position.set(8, 6, -12);
        houseGroup.add(divider1);
        
        const divider2 = new THREE.Mesh(dividerGeometry, dividerMaterial);
        divider2.position.set(-8, 6, -12);
        houseGroup.add(divider2);
        
        // Kitchen divider
        const kitchenDividerGeometry = new THREE.BoxGeometry(15, 12, 0.3);
        const kitchenDivider = new THREE.Mesh(kitchenDividerGeometry, dividerMaterial);
        kitchenDivider.position.set(7.5, 6, -3);
        houseGroup.add(kitchenDivider);
        
        // Bathroom divider
        const bathroomDividerGeometry = new THREE.BoxGeometry(8, 12, 0.3);
        const bathroomDivider = new THREE.Mesh(bathroomDividerGeometry, dividerMaterial);
        bathroomDivider.position.set(-11, 6, -3);
        houseGroup.add(bathroomDivider);
        
        // Add interior doors
        this.createInteriorDoors(houseGroup);
    }
    
    createInteriorDoors(houseGroup) {
        // Interior door for kitchen
        const interiorDoorGeometry = new THREE.BoxGeometry(1.5, 4, 0.1);
        const interiorDoorMaterial = new THREE.MeshPhongMaterial({ color: 0xDEB887 });
        
        const kitchenDoor = new THREE.Mesh(interiorDoorGeometry, interiorDoorMaterial);
        kitchenDoor.position.set(5, 2, -3);
        houseGroup.add(kitchenDoor);
        
        // Interior door for bathroom
        const bathroomDoor = new THREE.Mesh(interiorDoorGeometry, interiorDoorMaterial);
        bathroomDoor.position.set(-9, 2, -3);
        houseGroup.add(bathroomDoor);
    }
      createGarden() {
        // Much larger and more detailed garden area
        const gardenGroup = new THREE.Group();
        
        // Enhanced garden border - larger area
        const borderGeometry = new THREE.BoxGeometry(0.5, 1, 25);
        const borderMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8B4513,
            shininess: 30
        });
        
        for (let i = 0; i < 4; i++) {
            const border = new THREE.Mesh(borderGeometry, borderMaterial);
            const angle = (i * Math.PI) / 2;
            border.position.set(
                Math.sin(angle) * 20,
                0.5,
                -8 + Math.cos(angle) * 20
            );
            border.rotation.y = angle;
            border.castShadow = true;
            gardenGroup.add(border);
        }
        
        // Multiple flower beds
        this.createFlowerBeds(gardenGroup);
        
        // Enhanced garden path
        this.createGardenPath(gardenGroup);
        
        // Add garden pond
        this.createGardenPond(gardenGroup);
        
        // Add garden gazebo
        this.createGazebo(gardenGroup);
        
        // Add more garden decorations
        this.createGardenDecorations(gardenGroup);
        
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
        // More trees in better positions around the larger environment
        const treePositions = [
            { x: -40, z: 15, type: 'oak' },
            { x: 40, z: 15, type: 'pine' },
            { x: -45, z: -25, type: 'cherry' },
            { x: 45, z: -25, type: 'oak' },
            { x: 0, z: 40, type: 'pine' },
            { x: -35, z: -40, type: 'oak' },
            { x: 35, z: -40, type: 'cherry' },
            { x: -50, z: 0, type: 'pine' },
            { x: 50, z: 0, type: 'oak' },
            { x: 15, z: 35, type: 'cherry' },
            { x: -15, z: 35, type: 'oak' },
            { x: 25, z: -35, type: 'pine' },
            { x: -25, z: -35, type: 'cherry' }
        ];
        
        treePositions.forEach(pos => {
            const tree = this.createTree(pos.type);
            tree.position.set(pos.x, 0, pos.z);
            this.scene.add(tree);
        });
    }
    
    createTree(type = 'oak') {
        const treeGroup = new THREE.Group();
        
        if (type === 'oak') {
            // Oak tree - traditional
            const trunkGeometry = new THREE.CylinderGeometry(0.8, 1.2, 8, 12);
            const trunkMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x8B4513,
                shininess: 20
            });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 4;
            trunk.castShadow = true;
            treeGroup.add(trunk);
            
            // Multiple foliage layers for realism
            const foliageGeometry1 = new THREE.SphereGeometry(4, 16, 16);
            const foliageMaterial1 = new THREE.MeshPhongMaterial({ 
                color: 0x228B22,
                shininess: 10
            });
            const foliage1 = new THREE.Mesh(foliageGeometry1, foliageMaterial1);
            foliage1.position.y = 10;
            foliage1.castShadow = true;
            treeGroup.add(foliage1);
            
            const foliage2 = new THREE.Mesh(foliageGeometry1, foliageMaterial1);
            foliage2.position.set(-1.5, 9, 1);
            foliage2.scale.set(0.8, 0.8, 0.8);
            foliage2.castShadow = true;
            treeGroup.add(foliage2);
            
            const foliage3 = new THREE.Mesh(foliageGeometry1, foliageMaterial1);
            foliage3.position.set(1.5, 9, -1);
            foliage3.scale.set(0.7, 0.7, 0.7);
            foliage3.castShadow = true;
            treeGroup.add(foliage3);
            
        } else if (type === 'pine') {
            // Pine tree - coniferous
            const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 10, 8);
            const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 5;
            trunk.castShadow = true;
            treeGroup.add(trunk);
            
            // Pine foliage - multiple cone sections
            for (let i = 0; i < 4; i++) {
                const coneGeometry = new THREE.ConeGeometry(3 - i * 0.5, 4, 8);
                const coneMaterial = new THREE.MeshPhongMaterial({ color: 0x006400 });
                const cone = new THREE.Mesh(coneGeometry, coneMaterial);
                cone.position.y = 8 + i * 2.5;
                cone.castShadow = true;
                treeGroup.add(cone);
            }
            
        } else if (type === 'cherry') {
            // Cherry blossom tree
            const trunkGeometry = new THREE.CylinderGeometry(0.6, 0.9, 7, 10);
            const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 3.5;
            trunk.castShadow = true;
            treeGroup.add(trunk);
            
            // Cherry blossom foliage
            const foliageGeometry = new THREE.SphereGeometry(3.5, 16, 16);
            const foliageMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xFFB6C1,
                shininess: 30
            });
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.y = 9;
            foliage.castShadow = true;
            treeGroup.add(foliage);
            
            // Add some falling petals effect
            for (let i = 0; i < 10; i++) {
                const petalGeometry = new THREE.PlaneGeometry(0.2, 0.2);
                const petalMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0xFFB6C1,
                    transparent: true,
                    opacity: 0.8
                });
                const petal = new THREE.Mesh(petalGeometry, petalMaterial);
                petal.position.set(
                    (Math.random() - 0.5) * 8,
                    Math.random() * 5 + 2,
                    (Math.random() - 0.5) * 8
                );                treeGroup.add(petal);
            }
        }
        
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
    
    createStonePath() {
        // Stone pathway leading to house
        const pathGroup = new THREE.Group();
        
        for (let i = 0; i < 15; i++) {
            const stoneGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 8);
            const stoneMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x808080,
                shininess: 20
            });
            const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
            stone.position.set(
                Math.sin(i * 0.3) * 2,
                0.05,
                i * 1.5 - 10
            );
            stone.rotation.y = Math.random() * Math.PI;
            stone.castShadow = true;
            pathGroup.add(stone);
        }
        
        this.scene.add(pathGroup);
    }
    
    createCourtyard() {
        // Traditional Japanese-style courtyard
        const courtyardGeometry = new THREE.PlaneGeometry(25, 25);
        const courtyardMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xD2B48C,
            shininess: 10
        });
        const courtyard = new THREE.Mesh(courtyardGeometry, courtyardMaterial);
        courtyard.rotation.x = -Math.PI / 2;
        courtyard.position.set(-25, 0.02, -8);
        courtyard.receiveShadow = true;
        this.scene.add(courtyard);
    }
    
    createChimney(houseGroup) {
        const chimneyGeometry = new THREE.BoxGeometry(2, 8, 2);
        const chimneyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x696969,
            shininess: 30
        });
        const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
        chimney.position.set(8, 18, -12);
        chimney.castShadow = true;
        houseGroup.add(chimney);
        
        // Chimney cap
        const capGeometry = new THREE.BoxGeometry(2.5, 0.5, 2.5);
        const capMaterial = new THREE.MeshPhongMaterial({ color: 0x2F4F4F });
        const cap = new THREE.Mesh(capGeometry, capMaterial);
        cap.position.set(8, 22.5, -12);
        houseGroup.add(cap);
    }
    
    createHouseDetails(houseGroup) {
        // Add decorative elements
        const pillarGeometry = new THREE.CylinderGeometry(0.5, 0.5, 12, 16);
        const pillarMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xF5DEB3,
            shininess: 40
        });
        
        // Front pillars
        for (let i = 0; i < 4; i++) {
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(-9 + i * 6, 6, 3);
            pillar.castShadow = true;
            houseGroup.add(pillar);
        }
        
        // Add eaves (roof overhangs)
        const eavesGeometry = new THREE.BoxGeometry(35, 0.5, 3);
        const eavesMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const eaves = new THREE.Mesh(eavesGeometry, eavesMaterial);
        eaves.position.set(0, 12.5, 3.5);
        eaves.castShadow = true;
        houseGroup.add(eaves);
    }
    
    createBalcony(houseGroup) {
        // Second floor balcony
        const balconyFloorGeometry = new THREE.BoxGeometry(12, 0.3, 4);
        const balconyFloorMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xDEB887,
            shininess: 30
        });
        const balconyFloor = new THREE.Mesh(balconyFloorGeometry, balconyFloorMaterial);
        balconyFloor.position.set(0, 12, 5);
        balconyFloor.castShadow = true;
        houseGroup.add(balconyFloor);
        
        // Balcony railing
        const railingGeometry = new THREE.BoxGeometry(12, 2, 0.1);
        const railingMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
        const railing = new THREE.Mesh(railingGeometry, railingMaterial);
        railing.position.set(0, 13, 7);
        houseGroup.add(railing);
        
        // Railing posts
        for (let i = 0; i < 7; i++) {
            const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
            const post = new THREE.Mesh(postGeometry, railingMaterial);
            post.position.set(-6 + i * 2, 13, 7);
            houseGroup.add(post);
        }
    }
    
    createEntranceStairs(houseGroup) {
        // Entrance stairs
        for (let i = 0; i < 4; i++) {
            const stepGeometry = new THREE.BoxGeometry(8, 0.3, 1);
            const stepMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x708090,
                shininess: 20
            });
            const step = new THREE.Mesh(stepGeometry, stepMaterial);
            step.position.set(0, i * 0.3, 3 + i * 0.25);
            step.castShadow = true;
            step.receiveShadow = true;
            houseGroup.add(step);
        }
    }
    
    createGardenPond(gardenGroup) {
        // Beautiful garden pond
        const pondGeometry = new THREE.CylinderGeometry(8, 8, 0.5, 32);
        const pondMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1E90FF,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        const pond = new THREE.Mesh(pondGeometry, pondMaterial);
        pond.position.set(25, 0.25, -8);
        pond.receiveShadow = true;
        gardenGroup.add(pond);
        
        // Pond border
        const pondBorderGeometry = new THREE.TorusGeometry(8.5, 0.3, 8, 32);
        const pondBorderMaterial = new THREE.MeshPhongMaterial({ color: 0x696969 });
        const pondBorder = new THREE.Mesh(pondBorderGeometry, pondBorderMaterial);
        pondBorder.position.set(25, 0.5, -8);
        pondBorder.rotation.x = -Math.PI / 2;
        gardenGroup.add(pondBorder);
        
        // Add lily pads
        for (let i = 0; i < 6; i++) {
            const lilyGeometry = new THREE.CylinderGeometry(1, 1, 0.05, 8);
            const lilyMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
            const lily = new THREE.Mesh(lilyGeometry, lilyMaterial);
            const angle = (i / 6) * Math.PI * 2;
            lily.position.set(
                25 + Math.cos(angle) * 4,
                0.55,
                -8 + Math.sin(angle) * 4
            );
            gardenGroup.add(lily);
        }
    }
    
    createGazebo(gardenGroup) {
        // Traditional Japanese-style gazebo
        const gazeboGroup = new THREE.Group();
        
        // Gazebo floor
        const floorGeometry = new THREE.CylinderGeometry(6, 6, 0.3, 8);
        const floorMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xDEB887,
            shininess: 40
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.set(-30, 0.15, 15);
        floor.castShadow = true;
        gazeboGroup.add(floor);
        
        // Gazebo pillars
        const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
        const pillarMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(
                -30 + Math.cos(angle) * 5,
                4,
                15 + Math.sin(angle) * 5
            );
            pillar.castShadow = true;
            gazeboGroup.add(pillar);
        }
        
        // Gazebo roof
        const roofGeometry = new THREE.ConeGeometry(8, 4, 8);
        const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x8B0000 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(-30, 10, 15);
        roof.castShadow = true;
        gazeboGroup.add(roof);
        
        gardenGroup.add(gazeboGroup);
    }
    
    createGardenDecorations(gardenGroup) {
        // Stone lanterns
        for (let i = 0; i < 4; i++) {
            const lanternGroup = new THREE.Group();
            
            // Lantern base
            const baseGeometry = new THREE.CylinderGeometry(1, 1.2, 2, 8);
            const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x708090 });
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.position.y = 1;
            base.castShadow = true;
            lanternGroup.add(base);
            
            // Lantern top
            const topGeometry = new THREE.CylinderGeometry(0.8, 1, 1.5, 8);
            const top = new THREE.Mesh(topGeometry, baseMaterial);
            top.position.y = 2.75;
            top.castShadow = true;
            lanternGroup.add(top);
            
            // Lantern roof
            const lanternRoofGeometry = new THREE.ConeGeometry(1.2, 1, 8);
            const lanternRoof = new THREE.Mesh(lanternRoofGeometry, baseMaterial);
            lanternRoof.position.y = 4;
            lanternRoof.castShadow = true;
            lanternGroup.add(lanternRoof);
            
            // Position lanterns around garden
            const angle = (i / 4) * Math.PI * 2;
            lanternGroup.position.set(
                Math.cos(angle) * 15,
                0,
                -8 + Math.sin(angle) * 15
            );
            
            gardenGroup.add(lanternGroup);
        }
        
        // Garden bench
        const benchGeometry = new THREE.BoxGeometry(4, 0.3, 1.5);
        const benchMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const bench = new THREE.Mesh(benchGeometry, benchMaterial);
        bench.position.set(15, 0.8, 5);
        bench.castShadow = true;
        gardenGroup.add(bench);
        
        // Bench legs
        for (let i = 0; i < 4; i++) {
            const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
            const leg = new THREE.Mesh(legGeometry, benchMaterial);
            const x = 15 + (i % 2) * 3.5 - 1.75;
            const z = 5 + Math.floor(i / 2) * 1 - 0.5;
            leg.position.set(x, 0.75, z);
            gardenGroup.add(leg);
        }
    }
}
