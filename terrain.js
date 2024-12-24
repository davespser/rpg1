import * as THREE from 'three';
import { ConstNode, NodeBuilder } from 'three/nodes';

/**
 * Crea un terreno procedural con elevación usando los nodos permitidos.
 * @returns {THREE.Mesh} El terreno procedural.
 */
export function createAdvancedTerrain() {
    const width = 1024;
    const height = 1024;
    const segmentsX = 512;
    const segmentsY = 512;

    // Geometría del plano
    const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);

    // Crear un nodo constante para el desplazamiento en el eje Y (se puede reemplazar por ruido o fórmula)
    const displacementNode = new ConstNode(5.0); // Valor de desplazamiento (ajustar según sea necesario)

    // Crear material con ShaderMaterial usando los nodos disponibles
    const material = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vPosition;
            varying vec3 vColor;

            uniform float displacement;

            void main() {
                vPosition = position;
                vec3 displacedPosition = position;
                displacedPosition.y += displacement; // Desplazamiento en el eje Y

                vColor = vec3(0.5, 1.0, 0.5); // Color de hierba
                gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vPosition;
            varying vec3 vColor;

            void main() {
                gl_FragColor = vec4(vColor, 1.0);
            }
        `,
        uniforms: {
            displacement: { value: displacementNode.value } // Pasar el valor del desplazamiento
        },
        wireframe: false
    });

    // Crear malla con la geometría y material
    const terrain = new THREE.Mesh(geometry, material);

    // Rotar para que esté horizontal
    terrain.rotation.x = -Math.PI / 2;

    // Habilitar sombras
    terrain.receiveShadow = true;

    return terrain;
}
