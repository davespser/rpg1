export function createTerrainRigidBody(terrainMesh, world) {
    const vertices = terrainMesh.geometry.attributes.position.array;
    const indices = terrainMesh.geometry.index.array;

    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);
    colliderDesc.setRotation({ x: 0, y: 0, z: 0, w: 1 }); // Rotación por defecto (sin cambios)
    
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
        terrainMesh.position.x, terrainMesh.position.y, terrainMesh.position.z
    );

    const rigidBody = world.createRigidBody(rigidBodyDesc);
    world.createCollider(colliderDesc, rigidBody);
    console.log("Terreno físico configurado correctamente.");
}
