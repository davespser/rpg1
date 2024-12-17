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

const { scene, camera, renderer, controls } = initScene();
const stats = new Stats();
crearMenuEstadisticas();
createSky(scene);

const texturePath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa_t.jpg';
const heightMapPath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa.png';

let world; // Declarar el mundo de física

// Inicializar física y luego cargar el modelo y el terreno
initPhysics().then((physicsWorld) => {
    world = physicsWorld;

    const { modelo, body } = cargarModelo(250, 24, 250, './negro.glb', world);
    scene.add(modelo);

    // Cargar terreno y texturas
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
    ]).then(([terrainTexture, imageData]) => {
        const terrainMesh = createTerrain(imageData, terrainTexture);
        scene.add(terrainMesh);
        createTerrainRigidBody(terrainMesh, world); // Asegúrate de que esta función acepte 'world'
    }).catch((error) => console.error('Error al cargar recursos:', error));

    function animate() {
        requestAnimationFrame(animate);
        stepPhysics(world);
        controls.update();
        renderer.render(scene, camera);

        // Sincronización del modelo con el cuerpo físico
        if (body) {
            const translation = body.translation();
            const rotation = body.rotation();
            modelo.position.set(translation.x, translation.y, translation.z);
            modelo.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
        }
    }

    animate();
});
