export function crearMenuEstadisticas() {
    const menuItems = [
        { id: 'vida', label: 'Vida', value: 100 },
        { id: 'energia', label: 'Energía', value: 100 }
    ];

    const totalItems = menuItems.length;

    const menuHTML = `
        <div id="menuRadial" class="radial-menu hidden" style="--total: ${totalItems}">
            ${menuItems.map((item, index) => `
                <div class="radial-item" style="--i: ${index}">
                    ${item.label}
                </div>
            `).join('')}
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', menuHTML);

    document.getElementById('toggleMenu').addEventListener('click', () => {
        document.getElementById('menuRadial').classList.toggle('hidden');
    });
}
