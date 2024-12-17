import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import RAPIER from '@dimforge/rapier3d-compat';
import { initScene } from './scene.js';
import { crearMenuEstadisticas } from './menu.js';
import { Stats } from './stats.js';
import { initPhysics, createTerrainRigidBody, stepPhysics } from './physics.js';
import { loadTexture, createTerrain } from './createTerrain.js';
import { createSky } from './sky.js';
import { cargarModelo } from './objetos.js'; // Importar la función para cargar el modelo

// Declaración de variables globales
let world, modelo, body;
let terrainMesh; // Guardar el terreno cargado

// Inicialización de la escena y estadísticas
const { scene, camera, renderer, controls } = initScene();
const stats = new Stats();
crearMenuEstadisticas();
createSky(scene);

// Rutas de las texturas y mapas
const texturePath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa_t.jpg';
const heightMapPath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa.png';

// Función principal de inicialización
async function init() {
    try {
        // Inicializar física
        world = await initPhysics();
        console.log('Mundo de física inicializado:', world);

        // Cargar terreno y texturas
        const [terrainTexture, imageData] = await Promise.all([
            loadTexture(texturePath), // Cargar textura
            cargarMapaDeAltura(heightMapPath),
        ]);

        terrainMesh = createTerrain(imageData, terrainTexture);
        scene.add(terrainMesh);
        createTerrainRigidBody(terrainMesh, world);

        // Cargar modelo
        // Cargar modelo
const resultado = await cargarModelo(250, 24, 250, './negro.glb', world);
modelo = resultado.modelo;
body = resultado.body;
scene.add(modelo);

// Apuntar la cámara al modelo
camera.position.set(250, 30, 280); // Configura la posición de la cámara
camera.lookAt(modelo.position);   // La cámara mira hacia la posición del modelo

// Actualizar los controles de la cámara (si usas OrbitControls)
controls.target.copy(modelo.position);
controls.update();

        // Iniciar la animación
        animate();
    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
}

// Función para cargar el mapa de altura
function cargarMapaDeAltura(path) {
    return new Promise((resolve, reject) => {
        new THREE.TextureLoader().load(
            path,
            (texture) => {
                const canvas = document.createElement('canvas');
                canvas.width = texture.image.width;
                canvas.height = texture.image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(texture.image, 0, 0);
                resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
            },
            undefined,
            (err) => {
                console.error(`Error al cargar el mapa de altura desde ${path}:`, err);
                reject(err);
            }
        );
    });
}

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    stepPhysics(world); // Actualizar la física
    controls.update();
    renderer.render(scene, camera);

    // Sincronización del modelo con la física
    if (body && modelo) {
        const translation = body.translation();
        const rotation = body.rotation();
        modelo.position.set(translation.x, translation.y, translation.z);
        modelo.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    }

    // Actualizar estadísticas
    // stats.modificarVida(-0.1); // Ejemplo de daño gradual
}

// Ejecutar la función principal
init();
