import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

/**
 * Inicializa la escena principal, cámara, renderizador y controles.
 * @returns {Object} Contiene la escena, cámara, renderizador y controles.
 */
export function initScene() {
    // Crear la escena
    const scene = new THREE.Scene();

    // Configurar la cámara
    const camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        5000
    );
    camera.position.set(100, 80, 150);
    camera.lookAt(0, 0, 0);

    // Configurar el renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Habilitar sombras
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Mejor calidad de sombras
    document.body.appendChild(renderer.domElement);

    // Configurar controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.minDistance = 10;
    controls.maxDistance = 4000;

    // Configurar luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Luz más suave
    scene.add(ambientLight);

    // Configurar luz direccional con sombras
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(100, 100, 100);
    directionalLight.castShadow = true;

    // Configurar sombras de la luz direccional
    directionalLight.shadow.mapSize.width = 2048; // Mayor resolución de sombras
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 3000;
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;

    scene.add(directionalLight);

    // Configuración adicional: Ejes (opcional, para depuración)
    const debugMode = false; // Cambiar a true si necesitas ver los ejes
    if (debugMode) {
        const axesHelper = new THREE.AxesHelper(500);
        scene.add(axesHelper);
    }

    // Manejar redimensionamiento de la ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer, controls };
}
