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

// Inicialización de la escena y estadísticas
const { scene, camera, renderer, controls } = initScene();
const stats = new Stats();
crearMenuEstadisticas();
createSky(scene);

const texturePath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa_t.jpg';
const heightMapPath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa.png';

// Inicializar física y cargar modelo
initPhysics().then((physicsWorld) => {
    console.log('Mundo de física inicializado:', physicsWorld);
    world = physicsWorld;

    // Cargar modelo
    const resultado = cargarModelo(250, 24, 250, './negro.glb', world);
    if (resultado) {
        modelo = resultado.modelo; // Asignar el modelo globalmente
        body = resultado.body;     // Asignar el cuerpo físico globalmente
        scene.add(modelo);
    } else {
        console.error('No se pudo cargar el modelo debido a un problema con la física');
    }
}).catch((err) => console.error('Error al inicializar física:', err));

// Cargar terreno y texturas
Promise.all([
    loadTexture(texturePath), // Cargar textura
    new Promise((resolve, reject) => {
        new THREE.TextureLoader().load(
            heightMapPath,
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
                console.error(`Error al cargar el mapa de altura desde ${heightMapPath}:`, err);
                reject(err);
            }
        );
    }),
]).then(([terrainTexture, imageData]) => {
    // Crear terreno y añadirlo a la escena
    const terrainMesh = createTerrain(imageData, terrainTexture);
    scene.add(terrainMesh);
    createTerrainRigidBody(terrainMesh, world);
}).catch((error) => console.error('Error al cargar el terreno o texturas:', error));

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    stepPhysics(world);
    controls.update();
    renderer.render(scene, camera);

    // Sincronización de modelo físico
    if (body && modelo) {
        const translation = body.translation();
        const rotation = body.rotation();
        modelo.position.set(translation.x, translation.y, translation.z);
        modelo.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    }
    
    // Actualizar vida o energía si es necesario
    // Ejemplo: stats.modificarVida(-0.1); // Simula pérdida de vida
}

// Iniciar animación
animate();
