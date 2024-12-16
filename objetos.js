import * as THREE from 'three';

export function crearCubo(posX = 250, posY = 3, posZ = 250) {
    const geometry = new THREE.BoxGeometry(2,2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cubo = new THREE.Mesh(geometry, material);
    cubo.castShadow = true;
    cubo.receiveShadow = true;
    cubo.position.set(posX, posY, posZ); // Establecer posición inicial
    return cubo;
}

export function crearEsfera(posX = 0, posY = 0, posZ = 0) {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const esfera = new THREE.Mesh(geometry, material);
    esfera.castShadow = true;
    esfera.receiveShadow = true;
    esfera.position.set(posX, posY, posZ); // Establecer posición inicial
    return esfera;
}
