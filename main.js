import RAPIER from '@dimforge/rapier3d-compat';
import { setupScene } from './setupScene.js';

let lastTime = performance.now();

RAPIER.init().then(async () => {
    try {
        const { scene, 
            camera, 
            renderer, 
            controls, 
            updatePhysics, 
            applyMovement } = await setupScene(document.body);

        function animate() {
            console.log('Animating');
            requestAnimationFrame(animate);
            const now = performance.now();
            const deltaTime = (now - lastTime) / 1000; // deltaTime in seconds
            lastTime = now;
            
            updatePhysics(deltaTime); // Pass deltaTime to updatePhysics
            applyMovement();
            controls.update();
            renderer.render(scene, camera);
        }

        animate();
    } catch (error) {
        console.error('Error setting up the scene:', error);
    }
});
