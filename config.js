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
        zona: 'body',            // Selector para el área donde aparece el joystick
        modo: 'static',          // Modo del joystick (se podría ajustar si fuera dinámico)
        posicion: { left: '50%', top: '50%' },
        color: 'blue',
        tamaño: 150,
        sensibilidad: 0.1,       // Sensibilidad del joystick para mover el cubo
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
