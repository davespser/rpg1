import * as THREE from 'three';

// Función para crear un cubo con material y geometría según el día
export function createCube(position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }, size = { x: 10, y: 10, z: 10 }) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 - Domingo, 1 - Lunes, ..., 6 - Sábado

  let geometry, material;

  // Obtener material y geometría según el día
  switch (dayOfWeek) {
    case 1: // Lunes: Piedra (BoxGeometry + ruido)
      material = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 1 });
      geometry = createStoneGeometry(size);
      break;
    case 2: // Martes: Hielo (BoxGeometry con ruido suave)
      material = new THREE.MeshStandardMaterial({ color: 0xADD8E6, roughness: 0.3, metalness: 0.8 });
      geometry = createIceGeometry(size);
      break;
    case 3: // Miércoles: Metal (BoxGeometry sin ruido)
      material = new THREE.MeshStandardMaterial({ color: 0xB0C4DE, roughness: 0.5, metalness: 1 });
      geometry = createMetalGeometry(size);
      break;
    case 4: // Jueves: Agua (con ondas)
      material = new THREE.MeshStandardMaterial({ color: 0x1E90FF, roughness: 0.3, metalness: 0.8, transparent: true, opacity: 0.7 });
      geometry = createWaterGeometry(size);
      break;
    case 5: // Viernes: Césped (con ruido suave)
      material = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 1 });
      geometry = createGrassGeometry(size);
      break;
    default: // Otros días: Forma simple
      material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
      geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  }

  // Crear el mesh del cubo
  const cube = new THREE.Mesh(geometry, material);

  // Establecer la posición y rotación del cubo
  cube.position.set(position.x, position.y, position.z);
  cube.rotation.set(rotation.x, rotation.y, rotation.z);

  return cube;
}

// Función para crear geometría de piedra (con ruido)
function createStoneGeometry(size) {
  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);

  // Aplicar ruido a los vértices para dar una forma más irregular
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] += Math.random() * 0.5; // x
    positions[i + 1] += Math.random() * 0.5; // y
    positions[i + 2] += Math.random() * 0.5; // z
  }

  // Recalcular normales
  geometry.computeVertexNormals();

  return geometry;
}

// Función para crear geometría de hielo (suave y orgánica)
function createIceGeometry(size) {
  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);

  // Aplicar ruido suave
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const noiseFactor = 0.1;
    positions[i] += Math.random() * noiseFactor; // x
    positions[i + 1] += Math.random() * noiseFactor; // y
    positions[i + 2] += Math.random() * noiseFactor; // z
  }

  geometry.computeVertexNormals();

  return geometry;
}

// Función para crear geometría de metal (sin ruido)
function createMetalGeometry(size) {
  return new THREE.BoxGeometry(size.x, size.y, size.z);
}

// Función para crear geometría de agua (con ondas)
function createWaterGeometry(size) {
  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);

  // Aplicar ondas a los vértices
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 2] = Math.sin(positions[i]) * Math.cos(positions[i + 1]); // z
  }

  geometry.computeVertexNormals();

  return geometry;
}

// Función para crear geometría de césped (con ruido suave)
function createGrassGeometry(size) {
  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);

  // Aplicar ruido suave
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 2] += Math.random() * 0.3; // z
  }

  geometry.computeVertexNormals();

  return geometry;
}
