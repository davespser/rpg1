
import * as THREE from 'three';

export function crearEscena() {
    // Crear la escena
    const scene = new THREE.Scene();

    // Crear una cámara (perspectiva)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Crear un renderer (motor de renderizado)
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Crear un cubo
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Posicionar la cámara
    camera.position.z = 5;

    return { scene, camera, renderer, cube };
}
