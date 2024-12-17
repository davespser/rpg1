import * as THREE from 'three';
import { GLTFLoader } from "GLTFLoader"; 
import RAPIER from '@dimforge/rapier3d-compat';

// Supongamos que 'world' es una variable global o pasada como parámetro desde main.js o physics.js
let world; // Esta debería ser inicializada fuera de esta función

export function cargarModelo(posX = 250, posY = 5, posZ = 250, rutaModelo = './negro.glb', world) {
    const loader = new GLTFLoader();
    const modelo = new THREE.Group();
    let body; // Para almacenar el cuerpo físico de Rapier

    loader.load(
        rutaModelo,
        (gltf) => {
            const objeto = gltf.scene;
            objeto.scale.set(3, 3, 3);
            objeto.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            objeto.position.set(posX, posY, posZ);

            // Verificar que 'world' está definido antes de usarlo
            if (world && typeof world.createRigidBody === 'function') {
                // Crear un cuerpo físico para el modelo
                const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(posX, posY, posZ);
                body = world.createRigidBody(bodyDesc);

                // Ajustar colisión (aquí usamos una caja como ejemplo, ajusta según tu modelo)
                const colliderDesc = RAPIER.ColliderDesc.cuboid(1.5, 1.5, 1.5); // Ajusta según el tamaño del modelo escalado
                world.createCollider(colliderDesc, body);

                // Sincronización visual con física (esto debería hacerse en cada frame)
                const sync = () => {
                    if (body) {
                        const translation = body.translation();
                        const rotation = body.rotation();
                        objeto.position.set(translation.x, translation.y, translation.z);
                        objeto.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
                    }
                };

                modelo.add(objeto);
                // No podemos ejecutar 'sync' aquí, debe hacerse en el ciclo de renderizado
            } else {
                console.error('El mundo de física no está correctamente inicializado');
            }
        },
        undefined,
        (error) => {
            console.error('Error al cargar el modelo:', error);
        }
    );
    return { modelo, body }; // Devuelve una estructura con el modelo y el cuerpo físico, aunque 'body' podría ser undefined si 'world' no está inicializado
}

export function crearEsfera(posX = 0, posY = 0, posZ = 0) {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const esfera = new THREE.Mesh(geometry, material
