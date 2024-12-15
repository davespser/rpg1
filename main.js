import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import RAPIER from '@dimforge/rapier3d-compat';

let world;
// ------------------ Escena, Cámara, Renderer ---------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cámara inicial
camera.position.set(100, 80, 150);
camera.lookAt(scene.position);

// Cámara orbital
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Suavizado de la cámara
controls.dampingFactor = 0.25; // Factor de suavizado
controls.screenSpacePanning = false; // Para que no se mueva la cámara de manera errática

// Luces
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Luz ambiental
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 1.2); // Luz hemisférica
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5); // Luz direccional principal
directionalLight1.position.set(1, 1, 1);
directionalLight1.castShadow = true;
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5); // Luz direccional secundaria
directionalLight2.position.set(-1, 1, -1);
scene.add(directionalLight2);

// ------------------ Carga del Mapa de Altura ---------------------
const loader = new THREE.TextureLoader();

loader.load('https://raw.githubusercontent.com/davespser/rpg1/main/casa.png', function(texture) {
  const image = texture.image;
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  createTerrain(imageData);
}, undefined, function(err) {
  console.error('Error al cargar la imagen:', err);
});

// ------------------ Creación del Terreno -------------------------
function createTerrain(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const vertices = [];
  const indices = [];
  const scale = 1; // Ajusta este valor para la escala del terreno

  for (let z = 0; z < height; z++) {
    for (let x = 0; x < width; x++) {
      const index = (z * width + x) * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];

      // Usar la media de RGB como la altura
      const heightValue = ((r + g + b) / 3) / 255; // Normalizado a [0, 1]
      const y = heightValue * 50 * scale; // Ajusta la altura máxima

      vertices.push(x * scale, y, z * scale);

      if (x < width - 1 && z < height - 1) {
        const a = z * width + x;
        const b = z * width + x + 1;
        const c = (z + 1) * width + x;
        const d = (z + 1) * width + x + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  // Material con color y textura básica
  const material = new THREE.MeshStandardMaterial({
    color: 0x228B22, // Color verde para el terreno
    roughness: 0.8,  // Mayor rugosidad
    metalness: 0.1   // Baja reflectividad metálica
  });

  const terrainMesh = new THREE.Mesh(geometry, material);
  terrainMesh.receiveShadow = true;
  scene.add(terrainMesh);

  // Crear el cuerpo rígido del terreno
  createTerrainRigidBody(terrainMesh);
}

// ------------------ Inicialización de Física con Rapier -------------------------
async function initPhysics() {
  await RAPIER.init();
  world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
}

// ------------------ Creación del Collider del Terreno -------------------------
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

// ------------------ Animación -------------------------
function animate() {
  requestAnimationFrame(animate);

  if (world) {
    world.step();
  }

  controls.update(); // Actualizar el control de la cámara
  renderer.render(scene, camera);
}

animate();
