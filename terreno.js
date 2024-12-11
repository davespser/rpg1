import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function crearTerreno(scene, world) {
    // Crear geometría y material para el terreno en Three.js
    const terrenoGeometry = new THREE.PlaneGeometry(50, 50);
    const terrenoMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513, side: THREE.DoubleSide });
    const terrenoMesh = new THREE.Mesh(terrenoGeometry, terrenoMaterial);
    terrenoMesh.rotation.x = -Math.PI / 2; // Girar para que quede horizontal
    scene.add(terrenoMesh);

    // Crear el cuerpo físico para el terreno en Cannon-es
    const terrenoShape = new CANNON.Plane();
    const terrenoBody = new CANNON.Body({
        mass: 0, // El terreno es estático
        shape: terrenoShape
    });
    terrenoBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Alinear con la rotación
    world.addBody(terrenoBody);

    return { terrenoMesh, terrenoBody };
}
