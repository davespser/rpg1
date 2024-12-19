export function crearMenuRadial() {
    const menuItems = [
        { id: 'vida', label: 'Vida' },
        { id: 'energia', label: 'Energía' },
        { id: 'ataque', label: 'Ataque' },
        { id: 'defensa', label: 'Defensa' },
        { id: 'velocidad', label: 'Velocidad' },
        { id: 'magia', label: 'Magia' }
    ];

    // Crear HTML del menú radial
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

    // Obtener referencia al botón para alternar el menú
    const toggleMenu = document.getElementById('toggleMenu');
    const menuRadial = document.getElementById('menuRadial');

    // Mostrar/ocultar el menú radial
    toggleMenu.addEventListener('click', () => {
        menuRadial.classList.toggle('hidden');
        console.log("Estado del menú radial:", menuRadial.classList.contains('hidden') ? "Oculto" : "Visible");

        // Obtener los botones del menú cuando se muestra
        const buttons = document.querySelectorAll('.trapezoid-button');
        console.log("Botones:", buttons);

        // Añadir funcionalidad a los botones
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                button.classList.add('expand');
                setTimeout(() => button.classList.remove('expand'), 1000);
                console.log(`Botón ${menuItems[index].label} clickeado`);
            });
        });
    });

    console.log("Menú radial creado y funcionalidad inicializada.");
}
