// Archivo: camara.js
import * as THREE from 'three';

export function crearCamara(objetoSeguido) {
    // Crear una cámara de perspectiva
    const camera = new THREE.PerspectiveCamera(
        75, // Campo de visión (FOV)
        window.innerWidth / window.innerHeight, // Relación de aspecto
        0.1, // Plano cercano
        1000 // Plano lejano
    );

    // Posición inicial de la cámara (detrás y ligeramente arriba del objeto)
    camera.position.set(0, 10, -10);

    // Función para actualizar la posición de la cámara para seguir al objeto
    function actualizarCamara() {
        if (
            objetoSeguido &&
            objetoSeguido.position &&
            objetoSeguido.position instanceof THREE.Vector3
        ) {
            // Interpolar hacia la posición deseada detrás del objeto
            const nuevaPosicion = objetoSeguido.position
                .clone()
                .add(new THREE.Vector3(0, 2, 10)); // Ajustar la distancia y altura
            camera.position.lerp(nuevaPosicion, 0.1);

            // Hacer que la cámara mire hacia el objeto
            camera.lookAt(objetoSeguido.position);
        } else {
            console.error(
                'El objeto seguido no tiene una propiedad position válida o no es un objeto de THREE.Vector3'
            );
        }
    }

    return { camera, actualizarCamara };
}
