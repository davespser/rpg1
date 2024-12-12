import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { crearEscena } from './escena.js';
import { config } from './config.js';

// Crear la escena de Three.js
const escena = crearEscena();

if (!escena.cubo || !escena.cuboFisico) {
    console.error("El objeto 'cubo' o 'cuboFisico' no está definido correctamente.");
    throw new Error("Error al inicializar el personaje.");
}

const { scene, camera, renderer, updatePhysics, cubo, cuboFisico } = escena;

// Variables del joystick
let joystick = { active: false, deltaX: 0, deltaY: 0 };

// Elementos del DOM para el joystick
const joystickContainer = document.getElementById('joystick-container');
const joystickElement = document.getElementById('joystick');
const knob = document.querySelector('#joystick .knob');
let joystickRect;

// Eventos del joystick
function handleJoystickStart(event) {
    console.log("Joystick iniciado.");
    joystick.active = true;
    joystickRect = joystickContainer.getBoundingClientRect();
    knob.style.transform = 'translate(0, 0)';
}

function handleJoystickMove(event) {
    if (!joystick.active) return;

    const touch = event.touches[0];
    const x = touch.clientX - joystickRect.left - joystickRect.width / 2;
    const y = touch.clientY - joystickRect.top - joystickRect.height / 2;

    const maxDistance = joystickRect.width / 2;
    const distance = Math.min(Math.sqrt(x * x + y * y), maxDistance);
    const angle = Math.atan2(y, x);

    joystick.deltaX = Math.cos(angle) * distance;
    joystick.deltaY = Math.sin(angle) * distance;

    knob.style.transform = `translate(${joystick.deltaX}px, ${joystick.deltaY}px)`;

    console.log(`Joystick movido: deltaX=${joystick.deltaX}, deltaY=${joystick.deltaY}`);
}

function handleJoystickEnd() {
    console.log("Joystick terminado.");
    joystick.active = false;
    joystick.deltaX = 0;
    joystick.deltaY = 0;
    knob.style.transform = 'translate(0, 0)';
}

// Agregar eventos al joystick
joystickContainer.addEventListener('touchstart', handleJoystickStart);
joystickContainer.addEventListener('touchmove', handleJoystickMove);
joystickContainer.addEventListener('touchend', handleJoystickEnd);

// Función para mover el cubo físico y sincronizarlo con el visual
function moverCubo() {
    if (joystick.active) {
        const fuerza = (config.joystick.sensibilidad || 20) * 20; // Ajusta la fuerza para que no sea tan grande
        const fuerzaX = (joystick.deltaX / joystickRect.width) * fuerza;
        const fuerzaZ = -(joystick.deltaY / joystickRect.height) * fuerza;

        // Depuración de las fuerzas
        console.log(`Joystick activo: deltaX=${joystick.deltaX}, deltaY=${joystick.deltaY}`);
        console.log(`Fuerzas calculadas: fuerzaX=${fuerzaX}, fuerzaZ=${fuerzaZ}`);

        if (Math.abs(fuerzaX) > 0.1 || Math.abs(fuerzaZ) > 0.1) {
            // Aplicar fuerzas significativas
            cuboFisico.applyForce(
                new CANNON.Vec3(fuerzaX, 0, fuerzaZ),
                cuboFisico.position
            );
        }

        // Limitar la rotación del cubo
        if (fuerzaX !== 0 || fuerzaZ !== 0) {
            const angulo = Math.atan2(fuerzaZ, fuerzaX);
            cubo.rotation.y = -angulo;  // Rotación solo en el eje Y
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Mover el cubo basado en el joystick
    moverCubo();

    // Actualizar la simulación física
    updatePhysics();

    // Sincronizar el cubo visual con el cubo físico
    cubo.position.copy(cuboFisico.position);
    cubo.quaternion.copy(cuboFisico.quaternion);

    // Mostrar la posición del cubo en consola
    console.log(`Posición del cubo: x=${cubo.position.x.toFixed(4)}, y=${cubo.position.y.toFixed(4)}, z=${cubo.position.z.toFixed(4)}`);

    // Renderizar la escena
    renderer.render(scene, camera);
}
animate();
