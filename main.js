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
import { createCube } from  './plano_a.js';
// Declaración de variables globales
let world, modelo, body, collider;
let terrainMesh;

// Inicialización de la escena y estadísticas
const { scene, camera, renderer, controls } = initScene();
const stats = new Stats();
crearMenuRadial();
createSky(scene);


// Rutas de las texturas y mapas
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
        terrainMesh = createTerrain(imageData, terrainTexture);
        terrainMesh.scale.set(1, 1, 1);
        terrainMesh.position.set(0, -20, 0); // Ajustar la posición del terreno
        scene.add(terrainMesh);
        console.log("Terreno añadido a la escena:", terrainMesh);

        // Crear colisionador para el terreno
        if (terrainMesh.geometry) {
            createTerrainRigidBody(terrainMesh, world);
            console.log("Colisionador del terreno creado.");
        }

        addBuildings(scene, terrainMesh);
        // Crear el plano con material y geometría según el día
// Puedes pasar las coordenadas y rotación como objetos
        const cube = createCube(
        { x: -240, y: 4.4, z: -20 },  // Posición del plano
        { x: 0, y: 0, z: 0},// rotacion del plano
        { x: 0.1, y: 20, z: 550},
            216
      );
          scene.add(cube);
        // Cargar modelo con física
        const resultado = await cargarModelo(1, 1, 1, './negro.glb', world, scene, true);
        modelo = resultado.modelo;
        modelo.scale.set(1, 1, 1);
        body = resultado.body;
        collider = resultado.collider;
        scene.add(modelo);

        console.log("Modelo y cuerpo físico añadidos a la escena.");
        console.log("Posición inicial del cuerpo físico:", body.translation());
        
        // Configurar la cámara
        camera.position.set(250, 10, 300);
        camera.lookAt(modelo.position);

        // Actualizar controles de la cámara
        controls.target.copy(modelo.position);
        controls.update();

        // Iniciar animación
        animate();
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

    // Actualizar estadísticas (si es necesario)
    // stats.update();
}

// Ejecutar la función principal
init();
