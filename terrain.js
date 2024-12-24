import * as THREE from 'three';
import { NodeMaterial, FloatNode, ColorNode, PositionNode, MultiplyNode, AddNode, NoiseNode, StepNode, SmoothstepNode, DisplacementNode } from 'three/nodes';

/**
 * Crea un terreno procedural con elevación y colores personalizados usando three.nodes.
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
    const positionNode = new PositionNode();
    const noiseNode = new NoiseNode(positionNode, 3); // Usar el nodo de ruido para la elevación
    const positionFrequency = new FloatNode(0.175);
    const warpFrequency = new FloatNode(6.0);
    const warpStrength = new FloatNode(1.0);
    const strength = new FloatNode(10.0);

    const warpedPosition = new MultiplyNode(noiseNode, warpFrequency);
    const elevationNode = new MultiplyNode(warpedPosition, strength);
    const displacementNode = new AddNode(positionNode, elevationNode);

    // Nodos de color (basados en la altura del terreno)
    const colorSand = new ColorNode(0xFFE894);  // Color de arena
    const colorGrass = new ColorNode(0x85D534); // Color de hierba
    const colorSnow = new ColorNode(0xFFFFFF);  // Color de nieve
    const colorRock = new ColorNode(0xBFB88D);  // Color de roca

    const heightNode = new FloatNode(1.0); // Usar la altura Z para determinar el color
    const stepSand = new StepNode(heightNode, 10.0);
    const stepRock = new StepNode(heightNode, 20.0);
    
    const smoothStep = new SmoothstepNode(stepSand, stepRock);
    const terrainColor = new MultiplyNode(smoothStep, colorGrass);
    
    // Crear material con nodos
    const material = new NodeMaterial();
    material.color = terrainColor;
    material.vertex = displacementNode; // Aplicar desplazamiento a la geometría

    // Crear malla
    const terrain = new THREE.Mesh(geometry, material);

    // Rotar para que esté horizontal
    terrain.rotation.x = -Math.PI / 2;

    // Habilitar sombras
    terrain.receiveShadow = true;

    return terrain;
}
