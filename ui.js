export function crearUI() {
    // Crear un contenedor para la interfaz
    const interfaz = document.createElement('div');
    interfaz.style.position = 'absolute';
    interfaz.style.top = '10px';
    interfaz.style.left = '10px';
    interfaz.style.color = 'white';
    interfaz.style.fontFamily = 'Arial, sans-serif';
    interfaz.style.zIndex = 10;
    document.body.appendChild(interfaz);

    // Título o información general
    const titulo = document.createElement('h2');
    titulo.innerText = 'Demo Three.js con Físicas';
    interfaz.appendChild(titulo);

    // Crear un indicador de velocidad del cubo (solo como ejemplo)
    const velocidadDiv = document.createElement('div');
    velocidadDiv.innerHTML = 'Velocidad del cubo: <span id="velocidad">0</span>';
    interfaz.appendChild(velocidadDiv);

    // Crear un botón de reinicio
    const botonReiniciar = document.createElement('button');
    botonReiniciar.innerText = 'Reiniciar Escena';
    botonReiniciar.style.marginTop = '10px';
    botonReiniciar.addEventListener('click', () => {
        console.log('Escena reiniciada');
        // Aquí iría la lógica de reiniciar la escena o los objetos
    });
    interfaz.appendChild(botonReiniciar);

    // Devolver el contenedor de interfaz
    return interfaz;
}

export function actualizarVelocidad(velocidad) {
    // Actualiza el valor de la velocidad en la UI
    const velocidadElemento = document.getElementById('velocidad');
    if (velocidadElemento) {
        velocidadElemento.innerText = velocidad.toFixed(2);
    }
}
