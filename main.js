import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Asegúrate de que la ruta es correcta
import RAPIER from '@dimforge/rapier3d-compat';
import { initScene } from './scene.js';
import { crearMenuEstadisticas } from './menu.js';
import { Stats } from './stats.js';
import { initPhysics, createTerrainRigidBody, stepPhysics } from './physics.js';
import { loadTexture, createTerrain } from './createTerrain.js';
import { createSky } from './sky.js';
import { cargarModeloNegro } from './objetos.js'; // Importa la nueva función

const { scene, camera, renderer, controls } = initScene();
const stats = new Stats();
crearMenuEstadisticas();
createSky(scene);

const texturePath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa_t.jpg';
const heightMapPath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa.png';

// En lugar de crear un cubo, ahora cargamos el modelo negro
let modeloNegro = null;

Promise.all([
    loadTexture(texturePath),
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
            (err) => reject(err)
        );
    }),
    new Promise((resolve) => {
        // Cargar el modelo negro y resolver la promesa cuando esté cargado
        modeloNegro = cargarModeloNegro(250, 20, 250); // Ajusta la posición según necesidad
        if (modeloNegro) {
            scene.add(modeloNegro); // Añadir el modelo a la escena cuando esté cargado
            resolve();
        } else {
            // Si el modelo no se carga de inmediato, resolvemos cuando esté disponible
            const checkModelLoaded = () => {
                if (modeloNegro) {
                    scene.add(modeloNegro);
                    resolve();
                } else {
                    setTimeout(checkModelLoaded, 100); // Verificar cada 100ms
                }
            };
            checkModelLoaded();
        }
    })
]).then(([terrainTexture, imageData]) => {
    const terrainMesh = createTerrain(imageData, terrainTexture);
    scene.add(terrainMesh);
    createTerrainRigidBody(terrainMesh);
}).catch((error) => console.error('Error al cargar recursos:', error));

function animate() {
    requestAnimationFrame(animate);
    stepPhysics();
    controls.update();
    renderer.render(scene, camera);
}

animate();
