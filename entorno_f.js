import * as THREE from 'three';
import { cargarModelo } from './objetos.js'; // Si necesitas cargar un modelo 3D en lugar de un cubo

export function addBuilding(scene, terrainMesh) {
    // Obtener la posición del terreno para colocar el cubo encima
    const terrainPosition = terrainMesh.position;

    // Crear un cubo (edificio)
    const geometry = new THREE.BoxGeometry(50, 100, 50); // Tamaño del cubo (ancho, alto, profundidad)
    const material = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Material gris
    const building = new THREE.Mesh(geometry, material);

    // Posicionar el cubo encima del terreno (ajustar la altura según sea necesario)
    building.position.set(terrainPosition.x, terrainPosition.y + 50, terrainPosition.z); // Ajuste de altura (50)

    // Habilitar las sombras del cubo
    building.castShadow = true;
    building.receiveShadow = true;

    // Añadir el cubo a la escena
    scene.add(building);

    console.log("Cubo (edificio) añadido a la escena en la posición:", building.position);
}
