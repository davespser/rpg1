import * as THREE from 'three';
import * as RAPIER from './modulos/rapier_wasm3d.js';

export function crearTerreno(scene, world) {
    // Crear geometría y material para el terreno en Three.js
    const terrenoGeometry = new THREE.PlaneGeometry(50, 50);
    const terrenoMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513, side: THREE.DoubleSide });
    const terrenoMesh = new THREE.Mesh(terrenoGeometry, terrenoMaterial);
    terrenoMesh.rotation.x = -Math.PI / 2; // Girar para que quede horizontal
    scene.add(terrenoMesh);

    // Crear el material físico para el terreno
    const materialTerreno = new CANNON.Material();

    // Crear el cuerpo físico para el terreno en Cannon-es
    const terrenoShape = new CANNON.Plane();
    const terrenoBody = new CANNON.Body({
        mass: 0, // El terreno es estático
        shape: terrenoShape,
        material: materialTerreno,
    });
    terrenoBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Alinear con la rotación
    world.addBody(terrenoBody);

    // Agregar un material de contacto para el terreno con otros cuerpos
    const contactoMaterial = new CANNON.ContactMaterial(materialTerreno, materialTerreno, {
        friction: 0.5,  // Fricción adecuada para un movimiento controlado
        restitution: 0.0, // Sin rebote para evitar movimientos no deseados
    });
    world.addContactMaterial(contactoMaterial);

    return { terrenoMesh, terrenoBody };
}
