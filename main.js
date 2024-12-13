import RAPIER from '@dimforge/rapier3d-compat';
import Joystick from './joystick.js';
import { setupScene } from './setupScene.js';

RAPIER.init().then(() => {
    const { scene, camera, renderer, controls, updatePhysics, applyMovement } = setupScene(document.body);
    // ... resto del código
});
let joystick = new Joystick({
    container: document.body, // O donde quieras que aparezca el joystick
    radius: 100, // Tamaño del área de control
    innerRadius: 50, // Tamaño del stick
    position: { x: 20, y: 20 } // Posición del joystick en la pantalla
});

// Luego, en tu bucle de animación o donde controles el movimiento:
function animate() {
    requestAnimationFrame(animate);
    // ... 
    const { x, y } = joystick.getPosition();
    // Aplica movimiento basado en x y y
    const force = new RAPIER.Vector3(x * 5, 0, -y * 5);
    rigidBody.applyImpulse(force, true);

    // ...
}
RAPIER.init().then(() => {
    const { scene, camera, renderer, controls, updatePhysics, applyMovement } = setupScene(document.body);

    function animate() {
        requestAnimationFrame(animate);
        updatePhysics();
        applyMovement();
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
});
