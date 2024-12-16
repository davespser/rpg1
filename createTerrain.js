import * as THREE from 'three';

// Función para cargar textura
export function loadTexture(path) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      path,
      (texture) => resolve(texture),
      undefined,
      (err) => reject(err)
    );
  });
}

// Función para crear el terreno
export function createTerrain(imageData, texture) {
  const width = imageData.width;
  const height = imageData.height;
  const vertices = [];
  const indices = [];
  const scale = 1; // Escala del terreno

  for (let z = 0; z < height; z++) {
    for (let x = 0; x < width; x++) {
      const index = (z * width + x) * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];

      // Altura basada en la media de RGB
      const heightValue = ((r + g + b) / 3) / 255; // Normalizado
      const y = heightValue * 50 * scale; // Altura máxima ajustada

      vertices.push(x * scale, y, z * scale);

      if (x < width - 1 && z < height - 1) {
        const a = z * width + x;
        const b = z * width + x + 1;
        const c = (z + 1) * width + x;
        const d = (z + 1) * width + x + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE
