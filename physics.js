import RAPIER from '@dimforge/rapier3d-compat';

export class TerrainPhysics {
  constructor(size, subdivisions) {
    this.size = size;
    this.subdivisions = subdivisions;
  }

  async initialize() {
    await RAPIER.init();
    this.world = this.createWorld();
  }

  createWorld() {
    const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    this.createTerrain(world);
    return world;
  }

  createTerrain(world) {
    const heights = new Float32Array((this.subdivisions + 1) * (this.subdivisions + 1));
    for (let z = 0; z <= this.subdivisions; z++) {
      for (let x = 0; x <= this.subdivisions; x++) {
        const u = (x / this.subdivisions) * 2 - 1; // Normalize to [-1, 1]
        const v = (z / this.subdivisions) * 2 - 1;
        heights[z * (this.subdivisions + 1) + x] = Math.sin(u * Math.PI * 0.5) * Math.cos(v * Math.PI * 0.5) * 2;
      }
    }

    const scale = new RAPIER.Vector3(this.size, 1, this.size);
    console.log('Subdivisions:', this.subdivisions);
    console.log('Heights array:', heights);
    console.log('Terrain scale:', scale);
    console.log('Rapier version:', RAPIER.version()); // Log Rapier version for debugging

    // Create collider for heightfield
    const heightfield = RAPIER.ColliderDesc.heightfield(this.subdivisions + 1, this.subdivisions + 1, heights, scale);
    try {
      world.createCollider(heightfield);
    } catch (error) {
      console.error('Error creating heightfield collider:', error);
    }
  }

  createDynamicBody(position, size) {
    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(position.x, position.y, position.z);
    const rigidBody = this.world.createRigidBody(rigidBodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
    this.world.createCollider(colliderDesc, rigidBody);
    return rigidBody;
  }

  update(deltaTime) {
    this.world.step(deltaTime);
  }

  getWorld() {
    return this.world;
  }
}
