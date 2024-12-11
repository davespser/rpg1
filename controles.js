import { OrbitControls } from 'orbit-controls';

export function crearControles(camera, renderer) {
    const controles = new OrbitControls(camera, renderer.domElement);
    controles.enableDamping = true; // Movimiento suave
    controles.dampingFactor = 0.05;

    return controles;
}
