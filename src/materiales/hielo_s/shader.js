// Shaders separados
export const IceShaders = {
    simple: {
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            void main() {
                vec3 baseColor = vec3(0.6, 0.8, 1.0); // Azul claro
                float alpha = 0.7 + sin(vUv.x * 3.14159) * 0.3; // Variación en transparencia
                gl_FragColor = vec4(baseColor, alpha);
            }
        `
    },
    fractal: {
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;

            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            void main() {
                vec3 baseColor = vec3(0.6, 0.8, 1.0); // Azul claro
                float noise = random(vUv * 10.0);
                gl_FragColor = vec4(baseColor * (0.8 + noise * 0.2), 0.9);
            }
        `
    },
    // Otros shaders como `brillo`, `grietas`, etc.
};

// Función para crear un material con un shader específico
export function createShaderMaterial(shader) {
    return new THREE.ShaderMaterial({
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        transparent: true,
    });
}
