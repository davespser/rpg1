import * as THREE from './modulos/three.module.js';
import { OrbitControls } from './modulos/OrbitControls.js';
import RAPIER from '@dimforge/rapier3d-compat';

export function someOtherFunction(container) {
    // Código de la función
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000, 0); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Luz ambiente y punto de luz
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Configuración de Rapier3D
    const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });

    // Crear un suelo
    const groundColliderDesc = RAPIER.ColliderDesc.cuboid(10, 0.1, 10);
    world.createCollider(groundColliderDesc);

    // Crear una caja que se pueda controlar
    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0, 2, 0);
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    world.createCollider(colliderDesc, rigidBody);

    // Visualización con Three.js
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Control de movimiento
    const moveSpeed = 5;
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;

    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW': moveForward = true; break;
            case 'ArrowDown':
            case 'KeyS': moveBackward = true; break;
            case 'ArrowLeft':
            case 'KeyA': moveLeft = true; break;
            case 'ArrowRight':
            case 'KeyD': moveRight = true; break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW': moveForward = false; break;
            case 'ArrowDown':
            case 'KeyS': moveBackward = false; break;
            case 'ArrowLeft':
            case 'KeyA': moveLeft = false; break;
            case 'ArrowRight':
            case 'KeyD': moveRight = false; break;
        }
    });

    function applyMovement() {
        const force = new RAPIER.Vector3(0, 0, 0);
        if (moveForward) force.z -= moveSpeed;
        if (moveBackward) force.z += moveSpeed;
        if (moveLeft) force.x -= moveSpeed;
        if (moveRight) force.x += moveSpeed;

        if (force.x !== 0 || force.y !== 0 || force.z !== 0) {
            rigidBody.applyImpulse(force, true);
        }
    }

    function updatePhysics() {
        world.step();
        const position = rigidBody.translation();
        cube.position.set(position.x, position.y, position.z);
    }

    return { scene, camera, renderer, controls, updatePhysics, applyMovement };
}
