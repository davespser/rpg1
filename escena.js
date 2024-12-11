// escena.js

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
import { iniciarJoystick } from './joystick.js';  // Importar el joystick

// Esta es la función que estás exportando
export function crearEscena() {
    const scene = new THREE.Scene();
    const world = crearMundoFisico();

    const luces = crearLuces(scene, config.luces.intensidad);
    const { terrenoMesh, terrenoBody } = crearTerreno(scene, world);

    const cubo = crearCubo(config.objetos.cubo.tamaño);
    cubo.position.set(0, 5, 0);
    scene.add(cubo);

    const cuboFisico = crearCuboFisico();
    world.addBody(cuboFisico);

    const { camera, actualizarCamara } = crearCamara(cubo);

    const renderer = new THREE.WebGLRenderer({ antialias: config.render.antialias });
    renderer.shadowMap.enabled = true;
    renderer.setSize(config.render.width, config.render.height);
    renderer.setClearColor(config.render.clearColor);
    document.body.appendChild(renderer.domElement);

    const controles = crearControles(camera, renderer);

    const ui = crearUI();

    iniciarJoystick(cubo, scene, camera, renderer);

    function updatePhysics() {
        world.step(1 / 60);

        cubo.position.copy(cuboFisico.position);
        cubo.quaternion.copy(cuboFisico.quaternion);

        actualizarCamara();
        controles.update();

        actualizarVelocidad(cuboFisico.velocity.length());
    }

    return { scene, camera, renderer, world, updatePhysics };
}
