import * as THREE from 'three';

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

  switch (dayOfWeek) {
    case 6: // Sábado: Geometría 5D
      material = new THREE.LineBasicMaterial({ color: 0xffa500 });
      geometry = create5DGeometry(size);
      const hypercube = new THREE.LineSegments(geometry, material);
      animate5D(hypercube, size);
      return hypercube;
    default:
      material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  }

  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(position.x, position.y, position.z);
  cube.rotation.set(rotation.x, rotation.y, rotation.z);

  return cube;
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

  // Agregar la animación (rota el hipercubo)
  function animate5D(delta) {
    geometry.rotateX(delta * 0.1);
    geometry.rotateY(delta * 0.1);
  }

  return { geometry, animate5D };
}

// Animar el hipercubo 5D
function animate5D(hypercube, size) {
  let rotation4D = 0;
  let rotation5D = 0;

  function project5D(vertices, rotation4D, rotation5D) {
    return vertices.map((v) => {
      // Rotación en el espacio 4D (dimensiones 3 y 4)
      const x3 = v[3] * Math.cos(rotation4D) - v[4] * Math.sin(rotation4D);
      const x4 = v[3] * Math.sin(rotation4D) + v[4] * Math.cos(rotation4D);

      // Rotación en el espacio 3D (dimensiones 2 y 3)
      const x2 = v[2] * Math.cos(rotation5D) - x3 * Math.sin(rotation5D);
      const x3Projected = v[2] * Math.sin(rotation5D) + x3 * Math.cos(rotation5D);

      return new THREE.Vector3(v[0], v[1], x3Projected);
    });
  }

  function animate() {
    rotation4D += 0.01;
    rotation5D += 0.01;

    const vertices = hypercube.geometry.attributes.position.array;
    const projectedVertices = project5D(vertices, rotation4D, rotation5D);

    const positions = [];
    for (const edge of edges) {
      const start = projectedVertices[vertices.indexOf(edge[0])];
      const end = projectedVertices[vertices.indexOf(edge[1])];
      positions.push(start.x, start.y, start.z, end.x, end.y, end.z);
    }

    hypercube.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    hypercube.geometry.attributes.position.needsUpdate = true;

    requestAnimationFrame(animate);
  }

  animate();
}
