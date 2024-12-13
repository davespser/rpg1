import RAPIER from '@dimforge/rapier3d-compat';
import { setupScene } from './setupScene.js';

RAPIER.init().then(() => {
    const { scene, 
        camera, 
        renderer, 
        controls, 
        updatePhysics, 
        applyMovement } = setupScene(document.body);

    function animate() {
        requestAnimationFrame(animate);
        updatePhysics(); // Llama a updatePhysics sin argumentos, ya que en setupScene es una función sin parámetros
        applyMovement();
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
});
