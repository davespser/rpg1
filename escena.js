import * as THREE from 'three';
import * as CANNON from 'cannon-es';
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
    const scene = new THREE.Scene();
    const world = crearMundoFisico();

    // Crear luces
    crearLuces(scene, config.luces.intensidad);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Crear el terreno
    const { terrenoMesh, terrenoBody } = crearTerreno(scene, world);

    // Crear cubo visual y físico
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cubo = new THREE.Mesh(geometry, material);
    cubo.position.set(0, 5, 0);
    scene.add(cubo);

    // Configuración del material físico para el cubo
    const materialCubo = new CANNON.Material();
    const contactoMaterial = new CANNON.ContactMaterial(materialCubo, materialCubo, {
        friction: 0.01,  // Baja la fricción para facilitar el movimiento
        restitution: 0.3
    });
    world.addContactMaterial(contactoMaterial);

    const cuboFisico = crearCuboFisico(materialCubo);
    world.addBody(cuboFisico);

    // Crear cubo de referencia
    const geometry2 = new THREE.BoxGeometry(1, 1, 1);
    const material2 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const cuboReferencia = new THREE.Mesh(geometry2, material2);
    cuboReferencia.position.set(5, 5, 0);
    scene.add(cuboReferencia);

    const cuboReferenciaFisico = crearCuboFisico();
    cuboReferenciaFisico.position.set(5, 5, 0);
    world.addBody(cuboReferenciaFisico);

    // Crear cámara y controles
    const { camera, actualizarCamara } = crearCamara(cubo);
    const renderer = new THREE.WebGLRenderer({ antialias: config.render.antialias });
    renderer.shadowMap.enabled = true;
    renderer.setSize(config.render.width, config.render.height);
    renderer.setClearColor(config.render.clearColor);
    document.body.appendChild(renderer.domElement);

    const controles = crearControles(camera, renderer);

    // Crear la interfaz de usuario y el joystick
    crearUI();
    let joystick = iniciarJoystick(cubo, scene, camera, renderer);  // Asegúrate de inicializar el joystick

    // Función para actualizar la física
    function updatePhysics() {
        world.step(1 / 60);

        cubo.position.copy(cuboFisico.position);
        cubo.quaternion.copy(cuboFisico.quaternion);

        cuboReferencia.position.copy(cuboReferenciaFisico.position);
        cuboReferencia.quaternion.copy(cuboReferenciaFisico.quaternion);

        actualizarCamara();
        controles.update();

        // Actualizar la velocidad en la UI
        actualizarVelocidad(cuboFisico.velocity.length());
    }

    // Función para mover el cubo usando el joystick
    function moverCubo() {
        if (joystick && joystick.active) {
            const velocidadMaxima = 10;  // Reducir la velocidad máxima
            const velocidadX = (joystick.deltaX / joystickRect.width) * velocidadMaxima;
            const velocidadZ = -(joystick.deltaY / joystickRect.height) * velocidadMaxima;

            // Verificar si los valores del joystick están cambiando correctamente
            console.log("Joystick moved: deltaX =", joystick.deltaX, "deltaY =", joystick.deltaY);

            // Establecer la velocidad directamente en el cubo físico
            cuboFisico.velocity.x = velocidadX;
            cuboFisico.velocity.z = velocidadZ;

            if (joystick.deltaX !== 0 || joystick.deltaY !== 0) {
                // Calcular el ángulo de rotación en función de la dirección del joystick
                const angulo = Math.atan2(velocidadZ, velocidadX);
                cubo.rotation.y = -angulo;  // Ajustar la orientación
                console.log("Rotating cubo: rotation.y =", cubo.rotation.y);
            }
        }
    }

    // Función de animación
    function animate() {
        requestAnimationFrame(animate);
        moverCubo();
        updatePhysics();
        renderer.render(scene, camera);
    }

    animate();

    return { scene, camera, renderer, world, updatePhysics, cuboFisico, cubo, cuboReferenciaFisico, cuboReferencia };
}
