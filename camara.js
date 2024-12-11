import * as THREE from 'three';

export function crearCamara(objetoSeguido) {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Posición inicial de la cámara (detrás y ligeramente arriba del objeto)
    camera.position.set(0, 5, -10);

    // Actualizar la posición de la cámara para seguir al objeto
    function actualizarCamara() {
        if (objetoSeguido) {
            // Asegurarse de que la cámara siga al objeto con un offset detrás y arriba
            const offset = new THREE.Vector3(0, 5, -10);
            const posicionDeseada = objetoSeguido.position.clone().add(offset);

            // Suavizado en el movimiento de la cámara (opcional)
            camera.position.lerp(posicionDeseada, 0.1);

            // Orientar la cámara hacia el objeto
            camera.lookAt(objetoSeguido.position);
        }
    }

    return { camera, actualizarCamara };
}
