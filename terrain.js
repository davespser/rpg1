import * as THREE from 'three';

/**
 * Crea un terreno procedural con elevación y colores personalizados.
 * @returns {THREE.Mesh} El terreno procedural.
 */
export function createAdvancedTerrain() {
    const width = 512;
    const height = 512;
    const segmentsX = 256;
    const segmentsY = 256;

    // Geometría del plano
    const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);

    // Material Shader
    const material = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vPosition;
            varying vec2 vUv;

            uniform float positionFrequency;
            uniform float warpFrequency;
            uniform float warpStrength;
            uniform float strength;

            float noise(vec3 pos) {
                return fract(sin(dot(pos.xyz, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
            }

            void main() {
                vUv = uv;
                vPosition = position.xyz;

                vec3 warpedPosition = position.xyz;
                warpedPosition += noise(position.xyz * positionFrequency * warpFrequency) * warpStrength;

                float elevation = 0.0;
                for (float i = 1.0; i <= 3.0; i++) {
                    float frequency = positionFrequency * i * 2.0;
                    float amplitude = 1.0 / (i * 2.0);
                    elevation += noise(warpedPosition * frequency) * amplitude;
                }

                elevation = pow(abs(elevation), 2.0) * sign(elevation) * strength;

                vec3 newPosition = position.xyz;
                newPosition.z += elevation;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vPosition;
            varying vec2 vUv;

            uniform vec3 colorSand;
            uniform vec3 colorGrass;
            uniform vec3 colorSnow;
            uniform vec3 colorRock;

            void main() {
                float height = vPosition.z;

                vec3 terrainColor = mix(colorSand, colorGrass, smoothstep(0.0, 10.0, height));
                terrainColor = mix(terrainColor, colorRock, smoothstep(10.0, 20.0, height));
                terrainColor = mix(terrainColor, colorSnow, smoothstep(20.0, 30.0, height));

                gl_FragColor = vec4(terrainColor, 1.0);
            }
        `,
        uniforms: {
            positionFrequency: { value: 0.175 },
            warpFrequency: { value: 6.0 },
            warpStrength: { value: 1.0 },
            strength: { value: 10.0 },
            colorSand: { value: new THREE.Color('#ffe894') },
            colorGrass: { value: new THREE.Color('#85d534') },
            colorSnow: { value: new THREE.Color('#ffffff') },
            colorRock: { value: new THREE.Color('#bfbd8d') }
        },
        wireframe: false,
    });

    // Crear malla
    const terrain = new THREE.Mesh(geometry, material);

    // Rotar para que esté horizontal
    terrain.rotation.x = -Math.PI / 2;

    // Habilitar sombras
    terrain.receiveShadow = true;

    return terrain;
}
