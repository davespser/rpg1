import * as THREE from 'three';// sky.js

export function createSky(scene) {
  // Shaders para el cielo
  const vertexShader = `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    varying vec3 vWorldPosition;
    void main() {
      float h = normalize(vWorldPosition).y;
      gl_FragColor = vec4(mix(bottomColor, topColor, max(h, 0.0)), 1.0);
    }
  `;

  const skyUniforms = {
    topColor: { value: new THREE.Color(0x0077ff) },
    bottomColor: { value: new THREE.Color(0xffffff) },
  };

  const skyMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: skyUniforms,
    side: THREE.BackSide,
  });

  const skyGeometry = new THREE.SphereGeometry(1000, 32, 15);
  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(sky);

  // Función para actualizar el cielo según la hora del día
  function updateSky() {
    const now = new Date();
    const hours = now.getHours();
    
    let topColor, bottomColor;
    
    if (hours >= 6 && hours < 12) {
      // Mañana
      topColor = new THREE.Color(0x87CEEB);
      bottomColor = new THREE.Color(0xFFFFFF);
    } else if (hours >= 12 && hours < 18) {
      // Tarde
      topColor = new THREE.Color(0x4682B4);
      bottomColor = new THREE.Color(0xFFFFE0);
    } else if (hours >= 18 && hours < 21) {
      // Atardecer
      topColor = new THREE.Color(0xFF4500);
      bottomColor = new THREE.Color(0xFFD700);
    } else {
      // Noche
      topColor = new THREE.Color(0x191970);
      bottomColor = new THREE.Color(0x000000);
    }

    skyUniforms.topColor.value = topColor;
    skyUniforms.bottomColor.value = bottomColor;
  }

  // Llamada a la función para actualizar el cielo en cada frame
  function animate() {
    requestAnimationFrame(animate);
    updateSky();
  }

  animate();
}
