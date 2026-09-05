// Minecraft 3D Game - Three.js Implementation

let scene, camera, renderer;
let blocks = [];
let selectedBlock = 'grass';
let blockColors = {
    grass: 0x7cb342,
    dirt: 0x8d6e63,
    stone: 0x9e9e9e,
    wood: 0xd4a574,
    sand: 0xfdd835
};

let player = {
    pos: { x: 0, y: 5, z: 0 },
    vel: { x: 0, y: 0, z: 0 },
    speed: 0.1,
    jumpPower: 0.3,
    isJumping: false,
    gravity: 0.008
};

let keys = {};
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let stats = {
    placed: 0,
    destroyed: 0
};

const GRID_SIZE = 1;
const WORLD_SIZE = 20;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 100, 200);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(player.pos.x, player.pos.y, player.pos.z);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 30, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);

    // Generate terrain
    generateTerrain();

    // Event listeners
    document.addEventListener('keydown', (e) => keys[e.key] = true);
    document.addEventListener('keyup', (e) => keys[e.key] = false);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onMouseClick);
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('mousedown', (e) => {
        if (e.button === 2) onRightClick();
    });
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('wheel', onScroll);

    // Load world from storage
    loadWorldFromStorage();

    animate();
}

function generateTerrain() {
    // Create ground
    for (let x = -WORLD_SIZE; x < WORLD_SIZE; x++) {
        for (let z = -WORLD_SIZE; z < WORLD_SIZE; z++) {
            let height = Math.floor(Math.sin(x * 0.1) * 2 + Math.cos(z * 0.1) * 2 + 3);
            
            for (let y = 0; y < height; y++) {
                let blockType = y === height - 1 ? 'grass' : (y > height - 3 ? 'dirt' : 'stone');
                addBlock(x, y, z, blockType);
            }
        }
    }
}

