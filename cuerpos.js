import * as CANNON from 'cannon-es';

export function crearCuboFisico() {
    // Crear un cuerpo físico para el cubo
    const cuboBody = new CANNON.Body({
        mass: 5,  // Masa del cubo
        position: new CANNON.Vec3(0, 5, 0),  // Posición inicial
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)) // Forma del cubo
    });

    // Eliminar o reducir el damping para permitir un movimiento más fluido
     // Reducir damping

    return cuboBody;
}
