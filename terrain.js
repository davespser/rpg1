import * as THREE from 'three';

/**
 * Cargar el mapa de altura desde una ruta.
 * @param {string} path - Ruta del mapa de altura.
 * @returns {Promise<ImageData>} Promesa que resuelve con los datos del mapa de altura.
 */
export function cargarMapaDeAltura(path) {
    return new Promise((resolve, reject) => {
        new THREE.TextureLoader().load(
            path,
            (texture) => {
                const canvas = document.createElement('canvas');
                canvas.width = texture.image.width;
                canvas.height = texture.image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(texture.image, 0, 0);
                resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
            },
            undefined,
            (err) => reject(err)
        );
    });
}

/**
 * Crear un terreno a partir del mapa de altura y la textura.
 * @param {ImageData} imageData - Datos del mapa de altura.
 * @param {THREE.Texture} texture - Textura que se aplicará al terreno.
 * @returns {THREE.Mesh} El mesh que representa el terreno.
 */
export function createTerrain(imageData, texture) {
    const width = imageData.width;
    const height = imageData.height;

    // Crear geometría de un plano subdividido
    const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
    const position = geometry.attributes.position;
    const uv = geometry.attributes.uv;

    // Ajustar la altura de los vértices según el mapa de altura
    for (let i = 0; i < position.count; i++) {
        const x = i % width;
        const y = Math.floor(i / width);
        const index = (y * width + x) * 4; // Índice en el mapa RGBA
        const heightValue = imageData.data[index] / 10; // Ajuste de altura
        position.setZ(i, heightValue);
        uv.setXY(i, x / (width - 1), y / (height - 1));
    }

    // Actualizar la geometría
    position.needsUpdate = true;
    uv.needsUpdate = true;
    geometry.computeVertexNormals();

    // Crear material con textura
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });

    // Crear el mesh del terreno
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2; // Rotar el terreno para hacerlo horizontal
    terrain.receiveShadow = true;

    return terrain;
}
