export function crearMenuEstadisticas() {
    const menuItems = [
        { id: 'estadisticas', label: 'estadisticas', value: 100 },
        { id: 'configuracion', label: 'configuracion', value: 100 },
        { id: 'inventario', label: 'inventario', value: 100 },
        { id: 'habilidades', label: 'habilidades', value: 100 },
        { id: 'color', label: 'color', value: 100 },
        { id: 'mapa', label: 'mapa', value: 100 }
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
