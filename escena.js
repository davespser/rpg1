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

    // Crear el mundo físico con Cannon-es
    const world = crearMundoFisico();

    // Agregar luces a la escena
    const luces = crearLuces(scene, config.luces.intensidad);

    // Crear el terreno y su cuerpo físico
    const { terrenoMesh, terrenoBody } = crearTerreno(scene, world);

    // Crear el cubo y su cuerpo físico
    const cubo = crearCubo(config.objetos.cubo.tamaño);
    cubo.position.set(0, 5, 0); // Inicializar posición del cubo en la escena
    scene.add(cubo);

    const cuboFisico = crearCuboFisico();
    world.addBody(cuboFisico);

    // Crear cámara con seguimiento al cubo
    const { camera, actualizarCamara } = crearCamara(cubo);

    // Configurar el renderer
    const renderer = new THREE.WebGLRenderer({ antialias: config.render.antialias });
    renderer.shadowMap.enabled = true; // Habilitar sombras
    renderer.setSize(config.render.width, config.render.height);
    renderer.setClearColor(config.render.clearColor);
    document.body.appendChild(renderer.domElement);

    // Crear controles de cámara (opcional)
    const controles = crearControles(camera, renderer);

    // Crear interfaz de usuario
    const ui = crearUI();

    // Iniciar joystick para mover el cubo
    iniciarJoystick(cubo, scene, camera, renderer);

    // Función de actualización de la física
    function updatePhysics() {
        // Avanzar la simulación de física (60 fps)
        world.step(1 / 60);

        // Sincronizar posición y rotación del cubo con su cuerpo físico
        cubo.position.copy(cuboFisico.position);
        cubo.quaternion.copy(cuboFisico.quaternion);

        // Actualizar cámara y controles
        actualizarCamara();
        controles.update();

        // Actualizar la interfaz de usuario con la velocidad del cubo
        actualizarVelocidad(cuboFisico.velocity.length());
    }

    // Retornar los elementos necesarios para animar y renderizar la escena
    return { scene, camera, renderer, world, updatePhysics };
}
