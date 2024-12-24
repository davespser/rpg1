import * as THREE from 'three';
import { NodeBuilder, ConstNode, CacheNode, ParameterNode } from 'three/nodes';

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

    // Crear un NodeBuilder para manipular la geometría de los vértices
    const builder = new NodeBuilder();

    // Crear un valor de elevación usando un ConstNode (puedes reemplazarlo con algo más dinámico como ruido)
    const heightNode = new ConstNode(1.0); // Puedes cambiar esto a un valor diferente para experimentar
    const displacementNode = heightNode; // Usamos este nodo para controlar la elevación en el eje Y

    // Establecer la posición de los vértices en el eje Y para que sea dinámico
    builder.addVertexDisplacement(displacementNode);

    // Crear material con ShaderMaterial usando los nodos disponibles
    const material = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vPosition;
            varying vec3 vColor;

            uniform float displacement;

            void main() {
                vPosition = position;
                vec3 displacedPosition = position;
                displacedPosition.y += displacement; // Elevar el terreno en el eje Y

                vColor = vec3(0.5, 1.0, 0.5); // Color de hierba (puedes cambiarlo)
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
            displacement: { value: 10.0 } // Controlar cuánto se eleva el terreno
        },
        wireframe: false
    });

    // Crear malla con la geometría modificada
    const terrain = new THREE.Mesh(geometry, material);

    // Rotar para que esté horizontal
    terrain.rotation.x = -Math.PI / 2;

    // Habilitar sombras
    terrain.receiveShadow = true;

    return terrain;
}
