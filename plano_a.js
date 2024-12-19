import * as THREE from 'three';

// Función para crear el plano con material y geometría según el día
export function createPlane(position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }, size = { x: 10, y: 10, z: 20 }) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 - Domingo, 1 - Lunes, ..., 6 - Sábado

  let geometry, material;

  // Obtener material y geometría según el día
  switch (dayOfWeek) {
    case 1: // Lunes: Piedra (PlaneGeometry + ruido)
      material = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 1 });
      geometry = createStoneGeometry(size);
      break;
    case 2: // Martes: Hielo (ParametricGeometry + ruido suave)
      material = new THREE.MeshStandardMaterial({ color: 0xADD8E6, roughness: 0.3, metalness: 0.8 });
      geometry = createIceGeometry(size);
      break;
    case 3: // Miércoles: Metal (ParametricGeometry sin ruido)
      material = new THREE.MeshStandardMaterial({ color: 0xB0C4DE, roughness: 0.5, metalness: 1 });
      geometry = createMetalGeometry(size);
      break;
    case 4: // Jueves: Agua (con ondas)
      material = new THREE.MeshStandardMaterial({ color: 0x1E90FF, roughness: 0.3, metalness: 0.8 });
      geometry = createWaterGeometry(size);
      break;
    case 5: // Viernes: Césped (con ruido suave)
      material = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 1 });
      geometry = createGrassGeometry(size);
      break;
    default: // Otros días: Forma simple
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
  const geometry = new THREE.ParametricGeometry((u, v, target) => {
    const noiseFactor = 0.1;
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
  const geometry = new THREE.ParametricGeometry((u, v, target) => {
    const x = (u - 0.5) * size.x;
    const y = (v - 0.5) * size.y;
    const z = Math.sin(u * Math.PI) * Math.cos(v * Math.PI) * size.z;

    target.set(x, y, z);
  }, 20, 20); // Subdivisiones

  return geometry;
}

// Función para crear geometría de agua (ondas)
function createWaterGeometry(size) {
  const geometry = new THREE.BufferGeometry();

  const vertices = [];
  const width = size.x;
  const height = size.y;
  const segments = 30;

  // Crear los vértices con ondas
  for (let x = 0; x <= segments; x++) {
    for (let y = 0; y <= segments; y++) {
      const vertexX = (x / segments) * width - width / 2;
      const vertexY = (y / segments) * height - height / 2;
      const vertexZ = Math.sin(x * 0.1) * Math.cos(y * 0.1); // Ondas suaves

      vertices.push(vertexX, vertexY, vertexZ);
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));

  const indices = [];
  // Crear los triángulos para la malla
  for (let x = 0; x < segments; x++) {
    for (let y = 0; y < segments; y++) {
      const i1 = x * (segments + 1) + y;
      const i2 = (x + 1) * (segments + 1) + y;
      const i3 = (x + 1) * (segments + 1) + (y + 1);
      const i4 = x * (segments + 1) + (y + 1);

      indices.push(i1, i2, i3);
      indices.push(i1, i3, i4);
    }
  }
  geometry.setIndex(indices);

  return geometry;
}

// Función para crear geometría de césped (con ruido)
function createGrassGeometry(size) {
  const geometry = new THREE.BufferGeometry();

  const vertices = [];
  const width = size.x;
  const height = size.y;
  const segments = 30;

  for (let x = 0; x <= segments; x++) {
    for (let y = 0; y <= segments; y++) {
      const vertexX = (x / segments) * width - width / 2;
      const vertexY = (y / segments) * height - height / 2;
      const vertexZ = Math.random() * 0.3;  // Ruido suave para crear un efecto de césped

      vertices.push(vertexX, vertexY, vertexZ);
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));

  const indices = [];
  for (let x = 0; x < segments; x++) {
    for (let y = 0; y < segments; y++) {
      const i1 = x * (segments + 1) + y;
      const i2 = (x + 1) * (segments + 1) + y;
      const i3 = (x + 1) * (segments + 1) + (y + 1);
      const i4 = x * (segments + 1) + (y + 1);

      indices.push(i1, i2, i3);
      indices.push(i1, i3, i4);
    }
  }
  geometry.setIndex(indices);

  return geometry;
}
