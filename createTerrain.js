import * as THREE from 'three';

// Función para cargar una textura
export function loadTexture(texturePath) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      texturePath,
      (texture) => {
        // Configuración de repetición y envoltura de la textura
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4); // Repetir la textura 4x4
        resolve(texture);
      },
      undefined,
      (err) => reject(err)
    );
  });
}

// Función para crear el terreno con altura y textura
export function createTerrain(imageData, terrainTexture) {
  const width = imageData.width;
  const height = imageData.height;
  const vertices = [];
  const indices = [];
  const scale = 1; // Ajusta la escala del terreno
  const heightScale = 50; // Ajusta la altura máxima del terreno

  for (let z = 0; z < height; z++) {
    for (let x = 0; x < width; x++) {
      const index = (z * width + x) * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];

      // Promedio de RGB como altura normalizada
      const heightValue = ((r + g + b) / 3) / 255;
      const y = heightValue * heightScale * scale;

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
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  // Material con textura y ajustes de iluminación
  const material = new THREE.MeshStandardMaterial({
    map: terrainTexture, // Textura aplicada
    metalness: 0.2,
    roughness: 0.8,
  });

  const terrainMesh = new THREE.Mesh(geometry, material);
  terrainMesh.castShadow = true;
  terrainMesh.receiveShadow = true;

  return terrainMesh;
}
