import * as THREE from 'three';
import { NodeBuilder, ConstNode, FunctionNode, Vector2Node, Vector3Node, VaryingNode } from 'three/nodes';

/**
 * Crea un terreno procedural con elevación usando los nodos permitidos.
 * @returns {THREE.Mesh} El terreno procedural.
 */
export function createAdvancedTerrain() {
    const width = 1024;
    const height = 1024;
    const segmentsX = 256;
    const segmentsY = 256;

    // Geometría del plano
    const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
    
    // Eliminar atributos innecesarios
    geometry.deleteAttribute('uv');
    geometry.deleteAttribute('normal');
    
    // Material con NodeMaterial
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
            displacement: { value: 0.5 } // Valor de desplazamiento
        },
        wireframe: false
    });

    // Crear malla con la geometría y material
    const terrain = new THREE.Mesh(geometry, material);

    // Rotar para que esté horizontal
    terrain.rotation.x = -Math.PI / 2;

    // Habilitar sombras
    terrain.receiveShadow = true;

    // Generar ruido en el desplazamiento
    const noiseFunction = new FunctionNode('noise');
    noiseFunction.addFunctionBody(`
        float noise(vec2 p) {
            return sin(p.x) * cos(p.y); // Ejemplo simple de ruido
        }
    `);

    // Modificar la posición en el shader usando ruido
    material.vertexShader = `
        varying vec3 vPosition;
        varying vec3 vColor;
        uniform float displacement;
        
        void main() {
            vPosition = position;
            vec3 displacedPosition = position;
            
            // Aplicar ruido a la altura
            displacedPosition.y += noise(vec2(position.x, position.z)) * displacement;

            vColor = vec3(0.5, 1.0, 0.5); // Color de hierba
            gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
        }
    `;

    return terrain;
}
