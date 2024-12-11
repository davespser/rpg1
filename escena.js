import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { crearTerreno } from './terreno.js';
import { crearCamara } from './camara.js';
import { crearControles } from './controles.js';
import { crearLuces } from './luces.js'; // Importar las luces

export function crearEscena() {
    // Crear escena
    const scene = new THREE.Scene();

    // Crear el mundo físico
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // Añadir luces a la escena
    const luces = crearLuces(scene);

    // Crear el terreno
    const { terrenoMesh, terrenoBody } = crearTerreno(scene, world);

    // Crear un cubo dinámico como ejemplo
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true; // El cubo proyecta sombra
    cube.receiveShadow = true; // El cubo recibe sombra
    scene.add(cube);

    const cubeBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 5, 0),
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
    });
    world.addBody(cubeBody);

    // Crear cámara y controles
    const { camera, actualizarCamara } = crearCamara(cube);
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true; // Activar el mapa de sombras
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Suavizar sombras
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controles = crearControles(camera, renderer); // Añadir controles

    // Actualización de físicas
    function updatePhysics() {
        world.step(1 / 60);

        // Actualizar las posiciones en Three.js
        cube.position.copy(cubeBody.position);
        cube.quaternion.copy(cubeBody.quaternion);

        // Actualizar la cámara
        actualizarCamara();

        // Actualizar los controles
        controles.update();
    }

    return { scene, camera, renderer, updatePhysics };
}
