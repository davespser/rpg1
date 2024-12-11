// Configuración general
export const config = {
    render: {
        width: window.innerWidth, // Ancho del render
        height: window.innerHeight, // Alto del render
        clearColor: 0x000000, // Color de fondo del render
        antialias: true, // Habilitar antialiasing
    },
    camera: {
        fov: 75, // Campo de visión
        near: 0.1, // Distancia mínima de la cámara
        far: 1000, // Distancia máxima de la cámara
        position: { x: 0, y: 5, z: 10 }, // Posición inicial de la cámara
        seguimientoOffset: { x: 0, y: 2, z: 5 }, // Offset al seguir un objeto
        velocidadSeguimiento: 0.1, // Velocidad de interpolación de la cámara
    },
    mundoFisico: {
        gravedad: -9.8, // Gravedad en el mundo físico
        tiempoPaso: 1 / 60, // Tiempo por paso de simulación
    },
    controles: {
        velocidadRotacion: 0.1, // Velocidad de rotación de la cámara
    },
    luces: {
        intensidad: 1.5, // Intensidad de la luz
        color: 0xffffff, // Color de la luz
    },
    objetos: {
        cubo: {
            tamaño: 1, // Tamaño del cubo
            color: 0xff0000, // Color del cubo
        },
        esfera: {
            radio: 1, // Radio de la esfera
            color: 0x0000ff, // Color de la esfera
        },
    },
    joystick: {
        zona: "body", // Zona para el joystick
        modo: "static", // Modo del joystick
        posicion: { left: "50%", top: "50%" }, // Posición inicial del joystick
        color: "blue", // Color del joystick
        tamaño: 150, // Tamaño del joystick
        sensibilidad: 0.1, // Factor de sensibilidad para el movimiento
    },
};
