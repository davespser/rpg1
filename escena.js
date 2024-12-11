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

export function crearEscena() {
    const scene = new THREE.Scene();
    const world = crearMundoFisico();

    // Añadir luces a la escena
    const luces = crearLuces(scene, config.luces.intensidad);

    // Crear terreno
    const { terrenoMesh, terrenoBody } = crearTerreno(scene, world);

    // Crear cubo
    const cubo = crearCubo(config.objetos.cubo.tamaño);
    cubo.position.set(0, 5, 0);  // Posicionar el cubo
    scene.add(cubo);

    // Crear cubo físico y añadirlo al mundo
    const cuboFisico = crearCuboFisico();
    world.addBody(cuboFisico);

    // Crear cámara y configurarla
    const { camera, actualizarCamara } = crearCamara(config.camera);

    // Configuración de renderizado
    const renderer = new THREE.WebGLRenderer({ antialias: config.render.antialias });
    renderer.shadowMap.enabled = true;
    renderer.setSize(config.render.width, config.render.height);
    renderer.setClearColor(config.render.clearColor);
    document.body.appendChild(renderer.domElement);

    // Crear controles de cámara
    const controles = crearControles(camera, renderer);

    // Crear UI
    const ui = crearUI();

    // Iniciar joystick
    iniciarJoystick(cubo, scene, camera, renderer);  // El cubo debe estar bien inicializado

    // Actualización de físicas y renderizado
    function updatePhysics() {
        world.step(1 / 60);

        // Actualizar posiciones de objetos 3D
        cubo.position.copy(cuboFisico.position);
        cubo.quaternion.copy(cuboFisico.quaternion);

        // Actualizar cámara y controles
        actualizarCamara();
        controles.update();

        // Actualizar velocidad
        actualizarVelocidad(cuboFisico.velocity.length());
    }

    return { scene, camera, renderer, world, updatePhysics };
}
