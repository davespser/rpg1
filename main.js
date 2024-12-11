// Importar Three.js, Cannon-es y otras dependencias
import * as CANNON from 'cannon-es';
import { crearEscena } from './escena.js';
import { config } from './config.js';

// Crear la escena de Three.js y la física de Cannon
const escena = crearEscena();

// Verificar que los objetos requeridos estén definidos
if (!escena.world) {
    console.error("El objeto 'world' no está definido correctamente.");
    throw new Error("Error al inicializar el mundo físico.");
}
if (!escena.updatePhysics) {
    console.error("La función 'updatePhysics' no está definida correctamente.");
    throw new Error("Error al inicializar la lógica de físicas.");
}
if (!escena.cuboFisico) {
    console.error("El objeto 'cuboFisico' no está definido correctamente.");
    throw new Error("Error al inicializar el cubo físico.");
}

// Extraer los elementos de la escena
const { scene, camera, renderer, world, updatePhysics, cuboFisico } = escena;

// Variables para el joystick
// Variables del joystick
let joystick = {
    active: false,
    deltaX: 0,
    deltaY: 0,
};

// Elementos del DOM
const joystickContainer = document.getElementById('joystick-container');
const joystickElement = document.getElementById('joystick');
const knob = document.querySelector('#joystick .knob');
let joystickRect, knobRect;

// Función para manejar el inicio del movimiento del joystick
function handleJoystickStart(event) {
    event.preventDefault();
    joystick.active = true;
    joystickRect = joystickElement.getBoundingClientRect();
    knobRect = knob.getBoundingClientRect();
}

// Función para manejar el movimiento del joystick
function handleJoystickMove(event) {
    if (!joystick.active) return;

    const touch = event.touches[0] || event.changedTouches[0];
    const x = touch.clientX - joystickRect.left - knobRect.width / 2;
    const y = touch.clientY - joystickRect.top - knobRect.height / 2;

    const maxDistance = joystickRect.width / 2;
    const distance = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x);

    // Limitar la perilla al radio máximo
    if (distance > maxDistance) {
        joystick.deltaX = Math.cos(angle) * maxDistance;
        joystick.deltaY = Math.sin(angle) * maxDistance;
    } else {
        joystick.deltaX = x;
        joystick.deltaY = y;
    }

    knob.style.transform = `translate(${joystick.deltaX}px, ${joystick.deltaY}px)`;
}

// Función para manejar el fin del movimiento del joystick
function handleJoystickEnd() {
    joystick.active = false;
    joystick.deltaX = 0;
    joystick.deltaY = 0;
    knob.style.transform = 'translate(0, 0)';
}

// Agregar eventos al joystick
joystickContainer.addEventListener('touchstart', handleJoystickStart);
joystickContainer.addEventListener('touchmove', handleJoystickMove);
joystickContainer.addEventListener('touchend', handleJoystickEnd);
// Función de animación
//Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Actualizar físicas
    updatePhysics();

    // Movimiento basado en el joystick
    if (joystick.active) {
        const fuerza = config.joystick.sensibilidad * 100; // Magnitud de la fuerza

        // Dirección de movimiento (en base a la dirección del joystick)
        const direction = new THREE.Vector3(
            joystick.deltaX / joystickRect.width,
            0,  // No afectamos la altura, ya que el cubo se mueve en el plano
            -(joystick.deltaY / joystickRect.height)
        );

        // Asegurarse de que el cubo siempre se mueva en la dirección de la entrada
        direction.normalize(); // Normalizamos para que la velocidad sea constante

        // Mover el cubo según la dirección calculada (sin afectación de rotación no deseada)
        cubo.position.x += direction.x * fuerza * 0.1;
        cubo.position.z += direction.z * fuerza * 0.1;

        // Hacer que la cámara siga al cubo
        camera.position.lerp(cubo.position.clone().add(new THREE.Vector3(0, 2, 10)), 0.1);
        camera.lookAt(cubo.position);

        // Asegurarse de que el cubo esté mirando hacia la dirección de movimiento
        const angle = Math.atan2(direction.x, direction.z);
        cubo.rotation.y = angle;  // Rotar solo en el eje Y para orientación
    }

    // Renderizar la escena
    renderer.render(scene, camera);
}
