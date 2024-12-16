import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import RAPIER from '@dimforge/rapier3d-compat';
import { loadTexture, createTerrain } from './createTerrain.js';

let world;

// Escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(100, 80, 150);
camera.lookAt(scene.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// Luces
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(100, 100, 100);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Carga de textura y heightmap
const texturePath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa_t.jpg';
const heightMapPath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa.png';

Promise.all([
  loadTexture(texturePath), // Cargar textura
  new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      heightMapPath,
      (texture) => {
        const canvas = document.createElement('canvas');
        canvas.width = texture.image.width;
        canvas.height = texture.image.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(texture.image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      },
      undefined,
      (err) => reject(err)
    );
  }),
]).then(([terrainTexture, imageData]) => {
  const terrainMesh = createTerrain(imageData, terrainTexture);
  scene.add(terrainMesh);

  createTerrainRigidBody(terrainMesh);
}).catch((error) => console.error('Error al cargar recursos:', error));

// Física
async function initPhysics() {
  await RAPIER.init();
  world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
}

async function createTerrainRigidBody(terrainMesh) {
  if (!world) await initPhysics();

  const vertices = terrainMesh.geometry.attributes.position.array;
  const indices = terrainMesh.geometry.index.array;

  const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);
  const rigidBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  world.createCollider(colliderDesc, rigidBody);
}

// Animación
function animate() {
  requestAnimationFrame(animate);

  if (world) world.step();

  controls.update();
  renderer.render(scene, camera);
}

animate();
