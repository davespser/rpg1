// Configuración general
export const config = {
    render: {
        width: window.innerWidth,  // Ancho del render
        height: window.innerHeight, // Alto del render
        clearColor: 0x000000, // Color de fondo del render
        antialias: true, // Habilitar antialiasing
    },
    camera: {
        fov: 75, // Campo de visión
        near: 0.1, // Distancia mínima de la cámara
        far: 1000, // Distancia máxima de la cámara
        position: { x: 0, y: 5, z: 10 }, // Posición inicial de la cámara
    },
    mundoFisico: {
        gravedad: -9.8, // Gravedad en el mundo físico
    },
    controles: {
        velocidadRotacion: 0.1, // Velocidad de rotación de la cámara
    },
    luces: {
        intensidad: 1.5, // Intensidad de la luz
    },
    objetos: {
        cubo: {
            tamaño: 1, // Tamaño del cubo
        },
        esfera: {
            radio: 1, // Radio de la esfera
        },
    },
};
