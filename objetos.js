import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function cargarModeloNegro(posX = 250, posY = 3, posZ = 250) {
    const loader = new GLTFLoader();
    let modeloNegro;

    loader.load(
        'ruta/hacia/tu/modelo/negro.glb',
        function (gltf) {
            // Aquí 'gltf.scene' es el objeto principal del modelo cargado
            modeloNegro = gltf.scene;
            
            // Configura las propiedades del modelo
            modeloNegro.castShadow = true;
            modeloNegro.receiveShadow = true;
            modeloNegro.position.set(posX, posY, posZ);

            // Asegúrate de que el modelo se ajuste a la escala si es necesario
            modeloNegro.scale.set(1, 1, 1); // Ajusta según el tamaño original de tu modelo

            // Si quieres añadir el modelo a la escena, asegúrate de tener una referencia a la escena de Three.js
            // scene.add(modeloNegro); // Descomenta y ajusta según tu implementación

        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('Ocurrió un error al cargar el modelo:', error);
        }
    );

    return modeloNegro; // Nota: Esto retornará undefined si el modelo aún no ha cargado
}

// Manten la función de la esfera si aún la necesitas
export function crearEsfera(posX = 0, posY = 0, posZ = 0) {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const esfera = new THREE.Mesh(geometry, material);
    esfera.castShadow = true;
    esfera.receiveShadow = true;
    esfera.position.set(posX, posY, posZ);
    return esfera;
}
