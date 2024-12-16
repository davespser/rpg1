import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import RAPIER from '@dimforge/rapier3d-compat';
import { loadTexture, createTerrain } from './createTerrain.js';

let world;

// ------------------ Escena, Cámara, Renderer ---------------------
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

// ------------------ Luces ---------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight1.position.set(100, 100, 100);
directionalLight1.castShadow = true;
scene.add(directionalLight1);

// ------------------ Función para redimensionar imágenes ---------------------
function resizeImageToPowerOf2(image, size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, size, size);
  return canvas;
}

// ------------------ Carga de Imagen y Creación del Terreno ---------------------
const texturePath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa_t.jpg';
const heightMapPath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa.png';

Promise.all([
  new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      texturePath,
      (texture) => {
        const resizedCanvas = resizeImageToPowerOf2(texture.image);
        const resizedTexture = new THREE.CanvasTexture(resizedCanvas);
        resolve(resizedTexture);
      },
      undefined,
      (err) => reject(err)
    );
  }),
  new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      heightMapPath,
      (texture) => {
        const resizedCanvas = resizeImageToPowerOf2(texture.image);
        const ctx = resizedCanvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, resizedCanvas.width, resizedCanvas.height);
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
}).catch((error) => {
  console.error('Error al cargar recursos:', error);
});

// ------------------ Inicialización de Física ---------------------
async function initPhysics() {
  await RAPIER.init();
  world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
}

async function createTerrainRigidBody(terrainMesh) {
  if (!world) {
    await initPhysics();
  }
  const vertices = terrainMesh.geometry.attributes.position.array;
  const indices = terrainMesh.geometry.index.array;

  const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);
  const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed();
  const rigidBody = world.createRigidBody(rigidBodyDesc);
  world.createCollider(colliderDesc, rigidBody);
}

// ------------------ Animación ---------------------
function animate() {
  requestAnimationFrame(animate);

  if (world) {
    world.step();
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
