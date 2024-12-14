import * as THREE from 'three';

export class TerrainGeometry {
  constructor(width, height, widthSegments, heightSegments) {
    this.width = width;
    this.height = height;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;
  }

  generate() {
    const geometry = new THREE.PlaneGeometry(
      this.width,
      this.height,
      this.widthSegments,
      this.heightSegments
    );

    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 2];
      vertices[i + 1] = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 2;
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }
}
