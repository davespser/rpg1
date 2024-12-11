import * as THREE from 'three';
import * as CANNON from 'cannon-es';  // Asegúrate de usar cannon-es, no cannon

import { crearTerreno } from './terreno.js';

// Función para crear la escena y el motor de físicas
export function crearEscena() {
    // Crear la escena de Three.js
    const scene = new THREE.Scene();

    // Crear la cámara
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Crear el renderer de Three.js
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Crear el mundo de físicas (Cannon.js)
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);  // gravedad en el eje Y

    // Crear el cubo (Three.js)
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Crear el cubo en Cannon.js (cuerpo físico)
    const cubeBody = new CANNON.Body({
        mass: 1,  // masa del cubo
        position: new CANNON.Vec3(0, 5, 0)  // posición inicial
    });
    cubeBody.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)));  // tamaño del cubo
    world.addBody(cubeBody);  // Agregar el cuerpo al mundo de físicas

    // Crear el terreno
    const terrenoBody = crearTerreno(world);

    // Posicionar la cámara
    camera.position.z = 10;

    // Función para actualizar la física
    function updatePhysics() {
        world.step(1 / 60);  // paso de simulación física (60 FPS)

        // Actualizar la posición del cubo en Three.js según la física de Cannon.js
        if (cubeBody.position) {
            cube.position.copy(cubeBody.position);
        }

        // Actualizar la rotación del cubo en Three.js
        if (cubeBody.rotation) {
            cube.rotation.copy(cubeBody.rotation);
        }
    }

    return { scene, camera, renderer, cube, world, cubeBody, updatePhysics };
}
