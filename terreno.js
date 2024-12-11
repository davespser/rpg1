import * as THREE from 'three';
import * as CANNON from 'cannon';

// Función para crear el terreno
export function crearTerreno(world) {
    // Crear un plano en Three.js (para el terreno visual)
    const terrenoGeometry = new THREE.PlaneGeometry(1000, 1000);  // Tamaño grande
    const terrenoMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
    const terreno = new THREE.Mesh(terrenoGeometry, terrenoMaterial);
    terreno.rotation.x = - Math.PI / 2;  // Rotar para que quede horizontal
    terreno.position.y = -1;  // Colocamos el terreno un poco más abajo en el eje Y
    terreno.receiveShadow = true;  // El terreno puede recibir sombras
    world.scene.add(terreno);

    // Crear el cuerpo físico del terreno en Cannon.js (plano estático)
    const terrenoShape = new CANNON.Plane();  // Un plano en Cannon.js
    const terrenoBody = new CANNON.Body({
        mass: 0,  // El terreno no se mueve, por lo que tiene masa 0
        position: new CANNON.Vec3(0, -1, 0)  // Colocamos el terreno en la misma posición
    });
    terrenoBody.addShape(terrenoShape);
    world.addBody(terrenoBody);

    return terrenoBody;  // Retornamos el cuerpo físico del terreno
}
