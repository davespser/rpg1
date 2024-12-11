import * as THREE from 'three';

export function crearCubo() {
    // Crear geometría del cubo
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cubo = new THREE.Mesh(geometry, material);

    // Habilitar sombras
    cubo.castShadow = true;
    cubo.receiveShadow = true;

    return cubo;
}

export function crearEsfera() {
    // Crear geometría de la esfera
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const esfera = new THREE.Mesh(geometry, material);

    // Habilitar sombras
    esfera.castShadow = true;
    esfera.receiveShadow = true;

    return esfera;
}
