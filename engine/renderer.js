import * as THREE from '/modulos/three.module.js';

export class Renderer {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    
    this.setupCamera();
    this.setupRenderer();
    this.setupLights();
    this.setupResizeHandler();
  }

  setupCamera() {
    this.camera.position.set(0, 10, 20);
    this.camera.lookAt(0, 0, 0);
  }

  setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.querySelector('#app').appendChild(this.renderer.domElement);
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  setupResizeHandler() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
