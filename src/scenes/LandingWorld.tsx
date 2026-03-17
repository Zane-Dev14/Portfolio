
useGLTF.preload("/models/diorama_minish_woods.glb")

export default function LandingWorld() {
    const { scene, animations } = useGLTF("/models/diorama_minish_woods.glb")
    const mixer = useRef<THREE.AnimationMixer | null>(null)

    useEffect(() => {
        // Fix axis: Sketchfab models often export Z-up
        scene.rotation.x = -Math.PI / 2
        scene.scale.setScalar(10)
        scene.updateMatrixWorld(true)

        // Enable shadows and culling on all meshes
        scene.traverse((obj: THREE.Object3D) => {
            if ((obj as THREE.Mesh).isMesh) {
                const mesh = obj as THREE.Mesh
                mesh.castShadow = true
                mesh.receiveShadow = true
                mesh.frustumCulled = true
            }
        })

        // Animation mixer
        if (animations.length > 0) {
            mixer.current = new THREE.AnimationMixer(scene)
            animations.forEach((clip) => {
                const action = mixer.current!.clipAction(clip)
                action.play()
            })
        }

        return () => {
            mixer.current?.stopAllAction()
        }
    }, [scene, animations])

    useFrame((_, delta) => {
        mixer.current?.update(delta)
    })

    return (
        <group>
            <ForestEnvironment />
            <primitive object={scene} />
            <ParticleSystem count={200} radius={15} color="#66ffcc" />
        </group>
    )
}
