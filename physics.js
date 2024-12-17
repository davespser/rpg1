import RAPIER from '@dimforge/rapier3d-compat';

let world;

export async function initPhysics() {
    // Inicializar RAPIER
    await RAPIER.init();
    // Crear el mundo de física con gravedad
    world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
    console.log('Mundo de física inicializado:', world);
    return world;
}

export async function createTerrainRigidBody(terrainMesh) {
    // Asegurarnos de que el mundo de física esté inicializado
    if (!world) await initPhysics();

    // Obtener las posiciones de los vértices y los índices de la geometría del terreno
    const vertices = terrainMesh.geometry.attributes.position.array;
    const indices = terrainMesh.geometry.index.array;

    // Crear un colisionador de tipo "trimesh" (malla de triángulos) para el terreno
    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);
    
    // Obtener la posición del terreno
    const { x, y, z } = terrainMesh.position;

    // Crear el cuerpo rígido del terreno (fijo)
    const rigidBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z));

    // Crear el colisionador y asociarlo al cuerpo rígido
    world.createCollider(colliderDesc, rigidBody);

    console.log("Colisionador del terreno creado en:", terrainMesh.position);
}

export function stepPhysics() {
    if (world) {
        world.step();
    }
}
