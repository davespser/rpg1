import * as CANNON from 'cannon-es';

export function crearCuboFisico() {
    // Crear un cuerpo físico para el cubo
    const cuboBody = new CANNON.Body({
        mass: 1,  // Masa del cubo
        position: new CANNON.Vec3(0, 5, 0),  // Posición inicial
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)) // Forma del cubo
    });

    cuboBody.linearDamping = 0.1; // Damping de velocidad lineal
    cuboBody.angularDamping = 0.1; // Damping de rotación

    return cuboBody;
}

export function crearEsferaFisica() {
    // Crear un cuerpo físico para la esfera
    const esferaBody = new CANNON.Body({
        mass: 1,  // Masa de la esfera
        position: new CANNON.Vec3(2, 5, 0),  // Posición inicial
        shape: new CANNON.Sphere(0.5) // Forma de la esfera
    });

    esferaBody.linearDamping = 0.1; // Damping de velocidad lineal
    esferaBody.angularDamping = 0.1; // Damping de rotación

    return esferaBody;
}
