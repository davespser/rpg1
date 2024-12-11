import * as THREE from 'three';

export function crearCamara(objetoSeguido) {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Posición inicial de la cámara (detrás y ligeramente arriba del objeto)
    camera.position.set(0, 5, -10);

    // Actualizar la posición de la cámara para seguir al objeto
    function actualizarCamara() {
    // Suponiendo que objetoSeguido es un cubo o una esfera
    // Asegúrate de que objetoSeguido es un objeto Three.js válido
    if (objetoSeguido && objetoSeguido.position instanceof THREE.Vector3) {
        camera.position.lerp(objetoSeguido.position.clone().add(new THREE.Vector3(0, 2, 10)), 0.1);
        camera.lookAt(objetoSeguido.position);
    } else {
        console.error('El objeto seguido no tiene una propiedad position válida');
    }
    }

    return { camera, actualizarCamara };
}
