import RAPIER from '@dimforge/rapier3d-compat';

export class PhysicsEngine {
  static async init() {
    // Initialize RAPIER WASM
    await RAPIER.init();
    
    // Create world with gravity
    const world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
    
    return new PhysicsEngine(world);
  }

  constructor(world) {
    this.world = world;
  }

  step() {
    this.world.step();
  }

  createCollider(desc) {
    return this.world.createCollider(desc);
  }

  createRigidBody(desc) {
    return this.world.createRigidBody(desc);
  }
}
