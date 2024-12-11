import * as THREE from 'three';
import { crearMundoFisico } from './fisicas.js';
import { crearCuboFisico, crearEsferaFisica } from './cuerpos.js';
import { crearTerreno } from './terreno.js';
import { crearCamara } from './camara.js';
import { crearControles } from './controles.js';
import { crearLuces } from './luces.js';
import { crearCubo, crearEsfera } from './objetos.js'; // Importar objetos

export function crearEscena() {
    // Crear escena de Three.js
    const scene = new THREE.Scene();

    // Crear mundo físico
    const world = crearMundoFisico();  // Crear el mundo físico

    // Añadir luces a la escena
    const luces = crearLuces(scene);

    // Crear terreno
    const { terrenoMesh, terrenoBody } = crearTerreno(scene, world);

    // Crear objetos 3D y sus cuerpos físicos
    const cubo = crearCubo();
    cubo.position.set(0, 5, 0); // Posicionar el cubo
    scene.add(cubo);

    const cuboFisico = crearCuboFisico();
    world.addBody(cuboFisico); // Añadir el cuerpo físico al mundo

    const esfera = crearEsfera();
    esfera.position.set(2, 5, 0); // Posicionar la esfera
    scene.add(esfera);

    const esferaFisica = crearEsferaFisica();
    world.addBody(esferaFisica); // Añadir el cuerpo físico al mundo

    // Crear cámara y controles
    const { camera, actualizarCamara } = crearCamara(cubo); // Seguimos al cubo
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controles = crearControles(camera, renderer);

    // Actualización de físicas y renderizado
    function updatePhysics() {
        world.step(1 / 60); // Avanza el mundo físico

        // Actualizar las posiciones de los objetos 3D con las posiciones de los cuerpos físicos
        cubo.position.copy(cuboFisico.position);
        cubo.quaternion.copy(cuboFisico.quaternion);

        esfera.position.copy(esferaFisica.position);
        esfera.quaternion.copy(esferaFisica.quaternion);

        // Actualizar la cámara y controles
        actualizarCamara();
        controles.update();
    }

    return { scene, camera, renderer, updatePhysics };
}
