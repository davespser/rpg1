import * as THREE from 'three';

// Función para obtener materiales de hielo
export function getIceMaterials() {
    const materials = [];

    // Shader 1: Hielo simple con transparencia variable
    materials.push(new THREE.ShaderMaterial({
        transparent: true,
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
        `,
    }));

    // Shader 2: Hielo con patrón fractal
    materials.push(new THREE.ShaderMaterial({
        transparent: true,
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
        `,
    }));

    // Shader 3: Hielo con efecto de brillo
    materials.push(new THREE.ShaderMaterial({
        transparent: true,
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
                vec3 baseColor = vec3(0.7, 0.9, 1.0); // Azul claro brillante
                float brightness = sin(vUv.x * 10.0) * 0.1;
                gl_FragColor = vec4(baseColor + brightness, 0.8);
            }
        `,
    }));

    // Shader 4: Hielo con grietas
    materials.push(new THREE.ShaderMaterial({
        transparent: true,
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
                float cracks = step(0.9, random(vUv * 10.0));
                vec3 crackColor = vec3(0.1, 0.1, 0.1); // Gris oscuro para grietas
                gl_FragColor = vec4(mix(baseColor, crackColor, cracks), 0.8);
            }
        `,
    }));

    // Puedes continuar añadiendo más shaders (Shader 5 a Shader 10)...

    return materials;
}
