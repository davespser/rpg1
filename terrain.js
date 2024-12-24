import * as THREE from 'three';
import { AttributeNode, ConstNode, PropertyNode, ContextNode, UniformNode, VarNode, Node } from 'three/nodes';

/**
 * Crea un terreno procedural con elevación y colores personalizados usando los nodos disponibles.
 * @returns {THREE.Mesh} El terreno procedural.
 */
export function createAdvancedTerrain() {
    const width = 1024;
    const height = 1024;
    const segmentsX = 512;
    const segmentsY = 512;

    // Geometría del plano
    const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);

    // Nodos para la elevación
    const positionNode = new AttributeNode('position', 'vec3');
    const noiseTexture = new THREE.TextureLoader().load('casa.png');
    const noiseNode = new UniformNode(noiseTexture); // Textura de ruido
    const positionFrequency = new ConstNode(0.175);
    const strength = new ConstNode(10.0);

    // Nodos de color (basados en la altura del terreno)
    const colorSand = new ConstNode(new THREE.Color(0xFFE894));  // Color de arena
    const colorGrass = new ConstNode(new THREE.Color(0x85D534)); // Color de hierba
    const colorSnow = new ConstNode(new THREE.Color(0xFFFFFF));  // Color de nieve
    const colorRock = new ConstNode(new THREE.Color(0xBFB88D));  // Color de roca

    // Crear material con nodos
    const material = new Node();

    // Configurar shaders manualmente
    material.vertexShader = `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            vec3 pos = position;
            pos.z += texture2D(${noiseNode.value}, vUv * ${positionFrequency.value}).r * ${strength.value};
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    material.fragmentShader = `
        uniform vec3 colorSand;
        uniform vec3 colorGrass;
        uniform vec3 colorSnow;
        uniform vec3 colorRock;
        varying vec2 vUv;

        void main() {
            float height = texture2D(${noiseNode.value}, vUv).r;
            vec3 color = mix(colorSand, colorGrass, smoothstep(0.0, 0.2, height));
            color = mix(color, colorRock, smoothstep(0.2, 0.4, height));
            color = mix(color, colorSnow, smoothstep(0.4, 1.0, height));
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    material.uniforms = {
        colorSand: { value: colorSand.value },
        colorGrass: { value: colorGrass.value },
        colorSnow: { value: colorSnow.value },
        colorRock: { value: colorRock.value }
    };

    // Crear malla
    const terrain = new THREE.Mesh(geometry, material);

    // Rotar para que esté horizontal
    terrain.rotation.x = -Math.PI / 2;

    // Habilitar sombras
    terrain.receiveShadow = true;

    return terrain;
}
