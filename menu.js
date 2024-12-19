.radial-menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    background-color: rgba(0, 0, 0, 0.8); /* Hexágono negro */
    clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); /* Forma de hexágono */
    border: 2px solid white; /* Línea en el borde */
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.radial-menu.hidden {
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(0.5);
}

.trapezoid-button {
    width: 100px;
    height: 50px;
    background-color: #007BFF;
    border: 2px solid white;
    clip-path: polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    cursor: pointer;
    position: absolute;
    transition: transform 0.3s ease;
}

/* Posicionando y rotando los trapezoides en los lados del hexágono */
.trapezoid-button:nth-child(1) {
    top: -25px;
    left: 50%;
    transform: translateX(-50%) rotate(0deg);
}

.trapezoid-button:nth-child(2) {
    top: 25%;
    right: -50px;
    transform: translateY(-50%) rotate(60deg);
}

.trapezoid-button:nth-child(3) {
    bottom: 25%;
    right: -50px;
    transform: translateY(50%) rotate(120deg);
}

.trapezoid-button:nth-child(4) {
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
}

.trapezoid-button:nth-child(5) {
    bottom: 25%;
    left: -50px;
    transform: translateY(50%) rotate(240deg);
}

.trapezoid-button:nth-child(6) {
    top: 25%;
    left: -50px;
    transform: translateY(-50%) rotate(300deg);
}

#toggleMenu {
    position: absolute;
    bottom: 10px;
    right: 10px;
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

#toggleMenu:hover {
    background-color: #0056b3;
}
