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
    // Crear escena y mundo físico
    const scene = new THREE.Scene();
    const world = crearMundoFisico();

    // Crear luces y terreno
    const luces = crearLuces(scene, config.luces.intensidad);
    const { terrenoMesh, terrenoBody } = crearTerreno(scene, world);

    // Crear cubo y su cuerpo físico
    const cubo = crearCubo(config.objetos.cubo.tamaño);
    cubo.position.set(0, 5, 0);  // Posicionar el cubo en la escena
    scene.add(cubo);

    const cuboFisico = crearCuboFisico();
    world.addBody(cuboFisico);

    // Crear cámara
    const { camera, actualizarCamara } = crearCamara(cubo);

    // Configurar el renderer
    const renderer = new THREE.WebGLRenderer({ antialias: config.render.antialias });
    renderer.shadowMap.enabled = true;
    renderer.setSize(config.render.width, config.render.height);
    renderer.setClearColor(config.render.clearColor);
    document.body.appendChild(renderer.domElement);

    // Crear controles de cámara
    const controles = crearControles(camera, renderer);

    // Crear la interfaz de usuario
    const ui = crearUI();

    // Iniciar joystick para controlar el cubo
    iniciarJoystick(cubo, scene, camera, renderer);

    // Función de actualización de la física
    function updatePhysics() {
        world.step(1 / 60);  // Avanzar la simulación de física

        // Sincronizar la posición y rotación del cubo con su cuerpo físico
        cubo.position.copy(cuboFisico.position);
        cubo.quaternion.copy(cuboFisico.quaternion);

        // Actualizar cámara y controles
        actualizarCamara();
        controles.update();

        // Actualizar la UI con la velocidad del cubo
        actualizarVelocidad(cuboFisico.velocity.length());
    }

    // Retornar los elementos necesarios para la escena
    return { scene, camera, renderer, world, updatePhysics };
}
