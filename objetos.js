import * as THREE from 'three';
import { GLTFLoader } from "GLTFLoader";
import RAPIER from '@dimforge/rapier3d-compat';

export function cargarModelo(world, posX = 250, posY = 5, posZ = 250, rutaModelo = './robotauro_walk.glb') {
    const loader = new GLTFLoader();
    const modelo = new THREE.Group(); // Grupo para el modelo
    loader.load(
        rutaModelo,
        (gltf) => {
            const objeto = gltf.scene;
            objeto.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true; // Habilitar sombras
                    node.receiveShadow = true;
                }
            });
            objeto.position.set(posX, posY, posZ); // Establecer posición inicial
            modelo.add(objeto); // Agregar el modelo cargado al grupo

            // Obtener las dimensiones del modelo GLB
            const bbox = new THREE.Box3().setFromObject(objeto);
            const size = bbox.getSize(new THREE.Vector3());

            // Crear el cuerpo físico correspondiente
            const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(posX, posY, posZ);
            const body = world.createRigidBody(bodyDesc);

            // Crear el collider para el cuerpo basado en el tamaño del modelo (una caja)
            const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
            world.createCollider(colliderDesc, body);

            // Añadir el cuerpo a la propiedad del modelo para su actualización
            modelo.body = body;
        },
        undefined,
        (error) => {
            console.error('Error al cargar el modelo:', error);
        }
    );
    return { modelo, body }; // Devuelve el grupo vacío inicialmente
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
