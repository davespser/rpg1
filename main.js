import RAPIER from '@dimforge/rapier3d-compat';
import Joystick from './joystick.js';
import { setupScene } from './setupScene.js';

RAPIER.init().then(() => {
    const { scene, camera, renderer, controls, updatePhysics, applyMovement } = setupScene(document.body);

    function animate() {
        requestAnimationFrame(animate);
        updatePhysics();
        applyMovement(); // Asegúrate de que esta función se ejecuta para aplicar el movimiento del joystick
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
});
