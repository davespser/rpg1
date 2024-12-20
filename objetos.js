import * as THREE from 'three';
import { RigidBodyDesc, ColliderDesc } from '@dimforge/rapier3d-compat';

export class PhysicsBox {
  constructor(scene, physics, size = 1) {
    this.scene = scene;
    this.physics = physics;
    this.size = size;
    this.createBox();
  }

  createBox() {
    this.createVisualMesh();
    this.createPhysicsBody();
  }

  createVisualMesh() {
    const geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
    const material = new THREE.MeshStandardMaterial({
      color: Math.random() * 0xffffff
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.scene.add(this.mesh);
  }

  createPhysicsBody() {
    const rigidBodyDesc = RigidBodyDesc.dynamic()
      .setTranslation(
        Math.random() * 10 - 5,
        10 + Math.random() * 10,
        Math.random() * 10 - 5
      );
    this.rigidBody = this.physics.createRigidBody(rigidBodyDesc);
    
    const colliderDesc = ColliderDesc.cuboid(
      this.size / 2,
      this.size / 2,
      this.size / 2
    );
    this.physics.createCollider(colliderDesc, this.rigidBody);
  }

  update() {
    const position = this.rigidBody.translation();
    const rotation = this.rigidBody.rotation();
    
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
  }
}
