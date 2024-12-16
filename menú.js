export function crearMenuEstadisticas() {
    const menuHTML = `
        <div id="menu" class="hidden">
            <h3>Estadísticas</h3>
            <div class="stat">Vida: <span id="vida">100</span></div>
            <div class="stat">Energía: <span id="energia">100</span></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', menuHTML);

    document.getElementById('toggleMenu').addEventListener('click', () => {
        document.getElementById('menu').classList.toggle('hidden');
    });
}
