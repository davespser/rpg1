import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { initScene } from './scene.js';
import { crearMenuRadial } from './menu.js';
import { Stats } from './stats.js';
import { initPhysics, createTerrainRigidBody, stepPhysics } from './physics.js';
import { loadTexture, createTerrain } from './createTerrain.js';
import { createSky } from './sky.js';
import { cargarModelo } from './objetos.js';
import { addBuildings } from './entorno_f.js';
import { createCube } from './plano_a.js';

let world, modelo, body, collider;
let terrainMesh;

// Inicialización de la escena
const { scene, camera, renderer, controls } = initScene();
const stats = new Stats();
crearMenuRadial();
createSky(scene);

const texturePath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa_t.jpg';
const heightMapPath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa.png';

/**
 * Función principal de inicialización
 */
async function init() {
    try {
        // Inicializar física
        world = await initPhysics();
        console.log('Mundo de física inicializado:', world);

        // Cargar terreno y texturas
        const [terrainTexture, imageData] = await Promise.all([
            loadTexture(texturePath),
            cargarMapaDeAltura(heightMapPath),
        ]);

        // Crear terreno y añadirlo a la escena
        let { terrain, collider } = createTerrain(imageData, terrainTexture, world);
        terrain.scale.set(1, 1, 1);
        terrain.position.set(0, -20, 0);
        scene.add(terrain);
        console.log("Terreno añadido a la escena:", terrain);

        // Crear colisionador visual (esto debe ocurrir después de crear el colisionador)
        const colliderVisualizer = createColliderVisualizer(collider, scene);

        // Crear el cuerpo físico para el terreno
        if (terrain.geometry) {
            createTerrainRigidBody(terrain, world);
            console.log("Colisionador del terreno creado.");
        }

        // Añadir edificios
        addBuildings(scene, terrain);

        // Cargar modelo con física
        const resultado = await cargarModelo(1, 1, 1, './negro.glb', world, scene, true);
        modelo = resultado.modelo;
        body = resultado.body;
        collider = resultado.collider;
        scene.add(modelo);

        console.log("Modelo y cuerpo físico añadidos a la escena.");
        console.log("Posición inicial del cuerpo físico:", body.translation());

        // Configuración de la cámara
        camera.position.set(250, 10, 300);
        camera.lookAt(modelo.position);
        controls.target.copy(modelo.position);
        controls.update();

        // Iniciar animación
        animate();  // Llamamos a la animación directamente

    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
}

/**
 * Cargar el mapa de altura y devolver sus datos de imagen.
 * @param {string} path - Ruta del mapa de altura.
 * @returns {Promise<ImageData>} Promesa que resuelve con los datos del mapa de altura.
 */
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

/**
 * Crear un visualizador del colisionador (cubo)
 * @param {RAPIER.Collider} collider - El colisionador para el cual crear el visualizador.
 * @param {THREE.Scene} scene - La escena en la que agregar el visualizador.
 * @returns {THREE.Mesh} El visualizador creado.
 */
function createColliderVisualizer(collider, scene) {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
    });
    const visualizer = new THREE.Mesh(geometry, material);
    scene.add(visualizer);
    return visualizer;
}

/**
 * Función de animación principal.
 */
function animate() {
    requestAnimationFrame(animate);

    // Actualizar física
    stepPhysics();

    // Sincronizar modelo con cuerpo físico
    if (body && modelo) {
        const translation = body.translation();
        const rotation = body.rotation();
        modelo.position.set(translation.x, translation.y, translation.z);
        modelo.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    }

    // Renderizar la escena
    controls.update();
    renderer.render(scene, camera);

    stats.update();
}

// Ejecutar la función principal
init();
