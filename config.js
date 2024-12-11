export const config = {
    render: {
        width: window.innerWidth,
        height: window.innerHeight,
        clearColor: 0x000000,
        antialias: true,
    },
    camera: {
        fov: 75,
        near: 0.1,
        far: 1000,
        position: { x: 0, y: 5, z: 10 },
        velocidadSeguimiento: 0.1, // Velocidad de seguimiento de la cámara
    },
    joystick: {
    sensibilidad: 0.5,       // Sensibilidad para mover el cubo
    posicion: { left: '20px', bottom: '20px' }, // Posición del joystick en pantalla
    tamaño: 150,             // Tamaño del área del joystick
},
    mundoFisico: {
        gravedad: -9.8,
    },
    controles: {
        velocidadRotacion: 0.1,
    },
    luces: {
        intensidad: 1.5,
    },
    objetos: {
        cubo: {
            tamaño: 1,
        },
        esfera: {
            radio: 1,
        },
    },
};
