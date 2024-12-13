export default class Joystick {
    constructor(options) {
        this.container = options.container || document.body;
        this.radius = options.radius || 100;
        this.innerRadius = options.innerRadius || 50;
        this.position = options.position || { x: 20, y: 20 };

        this.base = null;
        this.stick = null;
        this.x = 0;
        this.y = 0;

        this.createJoystick();
        this.setupEventListeners();
    }

    createJoystick() {
        this.base = document.createElement('div');
        this.base.style.cssText = `
            position: absolute; 
            bottom: ${this.position.y}px; 
            left: ${this.position.x}px; 
            width: ${this.radius * 2}px; 
            height: ${this.radius * 2}px; 
            background: rgba(0,0,0,0.5); 
            border: 2px solid #fff; 
            border-radius: 50%; 
            z-index: 10;
        `;

        this.stick = document.createElement('div');
        this.stick.style.cssText = `
            position: absolute; 
            width: ${this.innerRadius * 2}px; 
            height: ${this.innerRadius * 2}px; 
            background: rgba(255,255,255,0.5); 
            border: 2px solid #000; 
            border-radius: 50%; 
            left: ${this.radius - this.innerRadius}px; 
            top: ${this.radius - this.innerRadius}px;
        `;

        this.base.appendChild(this.stick);
        this.container.appendChild(this.base);
    }

    setupEventListeners() {
        this.base.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
        this.base.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
        this.base.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
    }

    handleTouchStart(event) {
        event.preventDefault();
        this.updateStick(event.touches[0]);
    }

    handleTouchMove(event) {
        event.preventDefault();
        this.updateStick(event.touches[0]);
    }

    handleTouchEnd(event) {
        event.preventDefault();
        this.resetStick();
    }

    updateStick(touch) {
        const x = touch.clientX - this.base.offsetLeft - this.radius;
        const y = touch.clientY - this.base.offsetTop - this.radius;

        const distance = Math.sqrt(x*x + y*y);
        const maxDistance = this.radius - this.innerRadius;

        if (distance > maxDistance) {
            const angle = Math.atan2(y, x);
            this.x = Math.cos(angle) * maxDistance / maxDistance;
            this.y = Math.sin(angle) * maxDistance / maxDistance;
        } else {
            this.x = x / maxDistance;
            this.y = y / maxDistance;
        }

        this.stick.style.left = (x + this.radius - this.innerRadius) + 'px';
        this.stick.style.top = (y + this.radius - this.innerRadius) + 'px';
    }

    resetStick() {
        this.stick.style.left = (this.radius - this.innerRadius) + 'px';
        this.stick.style.top = (this.radius - this.innerRadius) + 'px';
        this.x = 0;
        this.y = 0;
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }
}
