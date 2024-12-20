import RAPIER from '@dimforge/rapier3d-compat';
/**
 * Cargar un cubo con un colisionador de cubo en Rapier
 * @param {number} posX - Posición X inicial del cubo.
 * @param {number} posY - Posición Y inicial del cubo.
 * @param {number} posZ - Posición Z inicial del cubo.
 * @param {RAPIER.World} world - Mundo físico de Rapier.
 * @param {THREE.Scene} scene - Escena de Three.js.
 * @param {boolean} debug - Si es true, muestra el colisionador para depuración.
 * @returns {Promise<object>} Objeto con el cubo, su cuerpo físico y el colisionador.
 */
export function cargarCubo(posX = 0, posY = 0, posZ = 0, world, scene, debug = true) {
    return new Promise((resolve, reject) => {
        // Crear el cubo de Three.js
        const geometry = new THREE.BoxGeometry(10, 10, 10);  // Dimensiones del cubo
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cubo = new THREE.Mesh(geometry, material);

        cubo.position.set(posX, posY, posZ);  // Establecer la posición del cubo
        scene.add(cubo);  // Añadir el cubo a la escena

        // Crear el cuerpo físico con Rapier
        const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(posX, posY + 5, posZ);  // Ajustar la posición según la mitad de la altura del cubo
        const body = world.createRigidBody(bodyDesc);

        // Crear el colisionador de tipo cubo (en este caso un BoxCollider)
        const colliderDesc = RAPIER.ColliderDesc.cuboid(5, 5, 5);  // Tamaño del cubo para el colisionador
        const collider = world.createCollider(colliderDesc, body);

        // Alineación: el cubo y el colisionador están centrados en la misma posición
        cubo.position.set(posX, posY, posZ);  // Asegurarse de que la posición del cubo es correcta

        // Visualización del colisionador para depuración
        if (debug) {
            const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
            const colliderMesh = new THREE.Mesh(geometry, colliderMaterial);
            colliderMesh.position.set(posX, posY, posZ);  // Alineación del colisionador con el cubo
            scene.add(colliderMesh);
        }

        resolve({ modelo: cubo, body, collider });
    });
}
