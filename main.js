// Importar Three.js, Cannon-es y otras dependencias
import * as THREE from 'three';  // Asegúrate de que THREE esté importado
// Importar Three.js, Cannon-es y otras dependencias
// Importar Three.js, Cannon-es y otras dependencias
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
if (!escena.cuboFisico || !escena.cubo) {
    console.error("El objeto 'cuboFisico' o 'cubo' no están definidos correctamente.");
    throw new Error("Error al inicializar el cubo físico o su representación.");
}

// Extraer los elementos de la escena
const { scene, camera, renderer, world, updatePhysics, cuboFisico, cubo } = escena;

// Variables para el joystick
let touchStartX = 0;
let touchStartY = 0;
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

    // Registrar las posiciones iniciales del toque
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

// Función para manejar el movimiento del joystick
function handleJoystickMove(event) {
    if (!joystick.active) return;

    // Calcular el desplazamiento
    const deltaX = event.touches[0].clientX - touchStartX;
    const deltaY = event.touches[0].clientY - touchStartY;

    // Mover el cubo en los ejes X y Z
    if (cubo && cubo.position) {
        cubo.position.x += deltaX * 0.01; // Control en X
        cubo.position.z -= deltaY * 0.01; // Control en Z (inverso para el eje Z)
    }

    // Actualizar las posiciones iniciales para el siguiente movimiento
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;

    // Actualizar la perilla del joystick
    joystick.deltaX = deltaX;
    joystick.deltaY = deltaY;

    knob.style.transform = `translate(${joystick.deltaX * 0.01}px, ${joystick.deltaY * 0.01}px)`;
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
function animate() {
    requestAnimationFrame(animate);

    // Actualizar físicas
    updatePhysics();

    // Renderizar la escena
    renderer.render(scene, camera);
}

// Iniciar el bucle de animación
animate();
