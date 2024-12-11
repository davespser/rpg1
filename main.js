// Importar Three.js, Cannon-es y otras dependencias
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


// Asegurar que 'world' y las demás dependencias existan
if (!world || !updatePhysics || !cuboFisico) {
    console.error("El objeto 'world', 'updatePhysics' o 'cuboFisico' no están definidos correctamente.");
    throw new Error("No se pudo iniciar la aplicación debido a un problema con la escena o el mundo físico.");
}

// Variables para el joystick
let joystick = {
    active: false,
    deltaX: 0,
    deltaY: 0,
};

// Configuración del joystick en CSS
const stick = document.getElementById('stick');
const joystickContainer = document.getElementById('joystick-container');
let joystickRect, stickRect;

// Función para manejar el inicio del movimiento del joystick
function handleJoystickStart(event) {
    event.preventDefault();
    joystick.active = true;
    joystickRect = joystickContainer.getBoundingClientRect();
    stickRect = stick.getBoundingClientRect();
}

// Función para manejar el movimiento del joystick
function handleJoystickMove(event) {
    if (!joystick.active) return;

    const touch = event.touches[0] || event.changedTouches[0];
    const x = touch.clientX - joystickRect.left - stickRect.width / 2;
    const y = touch.clientY - joystickRect.top - stickRect.height / 2;

    const maxDistance = joystickRect.width / 2;
    const distance = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x);

    if (distance > maxDistance) {
        joystick.deltaX = Math.cos(angle) * maxDistance;
        joystick.deltaY = Math.sin(angle) * maxDistance;
    } else {
        joystick.deltaX = x;
        joystick.deltaY = y;
    }

    stick.style.transform = `translate(${joystick.deltaX}px, ${joystick.deltaY}px)`;
}

// Función para manejar el fin del movimiento del joystick
function handleJoystickEnd() {
    joystick.active = false;
    joystick.deltaX = 0;
    joystick.deltaY = 0;
    stick.style.transform = 'translate(0, 0)';
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

    // Movimiento basado en el joystick
    if (joystick.active) {
        const fuerza = config.joystick.sensibilidad * 100; // Magnitud de la fuerza
        cuboFisico.applyForce(
            new CANNON.Vec3(
                (joystick.deltaX / joystickRect.width) * fuerza,
                0,
                -(joystick.deltaY / joystickRect.height) * fuerza
            ),
            cuboFisico.position
        );
    }

    // Renderizar la escena
    renderer.render(scene, camera);
}

// Iniciar el bucle de animación
animate();
