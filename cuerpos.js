import * as CANNON from 'cannon-es';

import * as CANNON from 'cannon-es';

export function crearCuboFisico(materialCubo) {
    // Crear un cuerpo físico esférico
    const radio = 1; // Ajustar el tamaño del radio según el tamaño visual del cubo
    const cuboShape = new CANNON.Sphere(radio);
    const cuboFisico = new CANNON.Body({
        mass: 1, // Ajusta la masa según sea necesario
        shape: cuboShape,
        material: materialCubo,
    });

    // Posición inicial del cuerpo físico
    cuboFisico.position.set(0, 5, 0);

    return cuboFisico;
}
