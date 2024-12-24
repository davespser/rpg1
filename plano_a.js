import * as THREE from 'three';

// Función para crear un cubo con material y subdivisiones según el día
export function createCube(
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0 },
  size = { x: 10, y: 10, z: 10 },
  subdivisions = { x: 10, y: 50, z: 100 }
) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 - Domingo, 1 - Lunes, ..., 6 - Sábado

  let geometry = new THREE.BoxGeometry(size.x, size.y, size.z, subdivisions.x, subdivisions.y, subdivisions.z);
  let material;

  // Elegir material y modificar la geometría según el día
  switch (dayOfWeek) {
    case 1: // Lunes: Piedra
    material = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            
            // Ruido Perlin simple
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            float noise(vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);

                float a = random(i);
                float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0));
                float d = random(i + vec2(1.0, 1.0));

                vec2 u = f * f * (3.0 - 2.0 * f);

                return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            void main() {
                vec2 uv = vUv * 10.0; // Escala de ruido
                float n = noise(uv);
                vec3 color = mix(vec3(0.4, 0.3, 0.2), vec3(0.2, 0.1, 0.1), n); // Marrón rugoso
                gl_FragColor = vec4(color, 1.0);
            }
        `,
    });

    // Añade irregularidades geométricas
    geometry = createStoneGeometry(geometry);
    break;
    case 2: // Martes: Hielo
    material = new THREE.ShaderMaterial({
        transparent: true,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;

            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            void main() {
                vec3 baseColor = vec3(0.6, 0.8, 1.0); // Azul claro
                float alpha = 0.7 + random(vUv) * 0.3; // Variación en transparencia
                gl_FragColor = vec4(baseColor, alpha);
            }
        `,
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
     // z
   } geometry.computeVertexNormals();
  return geometry;
}
