import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import RAPIER from '@dimforge/rapier3d-compat';
import { loadTexture } from './createTerrain.js';  // Asumiendo que loadTexture está definido aquí

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
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 1.2);
hemiLight.position.set(360, 80, 360);
scene.add(hemiLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight1.position.set(180, 100, 180);
directionalLight1.intensity = 2.5;
directionalLight1.castShadow = true;
scene.add(directionalLight1);


const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-1, 101, -1);
scene.add(directionalLight2);
// Helper para la luz direccional 1
const dirLightHelper1 = new THREE.DirectionalLightHelper(directionalLight1, 10); // El 10 es el tamaño del helper
scene.add(dirLightHelper1);

// Helper para la luz direccional 2
const dirLightHelper2 = new THREE.DirectionalLightHelper(directionalLight2, 10);
scene.add(dirLightHelper2);

// Helper para la luz hemisférica
const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
scene.add(hemiLightHelper);

// ------------------ Carga de Imagen y Creación del Terreno ---------------------
const texturePath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa_t.jpg'; // Ruta de la textura
const heightMapPath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa.png';

Promise.all([
  loadTexture(texturePath), // Cargar textura
  new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      heightMapPath,
      (texture) => {
        const image = texture.image;
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      },
      undefined,
      (err) => reject(err)
    );
  }),
]).then(([terrainTexture, imageData]) => {
  // Crear la geometría del terreno
  const width = 100;
  const height = 100;
  const segments = 256;
  const geometry = new THREE.PlaneGeometry(width, height, segments, segments);

  // Ajustar la geometría del terreno basándose en el mapa de alturas
  const vertices = geometry.attributes.position.array;
  for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
    vertices[i + 2] = imageData.data[j * 4] / 255 * 10;  // Ajusta la escala según sea necesario
  }
  geometry.computeVertexNormals();

  // Aplicar la textura al material
  const material = new THREE.MeshStandardMaterial({
    map: terrainTexture
  });

  // Crear el mesh del terreno
  const terrainMesh = new THREE.Mesh(geometry, material);
  scene.add(terrainMesh);

  // Crear cuerpo físico para el terreno
  createTerrainRigidBody(terrainMesh);
}).catch((error) => {
  console.error('Error al cargar recursos:', error);
});

// ------------------ Inicialización de Física ---------------------
async function initPhysics() {
  await RAPIER.init();
  world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
}

// ------------------ Creación del Collider del Terreno ---------------------
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
