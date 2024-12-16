import * as THREE from 'three';

// Función para cargar textura
export function loadTexture(texturePath) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      texturePath,
      (texture) => {
        texture.wrapS = THREE.ClampToEdgeWrapping; // No repetir horizontalmente
        texture.wrapT = THREE.ClampToEdgeWrapping; // No repetir verticalmente
        resolve(texture);
      },
      undefined,
      (err) => reject(err)
    );
  });
}

// Función para crear el terreno
export function createTerrain(imageData, texture) {
  const width = imageData.width;
  const height = imageData.height;
  const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv; // Coordenadas UV

  // Ajustar altura de los vértices usando el heightmap
  for (let i = 0; i < position.count; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    const index = (y * width + x) * 4; // Índice RGBA
    const heightValue = imageData.data[index] / 10; // Escalar altura
    position.setZ(i, heightValue);

    // Generar coordenadas UV para estirar la textura
    uv.setXY(i, x / (width - 1), y / (height - 1));
  }

  position.needsUpdate = true;
  uv.needsUpdate = true;
  geometry.computeVertexNormals();

  // Material con la textura
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

  const terrain = new THREE.Mesh(geometry, material);
  terrain.rotation.x = -Math.PI / 2; // Rotar el terreno para que quede horizontal
  terrain.receiveShadow = true;

  return terrain;
}
