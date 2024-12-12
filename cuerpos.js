import * as CANNON from 'cannon-es';

export function crearCuboFisico() {
    // Crear un cuerpo físico para el cubo
    const cuboBody = new CANNON.Body({
        mass: 1,  // Masa del cubo
        position: new CANNON.Vec3(0, 5, 0),  // Posición inicial
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)) // Forma del cubo
    });

    // Eliminar o reducir el damping para permitir un movimiento más fluido
    cuboBody.linearDamping = 0.05; // Reducir damping
    cuboBody.angularDamping = 0.05; // Reducir damping

    return cuboBody;
}
