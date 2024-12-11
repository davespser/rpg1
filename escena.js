// Archivo: escena.js

import * as THREE from 'three';
import { config } from './config.js';
import { crearMundoFisico } from './fisicas.js';
import { crearCuboFisico, crearEsferaFisica } from './cuerpos.js';
import { crearTerreno } from './terreno.js';
import { crearCamara } from './camara.js';
import { crearControles } from './controles.js';
import { crearLuces } from './luces.js';
import { crearCubo, crearEsfera } from './objetos.js';
import { crearUI, actualizarVelocidad } from './ui.js';
import { iniciarJoystick } from './joystick.js'; // Importar el joystick

export function crearEscena() {
    // Crear escena de Three.js
    const scene = new THREE.Scene();

    // Crear mundo físico
    const world = crearMundoFisico();

    // Añadir luces a la escena
    crearLuces(scene, config.luces.intensidad);

    // Crear terreno
    const { terrenoMesh, terrenoBody } = crearTerreno(scene, world);

    // Crear cubo
    const cubo = crearCubo(config.objetos.cubo.tamaño);
    cubo.position.set(0, 5, 0); // Posicionar el cubo
    scene.add(cubo);

    // Añadir cubo físico al mundo
    const cuboFisico = crearCuboFisico();
    world.addBody(cuboFisico);

    // Crear cámara (se pasa el cubo como objeto seguido)
    const { camera, actualizarCamara } = crearCamara(cubo);

    // Configuración del render
    const renderer = new THREE.WebGLRenderer({ antialias: config.render.antialias });
    renderer.shadowMap.enabled = true;
    renderer.setSize(config.render.width, config.render.height);
    renderer.setClearColor(config.render.clearColor);
    document.body.appendChild(renderer.domElement);

    // Crear controles de cámara
    const controles = crearControles(camera, renderer);

    // Crear interfaz de usuario
    crearUI();

    // Iniciar el joystick
    iniciarJoystick(cubo, scene, camera, renderer);

    // Actualización de físicas y renderizado
    function updatePhysics() {
        world.step(1 / 60); // Avanza el mundo físico

        // Actualizar las posiciones de los objetos 3D con las posiciones de los cuerpos físicos
        cubo.position.copy(cuboFisico.position);
        cubo.quaternion.copy(cuboFisico.quaternion);

        // Actualizar la cámara y controles
        actualizarCamara(); // La cámara sigue al cubo
        controles.update();

        // Mostrar la velocidad del cubo en la UI
        actualizarVelocidad(cuboFisico.velocity.length());
    }

    // Retornar todos los objetos necesarios
    return { scene, camera, renderer, world, updatePhysics, cubo };
}
