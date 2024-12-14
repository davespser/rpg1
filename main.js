import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d';

// Inicialización de la escena, cámara y renderizador de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Inicialización de Rapier3D
const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0);
const world = new RAPIER.World(gravity);

// Carga de la textura de la imagen y creación del terreno
const loader = new THREE.TextureLoader();
loader.load('ruta/de/tu/imagen.png', (texture) => {
    const geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    geometry.rotateX(-Math.PI / 2);

    const vertices = geometry.attributes.position.array;
    const img = texture.image;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, img.width, img.height).data;

    for (let i = 0; i < vertices.length; i += 3) {
        const x = (i / 3) % img.width;
        const y = Math.floor((i / 3) / img.width);
        const height = data[(y * img.width + x) * 4] / 255;
        vertices[i + 2] = height * 10; // Ajusta la escala de altura
    }

    geometry.attributes.position.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Integración de la física con Rapier3D
    const heightfieldShape = new RAPIER.Heightfield({
        heights: data,
        width: img.width,
        length: img.height,
        scale: new RAPIER.Vector3(1, 10, 1) // Ajusta según tu escala
    });

    const bodyDesc = RAPIER.RigidBodyDesc.fixed();
    const body = world.createRigidBody(bodyDesc);
    world.createCollider(heightfieldShape, body);
});

// Ajustes de cámara y renderizado
camera.position.z = 100;
camera.position.y = 50;
camera.lookAt(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);
    world.step(); // Actualiza la física de Rapier3D
    renderer.render(scene, camera);
}
animate();
