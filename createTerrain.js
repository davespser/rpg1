import * as THREE from 'three';

/**
 * Carga una textura desde una URL.
 * @param {string} texturePath - Ruta de la textura.
 * @returns {Promise<THREE.Texture>} Promesa que resuelve con la textura cargada.
 */
export function loadTexture(texturePath) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(
            texturePath,
            (texture) => {
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                resolve(texture);
            },
            undefined,
            (err) => reject(new Error(`Error al cargar la textura: ${texturePath}\n${err.message}`))
        );
    });
}

/**
 * Crea un terreno basado en un heightmap y una textura.
 * @param {ImageData} imageData - Datos del mapa de altura.
 * @param {THREE.Texture} texture - Textura para aplicar al terreno.
 * @returns {THREE.Mesh} El Mesh del terreno.
 */
export function createTerrain(imageData, texture) {
    const width = imageData.width;
    const height = imageData.height;

    // Crear geometría de un plano subdividido
    const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
    const position = geometry.attributes.position;
    const uv = geometry.attributes.uv;

    // Ajustar la altura de los vértices usando los datos del heightmap
    for (let i = 0; i < position.count; i++) {
        const x = i % width;
        const y = Math.floor(i / width);
        const index = (y * width + x) * 4; // Índice RGBA
        const heightValue = imageData.data[index] / 10; // Escalar la altura
        position.setZ(i, heightValue);

        // Configurar las coordenadas UV
        uv.setXY(i, x / (width - 1), y / (height - 1));
    }

    // Actualizar atributos de la geometría
    position.needsUpdate = true;
    uv.needsUpdate = true;
    geometry.computeVertexNormals();

    // Material para el terreno
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });

    // Crear el terreno como un Mesh
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2; // Rotar para que quede horizontal
    terrain.receiveShadow = true;

    // Guardar información adicional en userData
    terrain.userData = {
        width: width,
        height: height,
        geometry: geometry,
    };

    return terrain;
}
