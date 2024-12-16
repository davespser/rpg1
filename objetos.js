import * as THREE from 'three';
import { GLTFLoader } from "GLTFLoader";
import RAPIER from '@dimforge/rapier3d-compat';

export function cargarModelo(world, posX = 250, posY = 5, posZ = 250, rutaModelo = './robotauro_walk.glb', onLoad) {
    const loader = new GLTFLoader();
    const modelo = new THREE.Group();
    loader.load(
        rutaModelo,
        (gltf) => {
            const objeto = gltf.scene;
            objeto.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            objeto.position.set(posX, posY, posZ);
            modelo.add(objeto);

            const bbox = new THREE.Box3().setFromObject(objeto);
            const size = bbox.getSize(new THREE.Vector3());

            const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(posX, posY, posZ);
            const body = world.createRigidBody(bodyDesc);

            const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
            world.createCollider(colliderDesc, body);

            modelo.body = body;

            // Llama al callback cuando todo esté listo
            if (onLoad) onLoad(modelo);
        },
        undefined,
        (error) => console.error('Error al cargar el modelo:', error)
    );
    return modelo;
}
