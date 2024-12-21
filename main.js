import * as THREE from 'three';
import { createCube } from './plane_a.js';  // Importar la función desde plane_a.js

// Inicializar la escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear un cubo utilizando la función importada
const cube = createCube(
  { x: 0, y: 5, z: 0 },          // Posición del cubo
  { x: 0, y: Math.PI / 4, z: 0 }, // Rotación del cubo
  { x: 10, y: 10, z: 10 },        // Tamaño del cubo
  { x: 10, y: 10, z: 10 }         // Subdivisiones
);

// Agregar el cubo a la escena
scene.add(cube);

// Configurar la cámara
camera.position.z = 50;

// Función de animación
function animate() {
  requestAnimationFrame(animate);
  
  // Rotar el cubo para visualizar el cambio
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Renderizar la escena
  renderer.render(scene, camera);
}

// Ejecutar la animación
animate();
