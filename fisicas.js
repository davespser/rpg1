import * as RAPIER from '@dimforge/rapier3d-compat';

export function crearMundoFisico() {
    // Crear el mundo físico
    const gravity = { x: 0, y: -9.82, z: 0 }; // Gravedad estándar en la Tierra (hacia abajo)
    const world = new RAPIER.World(gravity);

    // Configuración adicional del mundo físico (si es necesario)
    // Rapier no usa broadphase ni solver de la misma manera que Cannon-es, pero podemos configurar otros parámetros si es necesario

    // Permitir que los objetos "duerman" si no están en movimiento
    world.integrationParameters.erp = 0.2; // Parámetro de relajación de error
    world.integrationParameters.maxVelocityIterations = 8; // Número máximo de iteraciones de velocidad

    return world;
}