function addBlock(x, y, z, type = selectedBlock) {
    const geometry = new THREE.BoxGeometry(GRID_SIZE, GRID_SIZE, GRID_SIZE);
    const material = new THREE.MeshPhongMaterial({
        color: blockColors[type] || blockColors.grass,
        shininess: 30
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(x + GRID_SIZE / 2, y + GRID_SIZE / 2, z + GRID_SIZE / 2);
    
    scene.add(mesh);
    blocks.push({
        mesh: mesh,
        pos: { x, y, z },
        type: type
    });
}

function removeBlock(x, y, z) {
    const index = blocks.findIndex(b => b.pos.x === x && b.pos.y === y && b.pos.z === z);
    if (index !== -1) {
        scene.remove(blocks[index].mesh);
        blocks.splice(index, 1);
        stats.destroyed++;
    }
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(blocks.map(b => b.mesh));

    if (intersects.length > 0) {
        const point = intersects[0].point;
        const normal = intersects[0].face.normal;
        
        // Calculate new block position
        const newPos = {
            x: Math.round(point.x - normal.x * 0.5),
            y: Math.round(point.y - normal.y * 0.5),
            z: Math.round(point.z - normal.z * 0.5)
        };

        // Check if position is free
        if (!blocks.find(b => b.pos.x === newPos.x && b.pos.y === newPos.y && b.pos.z === newPos.z)) {
            addBlock(newPos.x, newPos.y, newPos.z, selectedBlock);
            stats.placed++;
        }
    }
}

function onRightClick() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(blocks.map(b => b.mesh));

    if (intersects.length > 0) {
        const point = intersects[0].point;
        const blockIndex = blocks.findIndex(b => 
            Math.abs(b.mesh.position.x - point.x) < 0.6 &&
            Math.abs(b.mesh.position.y - point.y) < 0.6 &&
            Math.abs(b.mesh.position.z - point.z) < 0.6
        );
        
        if (blockIndex !== -1) {
            const block = blocks[blockIndex];
            removeBlock(block.pos.x, block.pos.y, block.pos.z);
        }
    }
}

function onScroll(event) {
    const blockTypes = Object.keys(blockColors);
    const currentIndex = blockTypes.indexOf(selectedBlock);
    let newIndex = currentIndex + (event.deltaY > 0 ? 1 : -1);
    newIndex = (newIndex + blockTypes.length) % blockTypes.length;
    selectBlock(null, blockTypes[newIndex]);
}

function selectBlock(element, type) {
    selectedBlock = type;
    document.querySelectorAll('.block-item').forEach(el => el.classList.remove('selected'));
    if (element) element.classList.add('selected');
    else document.querySelector(`[data-block="${type}"]`).classList.add('selected');
}

function updatePlayer() {
    // Movement
    let moveVec = new THREE.Vector3();
    
    if (keys['w'] || keys['W']) moveVec.z -= player.speed;
    if (keys['s'] || keys['S']) moveVec.z += player.speed;
    if (keys['a'] || keys['A']) moveVec.x -= player.speed;
    if (keys['d'] || keys['D']) moveVec.x += player.speed;

    // Rotate movement relative to camera
    const cameraDirection = camera.getWorldDirection(new THREE.Vector3());
    const angle = Math.atan2(cameraDirection.x, cameraDirection.z);
    
    const rotated = {
        x: moveVec.x * Math.cos(angle) - moveVec.z * Math.sin(angle),
        z: moveVec.x * Math.sin(angle) + moveVec.z * Math.cos(angle)
    };

    player.pos.x += rotated.x;
    player.pos.z += rotated.z;

    // Jump
    if (keys[' '] && !player.isJumping) {
        player.vel.y = player.jumpPower;
        player.isJumping = true;
    }

    // Gravity and vertical movement
    player.vel.y -= player.gravity;
    player.pos.y += player.vel.y;

    // Ground collision (simplified)
    if (player.pos.y <= 1) {
        player.pos.y = 1;
        player.vel.y = 0;
        player.isJumping = false;
    }

    // Shift down
    if (keys['Shift']) player.pos.y -= 0.05;

    // Clamp position
    player.pos.x = Math.max(-50, Math.min(50, player.pos.x));
    player.pos.z = Math.max(-50, Math.min(50, player.pos.z));

    camera.position.set(player.pos.x, player.pos.y + 0.6, player.pos.z);
}

function updateUI() {
    document.getElementById('pos').textContent = 
        `${Math.round(player.pos.x)}, ${Math.round(player.pos.y)}, ${Math.round(player.pos.z)}`;
    document.getElementById('placed').textContent = stats.placed;
    document.getElementById('destroyed').textContent = stats.destroyed;
}

function animate() {
    requestAnimationFrame(animate);

    updatePlayer();
    updateUI();

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function saveWorld() {
    const worldData = blocks.map(b => ({
        x: b.pos.x,
        y: b.pos.y,
        z: b.pos.z,
        type: b.type
    }));
    
    localStorage.setItem('minecraftWorld', JSON.stringify(worldData));
    showMessage('World Saved!', '✅ Your world has been saved to local storage.');
}

function loadWorld() {
    const saved = localStorage.getItem('minecraftWorld');
    if (saved) {
        showMessage('Load World?', '⚠️ This will replace the current world. Refresh the page to load.');
    } else {
        showMessage('No Saved World', '❌ No saved world found in local storage.');
    }
}

function loadWorldFromStorage() {
    const saved = localStorage.getItem('minecraftWorld');
    if (saved) {
        // Clear existing blocks except terrain
        blocks = [];
        scene.children = scene.children.filter(child => !child.isMesh || child.position.y < 0);
        
        const worldData = JSON.parse(saved);
        worldData.forEach(b => {
            addBlock(b.x, b.y, b.z, b.type);
        });
        
        showMessage('World Loaded!', '✅ Your saved world has been loaded.');
    }
}

function clearWorld() {
    if (confirm('Are you sure? This will delete all blocks!')) {
        blocks.forEach(b => scene.remove(b.mesh));
        blocks = [];
        stats.placed = 0;
        stats.destroyed = 0;
        localStorage.removeItem('minecraftWorld');
        generateTerrain();
        showMessage('World Cleared', '🗑️ All custom blocks have been removed.');
    }
}

function showMessage(title, text) {
    const msgDiv = document.getElementById('message');
    document.getElementById('messageTitle').textContent = title;
    document.getElementById('messageText').textContent = text;
    msgDiv.style.display = 'block';
    setTimeout(() => { msgDiv.style.display = 'none'; }, 4000);
}

// Start the game
window.addEventListener('load', init);