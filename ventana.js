export function manejarRedimension() {
    // Manejar el evento de redimensionar la ventana
    window.addEventListener('resize', () => {
        // Obtener el tamaño de la ventana
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Actualizar la cámara y el renderizador con los nuevos valores
        if (window.camera) {
            window.camera.aspect = width / height;
            window.camera.updateProjectionMatrix();
        }

        if (window.renderer) {
            window.renderer.setSize(width, height);
        }
    });
}

export function manejarPantallaCompleta() {
    // Manejar los eventos para cambiar a pantalla completa y restaurar
    document.addEventListener('keydown', (event) => {
        if (event.key === 'F11') {
            // Si el usuario presiona F11, entrar o salir de pantalla completa
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        }
    });
}
