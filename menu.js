export function crearMenuRadial() {
    const menuItems = [
        { id: 'vida', label: 'Vida' },
        { id: 'energia', label: 'Energía' },
        { id: 'ataque', label: 'Ataque' },
        { id: 'defensa', label: 'Defensa' },
        { id: 'velocidad', label: 'Velocidad' },
        { id: 'magia', label: 'Magia' }
    ];

    const menuHTML = `
        <div id="menuRadial" class="radial-menu hidden">
            ${menuItems.map((item, index) => `
                <div class="trapezoid-button" style="--i: ${index}">
                    ${item.label}
                </div>
            `).join('')}
        </div>
        <button id="toggleMenu">Toggle Menu</button>
    `;
    document.body.insertAdjacentHTML('beforeend', menuHTML);

    const toggleMenu = document.getElementById('toggleMenu');
    const menuRadial = document.getElementById('menuRadial');
    const buttons = document.querySelectorAll('.trapezoid-button');

    // Mostrar/ocultar menú radial
    toggleMenu.addEventListener('click', () => {
        menuRadial.classList.toggle('hidden');
    });

    // Añadir funcionalidad a cada botón para desplazarse fuera del hexágono
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            button.classList.add('expand');

            // Remover la clase después de un tiempo para permitir reutilizar la animación
            setTimeout(() => button.classList.remove('expand'), 1000);

            console.log(`Botón ${menuItems[index].label} clickeado`);
        });
    });
}
