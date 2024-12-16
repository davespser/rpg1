export class Stats {
    constructor() {
        this.vida = 100;
        this.energia = 100;
        this.inicializarUI();
    }

    inicializarUI() {
        this.vidaElemento = document.getElementById('vida');
        this.energiaElemento = document.getElementById('energia');
        this.actualizarUI();
    }

    actualizarUI() {
        if (this.vidaElemento && this.energiaElemento) {
            this.vidaElemento.innerText = this.vida;
            this.energiaElemento.innerText = this.energia;
        }
    }

    modificarVida(valor) {
        this.vida = Math.max(0, this.vida + valor); // Asegurar que vida no sea negativa
        this.actualizarUI();
    }

    modificarEnergia(valor) {
        this.energia = Math.max(0, this.energia + valor); // Asegurar que energía no sea negativa
        this.actualizarUI();
    }
}
