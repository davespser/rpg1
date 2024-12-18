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
let world, modelo, body, collider;
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
        // Cargar terreno y texturas
const [terrainTexture, imageData] = await Promise.all([
    loadTexture(texturePath),
    cargarMapaDeAltura(heightMapPath),
]);

// Crear terreno
terrainMesh = createTerrain(imageData, terrainTexture);
terrainMesh.scale.set(1, 1, 1);
terrainMesh.position.set(0, 0, 0); // Ajusta la posición del terreno si es necesario
scene.add(terrainMesh);
console.log("Terreno añadido a la escena:", terrainMesh);

// Crear colisionador para el terreno
if (terrainMesh.geometry) {
    createTerrainRigidBody(terrainMesh, world);
    console.log("Colisionador del terreno creado.");
}

        // Cargar modelo con física
        const resultado = await cargarModelo(1, 1, 1, './negro.glb', world);
        modelo = resultado.modelo;
        body = resultado.body;
        collider = resultado.collider;
        scene.add(modelo);

        console.log("Modelo y cuerpo físico añadidos a la escena.");
        console.log("Posición inicial del cuerpo físico:", body.translation());

        // Apuntar la cámara al modelo
        camera.position.set(250, 10, 300); // Configura la posición de la cámara
        camera.lookAt(modelo.position);

        // Actualizar los controles de la cámara
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

    stepPhysics(); // Actualizar la física
    controls.update();
    renderer.render(scene, camera);

    if (body && modelo) {
        const translation = body.translation();
        const rotation = body.rotation();

        modelo.position.set(translation.x, translation.y, translation.z);
        modelo.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

        // Sincronizar el colisionador visual
        
        }
    }

    // Actualizar estadísticas
    // stats.update(); // Descomentarlo si lo necesitas


// Ejecutar la función principal
init();
