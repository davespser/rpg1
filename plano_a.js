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
    material = new THREE.MeshStandardMaterial({
        color: 0x8b4513,  // Marrón base
        roughness: 0.95,  // Rugosidad alta, casi sin reflejos
        metalness: 0,     // Sin propiedades metálicas
        flatShading: true // Resaltar bordes e imperfecciones
    });

    // Personalizar el shader para añadir ruido procedural
    material.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
            // Ruido procedural simple
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            // Variar el color según la posición
            vec3 variation = vec3(random(vUv * 5.0) * 0.2);
            vec4 baseColor = vec4(diffuseColor.rgb + variation, diffuseColor.a);

            gl_FragColor = baseColor;
            #include <dithering_fragment>
            `
        );
    };

    // Crear geometría con más irregularidades
    geometry = createStoneGeometry(geometry);

    const positionAttribute = geometry.attributes.position;
    const vertexCount = positionAttribute.count;

    // Variar los vértices con un rango más amplio para mayor rugosidad
    for (let i = 0; i < vertexCount; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = positionAttribute.getZ(i);

        // Desplazamiento más notorio
        positionAttribute.setX(i, x + (Math.random() - 0.5) * 0.2);
        positionAttribute.setY(i, y + (Math.random() - 0.5) * 0.2);
        positionAttribute.setZ(i, z + (Math.random() - 0.5) * 0.2);
    }

    positionAttribute.needsUpdate = true; // Aplicar cambios
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
