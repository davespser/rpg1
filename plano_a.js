import * as THREE from 'three';

// Función para crear un cubo con material y subdivisiones según el día
export function createCube(
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0 },
  size = { x: 10, y: 10, z: 10 },
  subdivisions = { x: 10, y: 50, z: 400 }
) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 - Domingo, 1 - Lunes, ..., 6 - Sábado

  let geometry = new THREE.BoxGeometry(size.x, size.y, size.z, subdivisions.x, subdivisions.y, subdivisions.z);
  let material;

  // Elegir material y modificar la geometría según el día
  switch (dayOfWeek) {
    case 1: // Lunes: Piedra
      material = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 1 });
      geometry = createStoneGeometry(geometry);
      break;
    case 2: // Martes: Hielo
      material = new THREE.MeshStandardMaterial({
        color: 0xadd8e6,
        roughness: 0.3,
        metalness: 0.8,
      });
      geometry = createIceGeometry(geometry);
      break;
    case 3: // Miércoles: Metal
      material = new THREE.MeshStandardMaterial({
        color: 0xb0c4de,
        roughness: 0.5,
        metalness: 1,
      });
      break;
    case 4: // Jueves: Agua
      material = new THREE.MeshStandardMaterial({
        color: 0x1e90ff,
        roughness: 0.3,
        metalness: 0.8,
        transparent: true,
        opacity: 0.7,
      });
      geometry = createWaterGeometry(geometry);
      break;
    case 5: // Viernes: Césped
      material = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 1 });
      geometry = createGrassGeometry(geometry);
      break;
    case 6: // Sábado: Geometría 5D
      material = new THREE.LineBasicMaterial({ color: 0xffa500 });
      geometry = create5DGeometry(size);
      break;
    default: // Otros días
      material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  }

  const cube = new THREE.Mesh(geometry, material);

  // Configurar posición y rotación
  cube.position.set(position.x, position.y, position.z);
  cube.rotation.set(rotation.x, rotation.y, rotation.z);

  return cube;
}

// Función para modificar la geometría con ruido para piedra
function createStoneGeometry(geometry) {
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] += Math.random() * 0.5; // x
    positions[i + 1] += Math.random() * 0.5; // y
    positions[i + 2] += Math.random() * 0.5; // z
  }
  geometry.computeVertexNormals();
  return geometry;
}

// Función para modificar la geometría con ruido suave para hielo
function createIceGeometry(geometry) {
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

// Función para modificar la geometría con ondas para agua
function createWaterGeometry(geometry) {
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 2] = Math.sin(positions[i]) * Math.cos(positions[i + 1]); // z
  }
  geometry.computeVertexNormals();
  return geometry;
}

// Función para modificar la geometría con ruido suave para césped
function createGrassGeometry(geometry) {
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += (Math.random() - 0.5) * 2.0; // y
    positions[i + 2] += (Math.random() - 0.5) * 2.0; // z
  }
  geometry.computeVertexNormals();
  return geometry;
}

// Función para crear un hipercubo 5D proyectado en 3D
function create5DGeometry(size) {
  const vertices = [];
  const edges = [];
  const dimension = 5; // 5 dimensiones

  // Crear vértices del hipercubo 5D (32 vértices en total)
  for (let i = 0; i < Math.pow(2, dimension); i++) {
    const vertex = [];
    for (let d = 0; d < dimension; d++) {
      vertex.push((i & (1 << d)) ? size.x / 2 : -size.x / 2);
    }
    vertices.push(vertex);
  }

  // Crear conexiones entre vértices (aristas del hipercubo)
  for (let i = 0; i < vertices.length; i++) {
    for (let j = 0; j < dimension; j++) {
      const neighbor = i ^ (1 << j); // Cambiar un bit
      if (neighbor > i) {
        edges.push([vertices[i], vertices[neighbor]]);
      }
    }
  }

  // Proyectar vértices a 3D
  const projectedVertices = vertices.map((v) => new THREE.Vector3(v[0], v[1], v[2]));

  // Crear geometría con líneas
  const geometry = new THREE.BufferGeometry();
  const linePositions = [];
  for (const edge of edges) {
    const [start, end] = edge;
    linePositions.push(...start.slice(0, 3), ...end.slice(0, 3));
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  return geometry;
}
