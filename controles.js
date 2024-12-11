import { OrbitControls } from './modulos/OrbitControls.js'; // Importar desde la carpeta local

export function crearControles(camera, renderer) {
    // Crear instancia de OrbitControls
    const controles = new OrbitControls(camera, renderer.domElement);

    // Configuraciones opcionales
    controles.enableDamping = true; // Suavizar el movimiento
    controles.dampingFactor = 0.05; // Factor de suavizado
    controles.minDistance = 5;      // Distancia mínima de zoom
    controles.maxDistance = 50;     // Distancia máxima de zoom
    controles.maxPolarAngle = Math.PI / 2; // Limitar la inclinación (no mirar debajo del terreno)

    return controles; // Devuelve los controles para que puedan ser actualizados
}
