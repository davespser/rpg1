import RAPIER from '@dimforge/rapier3d-compat';

// Función para crear el mundo físico
function createWorld() {
    try {
        const gravity = { x: 0, y: -9.81, z: 0 }; // Gravedad en el eje Y, similar a la Tierra
        return new RAPIER.World(gravity);
    } catch (error) {
        console.error('Error creating physics world:', error);
        throw error;
    }
}

// Función para agregar un terreno geométrico
function addTerrain(world) {
    // Dimensiones del terreno
    const width = 10;
    const depth = 10;

    // Alturas del terreno 
    // Usamos una función para generar alturas que aseguremos que cada valor es un número válido
    const heights = new Array(width * depth).fill(0).map(() => Math.random() * 5); // Genera alturas aleatorias entre 0 y 5

    // Validación de que 'heights' tiene la longitud correcta
    if (heights.length !== width * depth) {
        throw new Error(`Heights array should have ${width * depth} elements but has ${heights.length}`);
    }

    const scale = { x: 1, y: 1, z: 1 }; // Escala del terreno
    const terrainColliderDesc = RAPIER.ColliderDesc.heightfield(
        new Float32Array(heights), // Convertimos heights a un Float32Array ya que RAPIER espera un TypedArray
        width,
        depth,
        scale
    );

    try {
        world.createCollider(terrainColliderDesc);
    } catch (error) {
        console.error('Error creating terrain collider:', error);
        throw error;
    }
}

// Crear un cuerpo dinámico (por ejemplo, una caja)
function createDynamicBody(world, position, size) {
    try {
        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(position.x, position.y, position.z);
        const rigidBody = world.createRigidBody(rigidBodyDesc);
        
        const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
        world.createCollider(colliderDesc, rigidBody);
        
        return rigidBody;
    } catch (error) {
        console.error('Error creating dynamic body:', error);
        throw error;
    }
}

// Actualización del mundo físico
function updatePhysics(world, deltaTime = 1 / 60) {
    try {
        world.step(deltaTime);
    } catch (error) {
        console.error('Error updating physics world:', error);
        throw error;
    }
}

export { createWorld, addTerrain, createDynamicBody, updatePhysics };
