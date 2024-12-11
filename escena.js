// Función en terreno.js
export function crearTerreno(scene, world) {
    const terrenoMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100), // Tamaño del terreno
        new THREE.ShadowMaterial({ opacity: 0.5 })  // Material que proyecta sombra
    );
    terrenoMesh.rotation.x = -Math.PI / 2;  // Girar el terreno para que esté plano
    terrenoMesh.position.set(0, 0, 0);  // Posición del terreno
    terrenoMesh.receiveShadow = true;  // Permite que el terreno reciba sombras
    scene.add(terrenoMesh);  // Añadir el terreno a la escena

    // Crear el cuerpo físico del terreno
    const terrenoShape = new CANNON.Plane();  // Usamos un plano físico
    const terrenoBody = new CANNON.Body({
        mass: 0,  // Masa 0 porque el terreno no se mueve
        position: new CANNON.Vec3(0, 0, 0),  // Posición en el mundo físico
        shape: terrenoShape
    });
    terrenoBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);  // Alineamos el plano físico con el terreno
    world.addBody(terrenoBody);  // Añadir el cuerpo físico al mundo

    return { terrenoMesh, terrenoBody };  // Devolver tanto el mesh como el cuerpo físico
}
