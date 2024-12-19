export function crearMenuEstadisticas() {
    const menuItems = [
        { id: 'vida', label: 'Vida', value: 100 },
        { id: 'energia', label: 'Energía', value: 100 }
    ];

    const totalItems = 6; // Seis trapezoides en total

    const menuHTML = `
        <div id="menuRadial" class="radial-menu hidden" style="--total: ${totalItems}">
            ${menuItems.map((item, index) => `
                <div class="trapezoid-button" style="--i: ${index}">
                    ${item.label}
                </div>
            `).join('')}
            <!-- Rellenar con botones vacíos si hay menos de seis elementos -->
            ${Array.from({ length: totalItems - menuItems.length }, (_, index) => `
                <div class="trapezoid-button" style="--i: ${menuItems.length + index}"></div>
            `).join('')}
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', menuHTML);

    document.getElementById('toggleMenu').addEventListener('click', () => {
        document.getElementById('menuRadial').classList.toggle('hidden');
    });
}
