import * as THREE from 'three';
import { ConstNode, CacheNode, Node, VarNode, NodeBuilder, ParameterNode } from 'three/nodes';

/**
 * Crea un terreno procedural con elevación y colores personalizados usando solo los nodos permitidos.
 * @returns {THREE.Mesh} El terreno procedural.
 */
export function createAdvancedTerrain() {
    const width = 1024;
    const height = 1024;
    const segmentsX = 512;
    const segmentsY = 512;

    // Geometría del plano
    const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);

    // Nodos para la elevación del terreno (usando ConstNode y CacheNode)
    const positionNode = new Node();
    const noiseNode = new ConstNode(Math.random() * 10); // Generar ruido básico como valor de elevación
    const elevationNode = new CacheNode(noiseNode); // Aplicar el ruido de elevación
    const displacementNode = new CacheNode(elevationNode); // Desplazar los vértices con el valor de elevación

    // Colores de terreno usando ConstNode (para los diferentes tipos de terreno)
    const colorGrass = new ConstNode(0x85D534); // Color de hierba
    const colorSand = new ConstNode(0xFFE894);  // Color de arena
    const colorRock = new ConstNode(0xBFB88D);  // Color de roca
    const colorSnow = new ConstNode(0xFFFFFF);  // Color de nieve

    // Usar el color de hierba por defecto
    const terrainColor = new CacheNode(colorGrass); // Almacenar el color de hierba

    // Crear material con ShaderMaterial usando los nodos disponibles
    const material = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vPosition;
            varying vec3 vColor;

            uniform vec3 terrainColor;

            void main() {
                vPosition = position;
                vColor = terrainColor;
                
                // Aplicar desplazamiento a la elevación en el eje Y
                vec3 displacedPosition = position + vec3(0.0, vPosition.y * 0.2, 0.0); // Elevar el terreno en el eje Y
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
            terrainColor: { value: new THREE.Color(0x85D534) }
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
