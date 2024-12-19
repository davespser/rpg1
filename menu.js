document.addEventListener('DOMContentLoaded', () => {
    crearMenuRadial();
});

function crearMenuRadial() {
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
    `;
    document.body.insertAdjacentHTML('beforeend', menuHTML);

    const toggleMenu = document.getElementById('toggleMenu');
    const menuRadial = document.getElementById('menuRadial');

    toggleMenu.addEventListener('click', () => {
        menuRadial.classList.toggle('hidden');
    });
}
