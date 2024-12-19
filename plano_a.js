import * as THREE from 'three';

// Función para crear el plano con material y geometría según el día
export function createPlane(position = { x: 0, y: 0, z: 0 }, 
                           rotation = { x: 0, y: 0, z: 0 }, 
                           size = { x: 10, y: 10, z: 20 }) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 - Domingo, 1 - Lunes, ..., 6 - Sábado

  let geometry, material;

  // Obtener material y geometría según el día
  switch (dayOfWeek) {
    case 1: // Lunes: Piedra (PlaneGeometry + ruido)
      material = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 1 });
      geometry = createStoneGeometry(size);
      break;
    case 2: // Martes: Hielo (ParametricBufferGeometry + ruido suave)
      material = new THREE.MeshStandardMaterial({ color: 0xADD8E6, roughness: 0.3, metalness: 0.8 });
      geometry = createIceGeometry(size);
      break;
    case 3: // Miércoles: Metal (ParametricBufferGeometry sin ruido)
      material = new THREE.MeshStandardMaterial({ color: 0xB0C4DE, roughness: 0.5, metalness: 1 });
      geometry = createMetalGeometry(size);
      break;
    case 4: // Jueves: Madera (Noise + forma simple)
      material = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7 });
      geometry = createWoodGeometry(size);
      break;
    case 5: // Viernes: Agua (Forma fractal con ruido)
      material = new THREE.MeshStandardMaterial({ color: 0x1E90FF, roughness: 0.1, metalness: 0.5 });
      geometry = createWaterGeometry(size);
      break;
    case 6: // Sábado: Hierba (Ruido y textura de césped)
      material = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.6 });
      geometry = createGrassGeometry(size);
      break;
    default: // Domingo: Forma simple (PlaneGeometry)
      material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
      geometry = new THREE.PlaneGeometry(size.x, size.y, 200, 200);
  }

  // Crear el mesh del plano
  const plane = new THREE.Mesh(geometry, material);

  // Establecer la posición y rotación del plano
  plane.position.set(position.x, position.y, position.z);
  plane.rotation.set(rotation.x, rotation.y, rotation.z);

  return plane;
}

// Función para crear geometría de piedra (con ruido)
function createStoneGeometry(size) {
  const geometry = new THREE.PlaneGeometry(size.x, size.y, 200, 200);

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
function createIceGeometry(size) {
  const geometry = new THREE.ParametricBufferGeometry((u, v, target) => {
    const noiseFactor = 0.1;

    // Usar una función paramétrica suave
    const x = (u - 0.5) * size.x;
    const y = (v - 0.5) * size.y;
    const z = Math.sin(u * Math.PI) * Math.cos(v * Math.PI) * size.z;

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
function createMetalGeometry(size) {
  const geometry = new THREE.ParametricBufferGeometry((u, v, target) => {
    const x = (u - 0.5) * size.x;
    const y = (v - 0.5) * size.y;
    const z = Math.sin(u * Math.PI) * Math.cos(v * Math.PI) * size.z;

    target.set(x, y, z);
  }, 20, 20); // Subdivisiones

  return geometry;
}

// Función para crear geometría de madera (con ruido)
function createWoodGeometry(size) {
  const geometry = new THREE.PlaneGeometry(size.x, size.y, 200, 200);

  // Aplicar ruido para simular la textura de la madera
  geometry.vertices.forEach(vertex => {
    const noise = Math.random() * 0.5; // Ruido más suave para madera
    vertex.x += noise;
    vertex.y += noise;
    vertex.z += noise;
  });

  // Recalcular normales
  geometry.computeVertexNormals();

  return geometry;
}

// Función para crear geometría de agua (con ruido fractal)
function createWaterGeometry(size) {
  const geometry = new THREE.ParametricBufferGeometry((u, v, target) => {
    const sizeFactor = 5;
    const x = (u - 0.5) * size.x;
    const y = (v - 0.5) * size.y;
    const z = Math.sin(u * Math.PI * sizeFactor) * Math.cos(v * Math.PI * sizeFactor);

    // Aplicar ruido fractal
    target.set(x, y, z);
  }, 30, 30); // Más subdivisiones para mayor suavidad

  return geometry;
}

// Función para crear geometría de hierba (con ruido suave)
function createGrassGeometry(size) {
  const geometry = new THREE.PlaneGeometry(size.x, size.y, 200, 200);

  // Aplicar ruido suave para simular hierba
  geometry.vertices.forEach(vertex => {
    const noise = Math.random() * 0.2; // Ruido más suave para hierba
    vertex.x += noise;
    vertex.y += noise;
    vertex.z += noise;
  });

  // Recalcular normales
  geometry.computeVertexNormals();

  return geometry;
}
