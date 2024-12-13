// camera.js

import * as THREE from './modulos/three.module.js';

export function setupCamera(container) {
    // Configuración inicial de la cámara
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);

    // Función para ajustar la cámara al redimensionar la ventana
    const onWindowResize = () => {
        camera.as
