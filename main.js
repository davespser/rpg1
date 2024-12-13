import RAPIER from '@dimforge/rapier3d-compat';
import { setupScene } from './escena.js';

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
