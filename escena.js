import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function crearEscena() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    const cubeBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 5, 0)
    });
    cubeBody.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
    world.addBody(cubeBody);

    camera.position.z = 5;

    function updatePhysics() {
        world.step(1 / 60);
        cube.position.copy(cubeBody.position);
    }

    return { scene, camera, renderer, updatePhysics };
}
