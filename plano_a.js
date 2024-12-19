import * as THREE from 'three';

// Función para crear el plano con material y geometría según el día
export function createPlane(position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 - Domingo, 1 - Lunes, ..., 6 - Sábado

  let geometry, material;

  // Obtener material y geometría según el día
  switch (dayOfWeek) {
    case 1: // Lunes: Piedra (PlaneGeometry + ruido)
      material = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 1 });
      geometry = createStoneGeometry();
      break;
    case 2: // Martes: Hielo (ParametricGeometry + ruido suave)
      material = new THREE.MeshStandardMaterial({ color: 0xADD8E6, roughness: 0.3, metalness: 0.8 });
      geometry = createIceGeometry();
      break;
    case 3: // Miércoles: Metal (ParametricGeometry sin ruido)
      material = new THREE.MeshStandardMaterial({ color: 0xB0C4DE, roughness: 0.5, metalness: 1 });
      geometry = createMetalGeometry();
      break;
    default: // Otros días: Forma simple
      material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
      geometry = new THREE.PlaneGeometry(10, 10, 200, 200);
  }

  // Crear el mesh del plano
  const plane = new THREE.Mesh(geometry, material);

  // Establecer la posición y rotación del plano
  plane.position.set(position.x, position.y, position.z);
  plane.rotation.set(rotation.x, rotation.y, rotation.z);

  return plane;
}

// Función para crear geometría de piedra (con ruido)
function createStoneGeometry() {
  const geometry = new THREE.PlaneGeometry(10, 10, 200, 200);

  // Aplicar ruido a los vértices para dar una forma más irregular
  geometry.vertices.forEach(vertex => {
    const noise = Math.random() * 1; // Ruido aleatorio
    vertex.x += noise;
    vertex.y += noise;
    vertex.z += noise;
  });

  // Recalcular normales
  geometry.computeVertexNormals();

  return geometry;
}

// Función para crear geometría de hielo (suave y orgánica)
function createIceGeometry() {
  const geometry = new THREE.ParametricGeometry((u, v, target) => {
    const size = 5;
    const noiseFactor = 0.1;

    // Usar una función paramétrica suave
    const x = (u - 0.5) * size;
    const y = (v - 0.5) * size;
    const z = Math.sin(u * Math.PI) * Math.cos(v * Math.PI) * size;

    // Aplicar ruido suave
    target.set(
      x + Math.random() * noiseFactor,
      y + Math.random() * noiseFactor,
      z + Math.random() * noiseFactor
    );
  }, 20, 20); // Subdivisiones

  return geometry;
}

// Función para crear geometría de metal (suave sin ruido)
function createMetalGeometry() {
  const geometry = new THREE.ParametricGeometry((u, v, target) => {
    const size = 5;

    // Crear una forma paramétrica más suave
    const x = (u - 0.5) * size;
    const y = (v - 0.5) * size;
    const z = Math.sin(u * Math.PI) * Math.cos(v * Math.PI) * size;

    target.set(x, y, z);
  }, 20, 20); // Subdivisiones

  return geometry;
}
