import * as THREE from 'three';

// Función para crear el plano con material y geometría según el día
export function createPlane(position = { x: 0, y: 0, z: 0 }, 
                           rotation = { x: 0, y: 0, z: 0 }, 
                           size = { x: 10, y: 10, z: 10 }) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 - Domingo, 1 - Lunes, ..., 6 - Sábado

  let geometry, material;

  // Obtener material y geometría según el día
  switch (dayOfWeek) {
    case 1: // Lunes: Piedra (BufferGeometry + ruido)
      material = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 1 });
      geometry = createStoneGeometry(size);
      break;
    case 2: // Martes: Hielo (BufferGeometry + ruido suave)
      material = new THREE.MeshStandardMaterial({ color: 0xADD8E6, roughness: 0.3, metalness: 0.8 });
      geometry = createIceGeometry(size);
      break;
    case 3: // Miércoles: Metal (BufferGeometry sin ruido)
      material = new THREE.MeshStandardMaterial({ color: 0xB0C4DE, roughness: 0.5, metalness: 1 });
      geometry = createMetalGeometry(size);
      break;
    case 4: // Jueves: Madera (BufferGeometry + ruido)
      material = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7 });
      geometry = createWoodGeometry(size);
      break;
    case 5: // Viernes: Agua (BufferGeometry con ruido fractal)
      material = new THREE.MeshStandardMaterial({ color: 0x1E90FF, roughness: 0.1, metalness: 0.5 });
      geometry = createWaterGeometry(size);
      break;
    case 6: // Sábado: Hierba (BufferGeometry + ruido suave)
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
  const geometry = new THREE.BufferGeometry();

  // Crear una geometría de plano básico
  const vertices = [];
  const width = size.x;
  const height = size.y;
  const segments = 100;
  
  for (let x = 0; x <= segments; x++) {
    for (let y = 0; y <= segments; y++) {
      const vertexX = (x / segments) * width - width / 2;
      const vertexY = (y / segments) * height - height / 2;
      const vertexZ = Math.random() * 0.5;  // Añadir algo de ruido

      vertices.push(vertexX, vertexY, vertexZ);
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));

  // Definir los índices para crear las caras
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

// Función para crear geometría de hielo (suave y orgánica) usando BufferGeometry
function createIceGeometry(size) {
  const geometry = new THREE.BufferGeometry();

  const vertices = [];
  const width = size.x;
  const height = size.y;
  const segments = 20;

  for (let x = 0; x <= segments; x++) {
    for (let y = 0; y <= segments; y++) {
      const vertexX = (x / segments) * width - width / 2;
      const vertexY = (y / segments) * height - height / 2;
      const vertexZ = Math.sin(x * Math.PI / segments) * Math.cos(y * Math.PI / segments) * size.z;

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

// Función para crear geometría de metal (suave sin ruido) usando BufferGeometry
function createMetalGeometry(size) {
  const geometry = new THREE.BufferGeometry();

  const vertices = [];
  const width = size.x;
  const height = size.y;
  const segments = 20;

  for (let x = 0; x <= segments; x++) {
    for (let y = 0; y <= segments; y++) {
      const vertexX = (x / segments) * width - width / 2;
      const vertexY = (y / segments) * height - height / 2;
      const vertexZ = Math.sin(x * Math.PI / segments) * Math.cos(y * Math.PI / segments) * size.z;

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

// Aquí puedes agregar las demás funciones de geometría como madera, agua, hierba, etc.
