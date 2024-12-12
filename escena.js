import * as THREE from './modulos/three.module.js';
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.12.0';
import { config } from './config.js';
import { crearMundoFisico } from './fisicas.js';
import { crearTerreno } from './terreno.js';
import { crearCamara } from './camara.js';
import { crearControles } from './controles.js';
import { crearUI, actualizarVelocidad } from './ui.js';
import { iniciarJoystick } from './joystick.js';

export async function crearEscena() {
    // Inicializar RAPIER
    await RAPIER.init();

    // Crear escena Three.js
    const scene = new THREE.Scene();
    const world = crearMundoFisico();

    // Crear luces
    crearLuces(scene, config.luces.intensidad);

    // Crear terreno
    const { terrenoMesh } = crearTerreno(scene, world);

    // Crear cubo
    const cuboGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cuboMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cubo = new THREE.Mesh(cuboGeometry, cuboMaterial);
    cubo.position.set(0, 5, 0);
    scene.add(cubo);

    // Crear cuerpo físico del cubo
    const cuboRigidBody = world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5.5, 0)
    );
    world.createCollider(RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5), cuboRigidBody);

    // Crear cámara y controles
    const { camera, actualizarCamara } = crearCamara(cubo);
    const renderer = new THREE.WebGLRenderer({ antialias: config.render.antialias });
    renderer.setSize(config.render.width, config.render.height);
    document.body.appendChild(renderer.domElement);

    const controles = crearControles(camera, renderer);
    crearUI();
    const joystick = iniciarJoystick(cubo, scene, camera, renderer);

    // Animación
    function animate() {
        requestAnimationFrame(animate);
        moverCubo();
        updatePhysics();
        renderer.render(scene, camera);
    }

    function moverCubo() {
    if (joystick && joystick.active) {
        const velocidadMaxima = 5;  // Velocidad máxima
        const velocidadX = (joystick.deltaX / joystickRect.width) * velocidadMaxima;
        const velocidadZ = -(joystick.deltaY / joystickRect.height) * velocidadMaxima;

        // Establecer velocidad en el cuerpo físico
        cuboRigidBody.setLinvel({ x: velocidadX, y: 0, z: velocidadZ }, true);

        if (joystick.deltaX !== 0 || joystick.deltaY !== 0) {
            // Calcular ángulo de rotación
            const angulo = Math.atan2(velocidadZ, velocidadX);
            cubo.rotation.y = -angulo;  // Ajustar orientación del cubo visual
        }
    }
    }
    function updatePhysics() {
    world.step();

    // Sincronizar posiciones del cubo visual con su cuerpo físico
    const cuboPosition = cuboRigidBody.translation();
    const cuboRotation = cuboRigidBody.rotation();

    cubo.position.set(cuboPosition.x, cuboPosition.y, cuboPosition.z);
    cubo.quaternion.set(cuboRotation.x, cuboRotation.y, cuboRotation.z, cuboRotation.w);

    // Actualizar la cámara, controles y UI
    actualizarCamara();
    controles.update();
    actualizarVelocidad(cuboRigidBody.linvel().length());
    }

    animate();
}
