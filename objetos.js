import * as THREE from 'three';
import { GLTFLoader } from './modulos/GLTFLoader.js';

export function cargarModelo(posX = 250, posY = 3, posZ = 250, rutaModelo = './negro.glb') {
    const loader = new GLTFLoader();
    const modelo = new THREE.Group(); // Grupo para el modelo
    loader.load(
        rutaModelo,
        (gltf) => {
            const objeto = gltf.scene;
            objeto.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true; // Habilitar sombras
                    node.receiveShadow = true;
                }
            });
            objeto.position.set(posX, posY, posZ); // Establecer posición inicial
            modelo.add(objeto); // Agregar el modelo cargado al grupo
        },
        undefined,
        (error) => {
            console.error('Error al cargar el modelo:', error);
        }
    );
    return modelo; // Devuelve el grupo vacío inicialmente
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
