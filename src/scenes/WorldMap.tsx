"use client"

import { useGLTF, Environment, OrbitControls } from "@react-three/drei"
import { Suspense } from "react"

export default function WorldMap() {

    const woods = useGLTF("/models/diorama_minish_woods.glb")

    return (
        <Suspense fallback={null}>

            {/* HDRI lighting */}
            <Environment
                files="/textures/evening_meadow_4k.exr"
                background
            />

            <primitive
                object={woods.scene}
                scale={3}
                position={[0, -1, 0]}
            />

            <OrbitControls />

        </Suspense>
    )
}