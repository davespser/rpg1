import * as THREE from 'three';

export function createTerrain(imageData, terrainTexture) {
  const width = imageData.width;
  const height = imageData.height;
  const vertices = [];
  const indices = [];
  const scale = 1; // Escala del terreno

  // Generar vértices y caras a partir del heightmap
  for (let z = 0; z < height; z++) {
    for (let x = 0; x < width; x++) {
      const index = (z * width + x) * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];

      const heightValue = ((r + g + b) / 3) / 255; // Normalizado a [0, 1]
      const y = heightValue * 50 * scale;

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

  // Crear la geometría
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  // **Aplicar la textura al material**
  terrainTexture.wrapS = THREE.RepeatWrapping;
  terrainTexture.wrapT = THREE.RepeatWrapping;
  terrainTexture.repeat.set(10, 10); // Ajusta el tamaño del mosaico de la textura

  const material = new THREE.MeshStandardMaterial({
    map: terrainTexture, // Asignar la textura
    metalness: 0.3,
    roughness: 0.8,
  });

  const terrainMesh = new THREE.Mesh(geometry, material);
  terrainMesh.receiveShadow = true;

  return terrainMesh;
}
