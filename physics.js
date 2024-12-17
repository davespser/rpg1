import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

let world;

export async function initPhysics() {
    // Inicializar RAPIER
    await RAPIER.init();
    world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
    console.log('Mundo de física inicializado:', world);
    return world;
}
export function createTerrainRigidBody(terrainMesh, world) {
    const vertices = terrainMesh.geometry.attributes.position.array;
    const indices = terrainMesh.geometry.index.array;

    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);
    colliderDesc.setRotation({ x: 0, y: 0, z: 0, w: 1 }); // Rotación por defecto (sin cambios)

    // Cambiar la forma de crear el cuerpo físico fijo
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
        terrainMesh.position.x, terrainMesh.position.y, terrainMesh.position.z
    );

    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const collider = world.createCollider(colliderDesc, rigidBody);

    // Añadir un helper para visualizar el colisionador del terreno
    const wireframeGeometry = new THREE.WireframeGeometry(terrainMesh.geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    terrainMesh.add(wireframe);

    console.log("Terreno físico configurado correctamente.");
    return collider;
}


    
export function stepPhysics() {
    if (world) {
        world.step();
    }
}
