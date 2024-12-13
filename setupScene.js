import * as THREE from './modulos/three.module.js';
import { OrbitControls } from './modulos/OrbitControls.js';
import RAPIER from '@dimforge/rapier3d-compat';

export function setupScene(container) {
    // Configuración de Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Añadir iluminación
    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Configuración de Rapier3D
    const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });

    // Crear un suelo
    const groundColliderDesc = RAPIER.ColliderDesc.cuboid(10, 0.1, 10);
    world.createCollider(groundColliderDesc);

    // Crear una caja
    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 2, 0);
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    world.createCollider(colliderDesc, rigidBody);

    // Visualización con Three.js
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Funciones de actualización y control
    function updatePhysics() {
        world.step();
        const position = rigidBody.translation();
        cube.position.set(position.x, position.y, position.z);
    }

    function applyMovement() {
        // Aquí va la lógica para aplicar movimiento al cubo basado en inputs
        // Ejemplo con teclado:
        // let moveSpeed = 5;
        // if (keyW) rigidBody.applyImpulse(new RAPIER.Vector3(0, 0, -moveSpeed), true);
        // ...
    }

    // Retorno de todas las partes necesarias para interacción y renderizado
    return { scene, camera, renderer, controls, updatePhysics, applyMovement };
}
