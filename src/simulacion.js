import { Renderer } from './engine/renderer.js';
import { Terrain } from './objetos/terreno.js';
import { PhysicsBox } from './objetos/physicsBox.js';
import { PhysicsEngine } from './fisicas/physics-engine.js';

export class Simulation {
  constructor() {
    this.physicsObjects = [];
    this.lastTime = 0;
  }

  async init() {
    try {
      // Initialize renderer first
      this.renderer = new Renderer();

      // Initialize physics engine
      this.physics = await PhysicsEngine.init();

      // Create terrain
      this.terrain = new Terrain(this.renderer.scene, this.physics);
      
      // Add physics boxes
      for (let i = 0; i < 10; i++) {
        const box = new PhysicsBox(this.renderer.scene, this.physics);
        this.physicsObjects.push(box);
      }

      // Start animation loop
      this.animate();
    } catch (error) {
      console.error('Failed to initialize simulation:', error);
    }
  }

  animate = (currentTime = 0) => {
    requestAnimationFrame(this.animate);

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Step physics world
    this.physics.step();

    // Update physics objects
    this.physicsObjects.forEach(obj => obj.update());

    // Render scene
    this.renderer.render();
  }
}
