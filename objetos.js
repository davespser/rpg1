import * as THREE from 'three';
import { GLTFLoader } from "GLTFLoader";
import { Rapier } from '@dimforge/rapier3d-compat';

export function cargarModelo(posX = 250, posY = 5, posZ = 250, rutaModelo = './negro.glb') {
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

            // Crear un cuerpo físico para el modelo
            const bodyDesc = Rapier.RigidBodyDesc.dynamic().setTranslation(posX, posY, posZ);
            body = world.createRigidBody(bodyDesc);

            // Ajustar colisión (aquí usamos una caja como ejemplo, ajusta según tu modelo)
            const colliderDesc = Rapier.ColliderDesc.cuboid(1.5, 1.5, 1.5); // Ajusta según el tamaño del modelo escalado
            world.createCollider(colliderDesc, body);

            // Sincronización visual con física (esto debería hacerse en cada frame)
            const sync = () => {
                const translation = body.translation();
                const rotation = body.rotation();
                objeto.position.set(translation.x, translation.y, translation.z);
                objeto.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
            };

            modelo.add(objeto);
            // Aquí deberías tener un ciclo de actualización para sincronizar la posición
            // sync(); // Llamar a sync en cada frame
        },
        undefined,
        (error) => {
            console.error('Error al cargar el modelo:', error);
        }
    );
    return { modelo, body }; // Devuelve una estructura con el modelo y el cuerpo físico
}

export function crearEsfera(posX = 0, posY = 0, posZ = 0) {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const esfera = new THREE.Mesh(geometry, material);
    esfera.castShadow = true;
    esfera.receiveShadow = true;
    esfera.position.set(posX, posY, posZ); // Establecer posición inicial
    return esfera;
}
