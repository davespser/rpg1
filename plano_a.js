import * as THREE from 'three';

/**
 * Crear un plano dinámico cuya geometría cambia según el día
 * @param {Object} position - Coordenadas de la posición {x, y, z}.
 * @param {Object} rotation - Ángulos de rotación {x, y, z}.
 * @returns {THREE.Mesh} - El plano generado.
 */
export function createPlane(position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }, scale = { x: 0,y: 0, z: 0}) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 - Domingo, 1 - Lunes, ..., 6 - Sábado

  let geometry, material;

  switch (dayOfWeek) {
    case 0: // Domingo: Arena con fractales suaves
      geometry = createFractalGeometry(5, 200, 200, 0.5);
      material = new THREE.MeshStandardMaterial({ color: 0xF4A460, roughness: 1 });
      break;

    case 1: // Lunes: Piedra (Noise rugoso)
      geometry = createNoiseGeometry(5, 200, 200, 1);
      material = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 1 });
      break;

    case 2: // Martes: Hielo (Fractales suaves)
      geometry = createFractalGeometry(5, 200, 200, 0.2);
      material = new THREE.MeshStandardMaterial({ color: 0xADD8E6, roughness: 0.3, metalness: 0.8 });
      break;

    case 3: // Miércoles: Metal (Fractales geométricos)
      geometry = createFractalGeometry(5, 200, 200, 0.05);
      material = new THREE.MeshStandardMaterial({ color: 0xB0C4DE, roughness: 0.5, metalness: 1 });
      break;

    case 4: // Jueves: Madera (Noise orgánico)
      geometry = createNoiseGeometry(5, 200, 200, 0.5);
      material = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7 });
      break;

    case 5: // Viernes: Agua (Ondas dinámicas)
      geometry = createNoiseGeometry(5, 200, 200, 0.3);
      material = new THREE.MeshPhysicalMaterial({ color: 0x1E90FF, roughness: 0, metalness: 0.2, clearcoat: 0.9 });
      break;

    case 6: // Sábado: Lava (Fractales intensos)
      geometry = createFractalGeometry(5, 200, 200, 1);
      material = new THREE.MeshStandardMaterial({ color: 0xFF4500, emissive: 0xFF6347 });
      break;

    default: // Por defecto, un plano simple
      geometry = new THREE.PlaneGeometry(10, 10, 200, 200);
      material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
  }

  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(position.x, position.y, position.z);
  plane.rotation.set(rotation.x, rotation.y, rotation.z);

  return plane;
}

/**
 * Crear una geometría basada en ruido (Noise)
 * @param {number} size - Tamaño del plano.
 * @param {number} widthSegments - Segmentos en el ancho.
 * @param {number} heightSegments - Segmentos en el alto.
 * @param {number} noiseScale - Escala del ruido.
 * @returns {THREE.PlaneGeometry} - Geometría del plano con ruido.
 */
function createNoiseGeometry(size, widthSegments, heightSegments, noiseScale) {
  const geometry = new THREE.PlaneGeometry(size, size, widthSegments, heightSegments);
  const position = geometry.attributes.position;

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);

    // Generar ruido basado en funciones matemáticas (Math.sin y Math.random)
    const noise = (Math.sin(x * noiseScale) + Math.cos(y * noiseScale) + Math.random()) * size * 0.1;
    position.setZ(i, noise);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Crear una geometría fractal
 * @param {number} size - Tamaño del plano.
 * @param {number} widthSegments - Segmentos en el ancho.
 * @param {number} heightSegments - Segmentos en el alto.
 * @param {number} fractalScale - Escala del fractal.
 * @returns {THREE.PlaneGeometry} - Geometría del plano con fractales.
 */
function createFractalGeometry(size, widthSegments, heightSegments, fractalScale) {
  const geometry = new THREE.PlaneGeometry(size, size, widthSegments, heightSegments);
  const position = geometry.attributes.position;

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);

    // Fractal simple utilizando funciones trigonométricas
    let fractalZ = 0;
    let amplitude = 1;
    let frequency = fractalScale;

    for (let j = 0; j < 4; j++) { // 4 octavas de fractal
      fractalZ += amplitude * Math.sin(x * frequency) * Math.cos(y * frequency);
      amplitude *= 0.5;
      frequency *= 2;
    }

    position.setZ(i, fractalZ * size * 0.1);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}
