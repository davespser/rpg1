import * as THREE from 'three';

export function manejarMovimiento(character, deltaTime, input) {
    const velocidad = 5; // Velocidad de movimiento.

    // Determinar la dirección según la entrada del usuario
    const direccion = new THREE.Vector3();
    if (input.forward) direccion.z -= 1;
    if (input.backward) direccion.z += 1;
    if (input.left) direccion.x -= 1;
    if (input.right) direccion.x += 1;

    // Normalizar y escalar la dirección según la velocidad y el tiempo
    direccion.normalize().multiplyScalar(velocidad * deltaTime);

    // Obtener la posición actual del cuerpo físico
    const position = character.body.translation();

    // Actualizar la posición del cuerpo físico
    character.body.setNextKinematicTranslation({
        x: position.x + direccion.x,
        y: position.y,
        z: position.z + direccion.z,
    });

    // Sincronizar la posición del grupo del modelo con el cuerpo físico
    character.position.set(
        character.body.translation().x,
        character.body.translation().y,
        character.body.translation().z
    );
}
