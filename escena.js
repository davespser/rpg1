import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { crearTerreno } from './terreno.js';
import { crearCamara } from './camara.js';
import { crearControles } from './controles.js';
import { crearLuces } from './luces.js';
import { crearCubo, crearEsfera } from './objetos.js'; // Importar objetos

export function crearEscena() {
    // Crear escena
    const scene = new THREE.Scene();

    // Crear el mundo físico
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // Añadir luces a la escena
    const luces = crearLuces(scene);

    // Crear terreno
    const { terrenoMesh, terrenoBody } = crearTerreno(scene, world);

    // Crear objetos
    const cubo = crearCubo();
    cubo.position.set(0, 5, 0); // Posicionar el cubo
    scene.add(cubo);

    const esfera = crearEsfera();
    esfera.position.set(2, 5, 0); // Posicionar la esfera
    scene.add(esfera);

    // Crear cámara y controles
    const { camera, actualizarCamara } = crearCamara(cubo); // Seguimos al cubo
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controles = crearControles(camera, renderer);

    // Actualización de físicas
    function updatePhysics() {
        world.step(1 / 60);

        // Actualizar la cámara
        actualizarCamara();

        // Actualizar controles
        controles.update();
    }

    return { scene, camera, renderer, updatePhysics };
}
