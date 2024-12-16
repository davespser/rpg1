export function manejarMovimiento(character, deltaTime, input) {
    const velocidad = 5; // Velocidad de movimiento.

    const direccion = new THREE.Vector3();
    if (input.forward) direccion.z -= 1;
    if (input.backward) direccion.z += 1;
    if (input.left) direccion.x -= 1;
    if (input.right) direccion.x += 1;

    direccion.normalize().multiplyScalar(velocidad * deltaTime);

    // Actualizar la física
    const position = character.body.translation();
    character.body.setNextKinematicTranslation({
        x: position.x + direccion.x,
        y: position.y,
        z: position.z + direccion.z,
    });

    // Sincronizar el modelo con la posición física
    character.children[0].position.copy(character.body.translation()); // El modelo es hijo del grupo
}
