import * as THREE from './modulos/three.module.js';
import { OrbitControls } from './modulos/OrbitControls.js';
import { setupCamera } from './camera.js';
import { crearLuces } from './luces.js';
import { TerrainPhysics } from './TerrainPhysics.js'; // Assuming this is where your class is defined
import Joystick from './joystick.js';

export async function setupScene(container) {
    let lastTime = performance.now();
    
    // Three.js Setup
    const scene = new THREE.Scene();
    const { camera, onWindowResize } = setupCamera(container);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Add lighting
    crearLuces(scene);

    // Initialize physics
    const terrainPhysics = new TerrainPhysics(100, 5); // Size and subdivisions, adjust as needed
    await terrainPhysics.initialize();
    const world = terrainPhysics.getWorld();

    // Create a dynamic body (cube)
    const cubeSize = { x: 1, y: 1, z: 1 };
    const cubePosition = { x: 0, y: 10, z: 0 }; // Ensure it's above the terrain
    const rigidBody = terrainPhysics.createDynamicBody(cubePosition, cubeSize);

    // Visual representation of the cube
    const cubeGeometry = new THREE.BoxGeometry(cubeSize.x, cubeSize.y, cubeSize.z);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubePosition.x, cubePosition.y, cubePosition.z);
    scene.add(cube);

    // Generate visual terrain - Here you would use your TerrainGeometry class
    // Assuming you have the class available:
    const terrainGeometry = new TerrainGeometry(100, 100, 5, 5).generate(); // Use same size and subdivisions
    const terrainMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, wireframe: false });
    const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrainMesh.rotation.x = -Math.PI / 2; // Rotate so it's horizontal
    scene.add(terrainMesh);

    // Create and configure joystick
    const joystick = new Joystick({
        container: document.body, 
        radius: 100, 
        innerRadius: 50,
        position: { x: 20, y: 20 } 
    });

    const moveSpeed = 0.2; // Adjusted movement speed

    // Update and control functions
    function updatePhysics(deltaTime) {
        const now = performance.now();
        const delta = (now - lastTime) / 1000; // Convert to seconds
        lastTime = now;
        terrainPhysics.update(delta); // Update physics simulation
        const position = rigidBody.translation();
        cube.position.set(position.x, position.y, position.z);
    }

    function applyMovement() {
        const { x, y } = joystick.getPosition();
        const force = new RAPIER.Vector3(-x * (moveSpeed/2), 0, y * (moveSpeed/2));
        rigidBody.applyImpulse(force, true);
    }

    // Adjust camera on window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    // Return all necessary parts for interaction and rendering
    return { 
        scene, 
        camera, 
        renderer, 
        controls,
        updatePhysics,
        applyMovement
    };
}
