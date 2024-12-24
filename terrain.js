import * as THREE from 'three';
import { NodeMaterial, FloatNode, ConstNode, PositionNode, MultiplyNode, StepNode, SmoothstepNode } from 'three/nodes';

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
    const noiseNode = new MultiplyNode(positionNode, new ConstNode(0.175)); // Usar multiplicación con ConstNode
    const warpNode = new MultiplyNode(noiseNode, new ConstNode(6.0));
    const strengthNode = new MultiplyNode(warpNode, new ConstNode(10.0));
    
    // Generar desplazamiento de la posición
    const displacementNode = new MultiplyNode(positionNode, strengthNode);

    // Nodos de color (basados en la altura del terreno)
    const colorGrass = new ConstNode(0x85D534); // Color de hierba
    const colorSand = new ConstNode(0xFFE894);  // Color de arena
    const colorRock = new ConstNode(0xBFB88D);  // Color de roca
    const colorSnow = new ConstNode(0xFFFFFF);  // Color de nieve
    
    // Usar nodos Step y Smoothstep para determinar la transición de colores
    const stepSand = new StepNode(displacementNode, new ConstNode(10.0));
    const stepRock = new StepNode(displacementNode, new ConstNode(20.0));
    
    const smoothStep = new SmoothstepNode(stepSand, stepRock);
    const terrainColor = new MultiplyNode(smoothStep, colorGrass); // Mezclar colores

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
