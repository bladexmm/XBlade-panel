import React, {Suspense, useRef, useState} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import "./index.css";
import * as THREE from "three";
import {BakeShadows, Environment, OrbitControls, PerspectiveCamera, Stars, useGLTF} from "@react-three/drei";
function Model({ url }) {
    const { nodes } = useGLTF(url)
    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} scale={7}>
            <group rotation={[Math.PI / 13.5, -Math.PI / 5.8, Math.PI / 5.6]}>
                <mesh receiveShadow castShadow geometry={nodes.planet002.geometry} material={nodes.planet002.material} />
                <mesh geometry={nodes.planet003.geometry} material={nodes.planet003.material} />
            </group>
        </group>
    )
}
export default function Wallpapers({path}) {

    // return (
    //     <Canvas className="wallpaper-three" dpr={[1.5, 2]} linear shadows style={{
    //         background: "radial-gradient(at 50% 100%, #873740 0%, #272730 40%, #171720 80%, #070710 100%)"
    //
    //     }}>
    //         <fog attach="fog" args={['#272730', 16, 30]}/>
    //         <ambientLight intensity={0.8}/>
    //         <PerspectiveCamera makeDefault position={[0, 0, 16]} fov={75}>
    //             <pointLight intensity={1} position={[-10, -25, -10]}/>
    //             <spotLight castShadow intensity={2.25} angle={0.2} penumbra={1} position={[-25, 20, -15]}
    //                        shadow-mapSize={[1024, 1024]} shadow-bias={-0.0001}/>
    //         </PerspectiveCamera>
    //         <Suspense fallback={null}>
    //             <Model url="/scene.glb"/>
    //         </Suspense>
    //         <OrbitControls autoRotate enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2}
    //                        minPolarAngle={Math.PI / 2}/>
    //         <Stars radius={500} depth={50} count={1000} factor={10}/>
    //     </Canvas>
    // );

    if (path.endsWith(".mp4")) {
        return (
            <video className="wallpapers-video" autoPlay loop muted key={path}>
                <source src={path} type="video/mp4"/>
            </video>
        )
    } else {
        return (
            <img className="wallpapers-img" key={path} src={path} alt="图标"/>
        )
    }
}