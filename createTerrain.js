export function createTerrain(imageData, texture, world) {
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

    // Verificar mundo de física
    if (!world) {
        throw new Error("El mundo de física (world) no está definido.");
    }

    // Verificar geometría e índices
    if (!geometry.attributes.position) {
        throw new Error("La geometría del terreno no tiene atributos de posición.");
    }
    const vertices = geometry.attributes.position.array;
    const indices = geometry.index ? geometry.index.array : null;
    if (!indices) {
        throw new Error("La geometría del terreno no tiene índices.");
    }

    // Crear el colisionador para el terreno
    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices)
        .setFriction(0.8)
        .setRestitution(0.1);

    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed();
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const collider = world.createCollider(colliderDesc, rigidBody);

    console.log("Terreno creado con colisionador:", collider);

    return { terrain, collider };
}
