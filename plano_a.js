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
      material = new THREE.ShaderMaterial({
        vertexShader: `
          uniform float time;
          varying vec3 vNormal;
          void main() {
            vNormal = normal;
            vec3 newPosition = position + normal * sin(position.y * 10.0 + time) * 0.5;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
          }
        `,
        uniforms: {
          time: { value: 1.0 }
        }
      });
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
    positions[i + 1] += (Math.random() - 0.5) * 2.0;
    positions[i + 2] += (Math.random() - 0.5) * 2.0; // y
  }
  geometry.computeVertexNormals();
  return geometry;
}

// Animar el material del césped
function animateGrassMaterial(material) {
  requestAnimationFrame(() => animateGrassMaterial(material));
  material.uniforms.time.value += 0.01;
}

// Uso de la función para crear y animar el cubo
const scene = new THREE.Scene();
const grassCube = createCube();
scene.add(grassCube);

if (grassCube.material instanceof THREE.ShaderMaterial) {
  animateGrassMaterial(grassCube.material);
}
