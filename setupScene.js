import * as THREE from './modulos/three.module.js';
import { OrbitControls } from './modulos/OrbitControls.js';
import RAPIER from '@dimforge/rapier3d-compat';
import Joystick from './joystick.js'; // Asegúrate de que la ruta es correcta
import { createWorld, addGround, createDynamicBody, updatePhysics } from './physics.js';

export function setupScene(container) {
    // Configuración de Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 5);
    camera.lookAt(0, 0, 0);

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
    const world = createWorld();
    addGround(world);

    // Crear un suelo
    const groundColliderDesc = RAPIER.ColliderDesc.cuboid(10, 0.1, 10);
    world.createCollider(groundColliderDesc);

    // Crear una caja
    const cubeSize = { x: 1, y: 1, z: 1 };
    const cubePosition = { x: 0, y: 2, z: 0 };
    const rigidBody = createDynamicBody(world, cubePosition, cubeSize);

    // Visualización con Three.js
    const geometry = new THREE.BoxGeometry(cubeSize.x, cubeSize.y, cubeSize.z);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(cubePosition.x, cubePosition.y, cubePosition.z);
    scene.add(cube);

    // Crear y configurar el joystick
    const joystick = new Joystick({
        container: document.body, // Asegúrate de que el contenedor es correcto
        radius: 100, // Ajusta según tus necesidades
        innerRadius: 50,
        position: { x: 20, y: 20 } // Posición en la pantalla
    });

    // Funciones de actualización y control
    function updatePhysics() {
        world.step();
        const position = rigidBody.translation();
        cube.position.set(position.x, position.y, position.z);
    }

    function applyMovement() {
        const { x, y } = joystick.getPosition();
        const force = new RAPIER.Vector3(x * moveSpeed, 0, -y * moveSpeed);
        rigidBody.applyImpulse(force, true);
    }

    // Ajuste de la cámara al redimensionar la ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    // Retorno de todas las partes necesarias para interacción y renderizado
    return { scene, camera, renderer, controls, updatePhysics, applyMovement };
}
