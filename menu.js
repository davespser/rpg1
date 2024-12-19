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

    // Obtener referencias a los elementos
    const toggleMenu = document.getElementById('toggleMenu');
    const menuRadial = document.getElementById('menuRadial');
    const buttons = document.querySelectorAll('.trapezoid-button');

    // Verificación inicial de los elementos en el DOM
    console.log("Menú radial:", menuRadial);
    console.log("Botones:", buttons);
    console.log("Botón de alternar menú:", toggleMenu);

    // Mostrar/ocultar menú radial
    toggleMenu.addEventListener('click', () => {
        menuRadial.classList.toggle('hidden');
        console.log("Estado del menú radial:", menuRadial.classList.contains('hidden') ? "Oculto" : "Visible");
    });

    // Añadir funcionalidad a los botones
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            button.classList.add('expand');

            // Remover la clase después de un tiempo para permitir reutilizar la animación
            setTimeout(() => button.classList.remove('expand'), 1000);

            console.log(`Botón ${menuItems[index].label} clickeado`);
        });
    });

    console.log("Menú radial creado y funcionalidad inicializada.");
}
