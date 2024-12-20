import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

/**
 * Carga una textura desde una URL.
 * @param {string} texturePath - Ruta de la textura.
 * @returns {Promise<THREE.Texture>} Promesa que resuelve con la textura cargada.
 */
export function loadTexture(texturePath) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(
            texturePath,
            (texture) => {
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                resolve(texture);
            },
            undefined,
            (err) => reject(new Error(`Error al cargar la textura: ${texturePath}\n${err.message}`))
        );
    });
}

/**
 * Crea un terreno basado en un heightmap y una textura.
 * @param {ImageData} imageData - Datos del mapa de altura.
 * @param {THREE.Texture} texture - Textura para aplicar al terreno.
 * @param {RAPIER.World} world - Mundo de física RAPIER.
 * @returns {Object} El Mesh del terreno y el colisionador.
 */
export function createTerrain(imageData, texture, world) {
    const width = imageData.width;
    const height = imageData.height;

    // Crear geometría de un plano subdividido
    const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
    const position = geometry.attributes.position;
    const uv = geometry.attributes.uv;

    // Ajustar la altura de los vértices usando los datos del heightmap
    for (let i = 0; i < position.count; i++) {
        const x = i % width;
        const y = Math.floor(i / width);
        const index = (y * width + x) * 4; // Índice RGBA
        const heightValue = imageData.data[index] / 10; // Escalar la altura
        position.setZ(i, heightValue);

        // Configurar las coordenadas UV
        uv.setXY(i, x / (width - 1), y / (height - 1));
    }

    // Actualizar atributos de la geometría
    position.needsUpdate = true;
    uv.needsUpdate = true;
    geometry.computeVertexNormals();

    // Material para el terreno
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });

    // Crear el terreno como un Mesh
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2; // Rotar para que quede horizontal
    terrain.receiveShadow = true;

    // Crear el colisionador para el terreno
    const vertices = geometry.attributes.position.array;
    const indices = geometry.index.array;

    // Crear un collider físico en RAPIER con la misma orientación
    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices)
        .setFriction(0.8)
        .setRestitution(0.1);

    // Crear un rigidBody que también será fijo
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed();
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const collider = world.createCollider(colliderDesc, rigidBody);

    // Asegurarnos que la rotación esté alineada
    collider.setRotation(new RAPIER.Quaternion(0, 0, -Math.PI / 2, 0));  // Alineación del colisionador

    // Crear un visualizador para el colisionador (cubo o malla)
    const visualColliderMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000, // Color rojo para el colisionador
        wireframe: true,  // Hacerlo solo con líneas
        transparent: true,
        opacity: 0.5 // Ajusta la transparencia para ver mejor el terreno
    });
    const visualCollider = new THREE.Mesh(geometry, visualColliderMaterial);
    visualCollider.rotation.x = -Math.PI / 2; // Asegurar que coincida con la orientación del terreno

    // Añadir el visualizador del colisionador a la escena
    terrain.add(visualCollider);

    // Crear un objeto visual que seguirá el movimiento del colisionador
    function createColliderVisualizer(rigidBody) {
        const visualGeometry = new THREE.BoxGeometry(5, 5, 5);  // Tamaño de la caja de referencia
        const visualMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        const visualMesh = new THREE.Mesh(visualGeometry, visualMaterial);
        scene.add(visualMesh);

        return visualMesh;
    }

    // Crear un visualizador del colisionador que se actualizará en la animación
    const colliderVisualizer = createColliderVisualizer(rigidBody);

    // Actualizar la posición del visualizador en cada fotograma
    function updateColliderVisualizer() {
        const position = rigidBody.translation(); // Posición física
        const rotation = rigidBody.rotation();    // Rotación física

        // Actualizar la posición y rotación del cubo visualizador
        colliderVisualizer.position.set(position.x, position.y, position.z);
        colliderVisualizer.rotation.set(rotation.x, rotation.y, rotation.z);
    }
function createColliderVisualizer(collider, scene) {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
    });
    const visualizer = new THREE.Mesh(geometry, material);
    scene.add(visualizer);
    return visualizer;
}
    // Actualizar el visualizador de colisionador en cada fotograma de animación
    function animate() {
        requestAnimationFrame(animate);

        // Actualizar la posición del visualizador
        updateColliderVisualizer();

        // Renderizar la escena
        renderer.render(scene, camera);
    }

    // Iniciar la animación para que el visualizador se actualice
    animate();

    console.log("Terreno creado con colisionador:", collider);

    // Devolver tanto el terrain como el collider
    return { terrain, collider };
}
