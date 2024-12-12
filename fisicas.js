import RAPIER from '@dimforge/rapier3d-compat';
 // Variable para almacenar el módulo RAPIER después de la inicialización

async function RapierPhysics() {
    if (!RAPIER) {
        // Importar dinámicamente si no está inicializado
        RAPIER = RAPIER_MODULE;
        await RAPIER.init();
    }
}

export async function crearMundoFisico() {
    // Asegurarnos de que Rapier esté inicializado
    await RapierPhysics();

    // Crear el mundo físico
    const gravity = { x: 0, y: -9.82, z: 0 };
    const world = new RAPIER.World(gravity);

    // Configuración del mundo físico
    world.integrationParameters.erp = 0.2; // Parámetro de relajación de error
    world.integrationParameters.maxVelocityIterations = 8; // Iteraciones máximas de velocidad

    return world;
}
