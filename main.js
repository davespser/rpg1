import RAPIER from '@dimforge/rapier3d-compat';
import { setupScene } from './setupScene.js';

let lastTime = performance.now();

RAPIER.init().then(() => {
    const { scene, 
        camera, 
        renderer, 
        controls, 
        updatePhysics, 
        applyMovement } = setupScene(document.body);

    function animate() {
        console.log('Animating')
        requestAnimationFrame(animate);
        const now = performance.now();
        const deltaTime = (now - lastTime) / 1000; // deltaTime en segundos
        lastTime = now;
        
        updatePhysics(deltaTime); // Pasa deltaTime a updatePhysics
        applyMovement();
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
});
