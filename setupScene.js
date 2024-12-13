 import * as THREE from './modulos/three.module.js';
import { OrbitControls } from './modulos/OrbitControls.js';
inport setupCamera from './camera.js';
import RAPIER from '@dimforge/rapier3d-compat';
import Joystick from './joystick.js';
import { createWorld, addGround, createDynamicBody, updatePhysics } from './physics.js';

export function setupScene(container) {
    // Configuración de Three.js
    const scene = new THREE.Scene();
    const { camera, actualizarCamara } = crearCamara();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Añadir iluminación
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Configuración de Rapier3D
    const world = createWorld();
    addGround(world);

    // Crear una caja
    const cubeSize = { x: 1, y: 1, z: 1 };
    const cubePosition = { x: 0, y: 2, z: 0 };
    const rigidBody = createDynamicBody(world, cubePosition, cubeSize);

    // Visualización con Three.js
    const cubeGeometry = new THREE.BoxGeometry(cubeSize.x, cubeSize.y, cubeSize.z);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubePosition.x, cubePosition.y, cubePosition.z);
    scene.add(cube);

    // Crear el suelo visual y añadirle material
    const groundGeometry = new THREE.BoxGeometry(20, 0.2, 20); // Ajusta las dimensiones según necesites
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.position.set(0, -0.1, 0); // Posiciona el suelo justo debajo del cubo
    scene.add(groundMesh);

    // Crear y configurar el joystick
    const joystick = new Joystick({
        container: document.body, 
        radius: 100, 
        innerRadius: 50,
        position: { x: 20, y: 20 } 
    });

    const moveSpeed = 0.2; // Velocidad de movimiento ajustada

    // Funciones de actualización y control
    function updatePhysics() {
        world.step();
        const position = rigidBody.translation();
        cube.position.set(position.x, position.y, position.z);
    }

    function applyMovement() {
        const { x, y } = joystick.getPosition();
        const force = new RAPIER.Vector3(-x * (moveSpeed/2), 0, y * (moveSpeed/2));
        rigidBody.applyImpulse(force, true);
    }

    // Ajuste de la cámara al redimensionar la ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    // Retorno de todas las partes necesarias para interacción y renderizado
    return { 
        scene, 
        camera, 
        renderer, 
        controls,
        updatePhysics: () => updatePhysics(), // Corregido para que coincida con la firma en physics.js
        applyMovement 
    };
}
