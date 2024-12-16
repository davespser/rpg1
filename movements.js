export function handleMovement(character, deltaTime, input) {
  const speed = 5; // Velocidad de movimiento.

  const direction = new THREE.Vector3();
  if (input.forward) direction.z -= 1;
  if (input.backward) direction.z += 1;
  if (input.left) direction.x -= 1;
  if (input.right) direction.x += 1;

  direction.normalize().multiplyScalar(speed * deltaTime);

  // Actualizar física
  const position = character.body.translation();
  character.body.setNextKinematicTranslation({
    x: position.x + direction.x,
    y: position.y,
    z: position.z + direction.z,
  });

  // Sincronizar el modelo con la posición física
  character.model.position.copy(character.body.translation());
}
