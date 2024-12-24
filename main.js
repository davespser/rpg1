import * as THREE from 'three';
import { generateTerrain } from './terrain.js';
import { initScene } from './scene.js';  // Función para inicializar la escena
import { crearMenuRadial } from './menu.js';
import { createSky } from './sky.js';
import { crearLuces } from './luces.js';
import { createCube } from './plano_a.js';

const { scene, camera, renderer, controls } = initScene();
crearMenuRadial();
createSky(scene);

/**
 * Función principal de inicialización.
 */
async function init() {
    try {
        // Datos del terreno
        const terrainData = {
            size: 100,  // Tamaño del terreno
            subdivisions: 50,  // Número de subdivisiones
            seed: 1234  // Semilla para la generación de ruido
        };

        // Generar el terreno
        const terrain = generateTerrain(terrainData.size, terrainData.subdivisions, terrainData.seed);

        // Crear y agregar el terreno a la escena
        const terrainMesh = new THREE.Mesh(
            new THREE.BufferGeometry(),
            new THREE.MeshStandardMaterial({ color: 0x888888, wireframe: true })
        );

        // Establecer atributos de la geometría del terreno
        terrainMesh.geometry.setAttribute('position', new THREE.BufferAttribute(terrain.positions, 3));
        terrainMesh.geometry.setAttribute('normal', new THREE.BufferAttribute(terrain.normals, 3));
        terrainMesh.geometry.setAttribute('uv', new THREE.BufferAttribute(terrain.uvs, 2));
        terrainMesh.geometry.setIndex(new THREE.BufferAttribute(terrain.indices, 1));

        scene.add(terrainMesh);

        // Crear luces
        const { luzAmbiental, luzDireccional, luzPuntual } = crearLuces(scene);

        // Crear y agregar un cubo de prueba
        const cube = createCube(
            { x: 0, y: 5, z: 0 },           // Posición
            { x: 0, y: Math.PI / 4, z: 0 }, // Rotación
            { x: 1, y: 50, z: 750 },        // Tamaño
            { x: 10, y: 50, z: 100 }        // Subdivisiones
        );
        scene.add(cube);

        // Configurar la cámara
        camera.position.set(150, 50, 150);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();

        // Iniciar animación
        animate();

    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
}

/**
 * Función de animación principal.
 */
function animate() {
    requestAnimationFrame(animate);

    // Actualizar controles y renderizar la escena
    controls.update();
    renderer.render(scene, camera);
}

// Ejecutar la función principal
init();
