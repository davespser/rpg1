import * as CANNON from 'cannon-es';

export function crearMundoFisico() {
    // Crear el mundo físico
    const world = new CANNON.World();

    // Configurar gravedad (puedes cambiar los valores para simular diferentes planetas)
    world.gravity.set(0, -9.82, 0); // Gravedad estándar en la Tierra (hacia abajo)

    // Configuración de la colisión (para la resolución de los contactos)
    world.broadphase = new CANNON.NaiveBroadphase(); // Método simple de detección de colisiones
    world.solver = new CANNON.GSSolver(); // Método de resolución de colisiones
    world.allowSleep = true; // Permitir que los objetos "duerman" si no están en movimiento

    return world;
}
