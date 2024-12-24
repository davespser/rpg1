import * as THREE from 'three';
import { Node, NodeUniform, ConstNode, NodeVarying, NodeFunctionInput, NodeFrame, TempNode, VaryingNode } from 'three/tsl';

// Definición de variables para el material
const terrainMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
            vPosition = position;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
            vec3 color = vec3(0.0, 1.0, 0.0); // Color base de césped
            if (vPosition.y > 2.0) {
                color = vec3(1.0, 0.0, 0.0); // Color para áreas más altas (rocosas)
            }
            gl_FragColor = vec4(color, 1.0);
        }
    `
});

const terrainGeometry = new THREE.PlaneGeometry(10, 10, 100, 100);
terrainGeometry.rotateX(-Math.PI / 2);

// Crear el mesh del terreno
const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
terrain.receiveShadow = true;
terrain.castShadow = true;

// Agregar el terreno a la escena
scene.add(terrain);
