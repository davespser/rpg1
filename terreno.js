import * as THREE from 'three';
import { ColliderDesc } from '@dimforge/rapier3d-compat';
import { TerrainGeometry } from './terrain-geometry';

export class Terrain {
  constructor(scene, physics) {
    this.scene = scene;
    this.physics = physics;
    this.createTerrain();
  }

  createTerrain() {
    const geometry = new TerrainGeometry(50, 50, 64, 64).generate();
    
    const material = new THREE.MeshStandardMaterial({
      color: 0x3d8b3d,
      wireframe: false,
      side: THREE.DoubleSide
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);

    this.createPhysicsGround();
  }

  createPhysicsGround() {
    const groundColliderDesc = ColliderDesc.cuboid(25, 0.1, 25);
    this.physics.createCollider(groundColliderDesc);
  }
}
