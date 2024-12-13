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

    // Alturas del terreno (puedes generar dinámicamente o usar ruido)
    // Aquí estamos usando un ejemplo simple, pero en producción podrías usar un generador de terreno.
    const heights = Array.from({ length: width * depth }, (_, index) => {
        const x = index % width;
        const z = Math.floor(index / width);
        return Math.sin(x / 3) * Math.cos(z / 3) * 2; // Ejemplo simple de altura sinusoidal
    });

    const scale = { x: 1, y: 1, z: 1 }; // Escala del terreno
    const terrainColliderDesc = RAPIER.ColliderDesc.heightfield(
        heights,
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
        // Usamos un deltaTime por defecto de 1/60 de segundo, que es común para simulaciones a 60 FPS
        world.step(deltaTime);
    } catch (error) {
        console.error('Error updating physics world:', error);
        throw error;
    }
}

export { createWorld, addTerrain, createDynamicBody, updatePhysics };
