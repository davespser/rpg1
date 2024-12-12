import * as THREE from 'three';
import { config } from './config.js';
import { crearMundoFisico } from './fisicas.js';
import { crearCuboFisico } from './cuerpos.js';
import { crearTerreno } from './terreno.js';
import { crearCamara } from './camara.js';
import { crearControles } from './controles.js';
import { crearLuces } from './luces.js';
import { crearUI, actualizarVelocidad } from './ui.js';
import { iniciarJoystick } from './joystick.js';

export function crearEscena() {
    // Crear escena de Three.js
    const scene = new THREE.Scene();

    // Crear el mundo físico con Cannon-es
    const world = crearMundoFisico();

    // Agregar luces a la escena
    crearLuces(scene, config.luces.intensidad);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Crear terreno y su cuerpo físico
    const { terrenoMesh, terrenoBody } = crearTerreno(scene, world);

    // Crear cubo visual y físico
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cubo = new THREE.Mesh(geometry, material);
    cubo.position.set(0, 5, 0);
    scene.add(cubo);

    const cuboFisico = crearCuboFisico();
    world.addBody(cuboFisico);

    // Crear cámara que sigue al cubo
    const { camera, actualizarCamara } = crearCamara(cubo);

    // Configurar el renderer
    const renderer = new THREE.WebGLRenderer({ antialias: config.render.antialias });
    renderer.shadowMap.enabled = true; // Sombras
    renderer.setSize(config.render.width, config.render.height);
    renderer.setClearColor(config.render.clearColor);
    document.body.appendChild(renderer.domElement);

    // Crear controles de cámara (opcional)
    const controles = crearControles(camera, renderer);

    // Crear la interfaz de usuario
    crearUI();

    // Iniciar joystick
    iniciarJoystick(cubo, scene, camera, renderer);

    // Función de actualización de física
    function updatePhysics() {
        // Avanzar la simulación de física (60 fps)
        world.step(1 / 60);

        // Sincronizar el cubo físico con el visual
        cubo.position.copy(cuboFisico.position);
        cubo.quaternion.copy(cuboFisico.quaternion);

        // Actualizar cámara y controles
        actualizarCamara();
        controles.update();

        // Actualizar la UI con la velocidad del cubo
        actualizarVelocidad(cuboFisico.velocity.length());
    }

    // Retornar los elementos esenciales de la escena
    return { scene, camera, renderer, world, updatePhysics, cuboFisico, cubo };
}
