import * as THREE from 'three';
import RAPIER from 'https://unpkg.com/@dimforge/rapier3d@0.16.0/rapier.js';

let world;
// ------------------ Escena, Cámara, Renderer ---------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(100, 80, 150);
camera.lookAt(scene.position);

// Luces
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// ------------------ Carga del Mapa de Altura ---------------------
const loader = new THREE.TextureLoader();

loader.load('heightmap.png', function(texture) {
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
    const scale = 1; // Escala de posición del terreno
    const maxHeight = 50; // Altura máxima del terreno

    // Normalizar los valores de altura
    const minGray = 82;  // Valor mínimo de gris (de análisis)
    const maxGray = 176; // Valor máximo de gris

    for (let z = 0; z < height; z++) {
        for (let x = 0; x < width; x++) {
            const index = (z * width + x) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];

            // Promedio RGB como valor de gris
            const grayValue = (r + g + b) / 3;

            // Normalizar entre 0 y 1
            const normalizedHeight = (grayValue - minGray) / (maxGray - minGray);
            const y = Math.max(0, normalizedHeight) * maxHeight * scale;

            vertices.push(x * scale, y, z * scale);

            // Generar índices para las caras del terreno
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

    const material = new THREE.MeshPhongMaterial({
        color: 0x808080,
        wireframe: false
    });
    const terrainMesh = new THREE.Mesh(geometry, material);
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

    // Opcional: Visualización del collider
    const colliderShape = new THREE.BufferGeometry();
    colliderShape.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    colliderShape.setIndex(indices);

    const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const colliderMesh = new THREE.Mesh(colliderShape, colliderMaterial);
    colliderMesh.visible = false; // Invisible por defecto
    scene.add(colliderMesh);
}

// ------------------ Animación -------------------------
function animate() {
    requestAnimationFrame(animate);

    if (world) {
        world.step();
    }
    renderer.render(scene, camera);
}

animate();
