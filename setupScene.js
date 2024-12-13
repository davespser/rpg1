import * as THREE from './modulos/three.module.js';
import { OrbitControls } from './modulos/OrbitControls.js';
import { setupCamera } from './camera.js';
import { crearLuces } from './luces.js';
import RAPIER from '@dimforge/rapier3d-compat';
import Joystick from './joystick.js';
import { createWorld, createTerrain, createDynamicBody, updatePhysics } from './physics.js';
import { createNoise2D } from 'simplex-noise';

export function setupScene(container) {
    let lastTime = performance.now();
    // Configuración de Three.js
    const scene = new THREE.Scene();
    const { camera, onWindowResize } = setupCamera(container);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Añadir iluminación
    crearLuces(scene);

    // Crear el mundo físico
    const world = createWorld();

    // Crear el terreno en el mundo físico
    const terrainSize = 100; // tamaño del terreno
    const terrainSubdivisions = 50; // subdivisiones del terreno
    createTerrain(world, terrainSize, terrainSubdivisions);

    // Crear una caja
    const cubeSize = { x: 1, y: 1, z: 1 };
    const cubePosition = { x: 0, y: 10, z: 0 }; // Asegúrate de que esté por encima del terreno
    const rigidBody = createDynamicBody(world, cubePosition, cubeSize);

    // Visualización con Three.js
    const cubeGeometry = new THREE.BoxGeometry(cubeSize.x, cubeSize.y, cubeSize.z);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubePosition.x, cubePosition.y, cubePosition.z);
    scene.add(cube);

    // Crear el terreno visual correspondiente al terreno físico
    function generateTerrainGeometry(width, height, subdivisions) {
        const geometry = new THREE.PlaneGeometry(width, height, subdivisions, subdivisions);
        const noise = createNoise2D();
        const vertices = geometry.getAttribute('position').array;

        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            vertices[i + 1] = noise(x / 10, z / 10) * 5; // Y coord, ajusta estos valores para modificar la altura
        }

        geometry.computeVertexNormals(); // Necesario para la iluminación
        return geometry;
    }

    const terrainGeometry = generateTerrainGeometry(terrainSize, terrainSize, terrainSubdivisions);
    const terrainMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, wireframe: false });
    const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrainMesh.rotation.x = -Math.PI / 2; // Girar para que esté horizontal
    scene.add(terrainMesh);

    // Crear y configurar el joystick
    const joystick = new Joystick({
        container: document.body, 
        radius: 100, 
        innerRadius: 50,
        position: { x: 20, y: 20 } 
    });

    const moveSpeed = 0.2; // Velocidad de movimiento ajustada

    // Funciones de actualización y control
    function updatePhysics(deltaTime) {
    const now = performance.now();
    lastTime = now;
    updatePhysics(world, deltaTime); // Llamar a la función de Rapier para actualizar la física
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
        updatePhysics,
        applyMovement
    };
                                               }
