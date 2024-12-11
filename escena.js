import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { crearTerreno } from './terreno.js';
import { crearCamara } from './camara.js';

export function crearEscena() {
    // Crear escena
    const scene = new THREE.Scene();

    // Crear mundo de físicas
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // Crear el terreno
    const { terrenoMesh, terrenoBody } = crearTerreno(scene, world);

    // Crear un cubo como ejemplo de objeto dinámico
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    const cubeBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 5, 0),
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
    });
    world.addBody(cubeBody);

    // Crear cámara en tercera persona
    const { camera, actualizarCamara } = crearCamara(cube);

    // Crear renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Actualización de físicas
    function updatePhysics() {
        world.step(1 / 60);

        // Actualizar posiciones y rotaciones en la escena
        cube.position.copy(cubeBody.position);
        cube.quaternion.copy(cubeBody.quaternion);

        // Actualizar cámara
        actualizarCamara();
    }

    return { scene, camera, renderer, updatePhysics };
}
