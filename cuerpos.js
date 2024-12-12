import * as RAPIER from '@dimforge/rapier3d-compat';

export function crearCuboFisico() {
    // Crear un cuerpo físico cubo
    const cuboFisico = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Dynamic)
        .setTranslation(0, 5, 0)
        .build();
    const cuboShape = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).build();

    // Crear el collider para el cubo y añadirlo al cuerpo físico
    const world = new RAPIER.World();
    world.createCollider(cuboShape, cuboFisico);
    
    return cuboFisico;
}
