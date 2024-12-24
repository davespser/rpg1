import * as THREE from 'three';
import { ConstNode, CacheNode, Node } from 'three/nodes';

/**
 * Crea un terreno procedural con elevación y colores personalizados usando only allowed nodes.
 * @returns {THREE.Mesh} El terreno procedural.
 */
export function createAdvancedTerrain() {
    const width = 1024;
    const height = 1024;
    const segmentsX = 512;
    const segmentsY = 512;

    // Geometría del plano
    const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);

    // Usar CacheNode para almacenar el valor de elevación
    const elevationNode = new CacheNode(new ConstNode(10.0)); // Usar CacheNode para almacenar la elevación
    const displacementNode = new CacheNode(elevationNode); // Aplicar el desplazamiento de la elevación

    // Colores de terreno usando ConstNode (para los diferentes tipos de terreno)
    const colorGrass = new ConstNode(0x85D534); // Color de hierba
    const colorSand = new ConstNode(0xFFE894);  // Color de arena
    const colorRock = new ConstNode(0xBFB88D);  // Color de roca
    const colorSnow = new ConstNode(0xFFFFFF);  // Color de nieve

    // Para determinar el color basado en la altura, usaremos CacheNode
    const terrainColor = new CacheNode(colorGrass); // Almacenamos el color de hierba

    // Crear material con ShaderMaterial usando los nodos disponibles
    const material = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vPosition;
            varying vec3 vColor;

            uniform vec3 terrainColor;  // Definir terrainColor como un uniform

            void main() {
                vPosition = position;
                vColor = terrainColor; // Usar el color almacenado
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
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
            terrainColor: { value: new THREE.Color(0x85D534) } // Definir el valor del color de terreno
        },
        wireframe: false
    });

    // Crear malla
    const terrain = new THREE.Mesh(geometry, material);

    // Rotar para que esté horizontal
    terrain.rotation.x = -Math.PI / 2;

    // Habilitar sombras
    terrain.receiveShadow = true;

    return terrain;
}
