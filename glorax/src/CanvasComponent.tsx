import React, { useState, useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  // MeshStandardMaterial,
  Texture,
  TextureLoader,
  RGBAFormat,
  DataTexture,
  MeshStandardMaterial,
} from "three";
import content from "./assets/content.json";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRecoilState } from "recoil";
import { contentIdAtom, currentTimeAtom } from "./atoms";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

interface OBJModelProps {
  file: string;
  texture: Texture;
  position: number[];
  opacity: number;
  isOpacity: boolean;
  scale: number[];
  rotate: number[];
}

function CanvasComponent() {
  const [, setContentId] = useRecoilState(contentIdAtom);
  const sphereRef = useRef<THREE.Mesh>(null);
  const glassTexture = useLoader(TextureLoader, "/models/blueglass2.png");
  const controlsRef = useRef<any>();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [currentTime] = useRecoilState(currentTimeAtom);
  const [loadedTextures, setLoadedTextures] = useState<string[]>([]);
  const aboutRef = useRef<THREE.Mesh>(null);
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const handleClick = (position: number[], index: number) => {
  //   setContentId(index);
  // if (controlsRef.current) {
  // gsap.to(controlsRef.current.target, {
  //   x: position[0],
  //   y: position[1],
  //   z: position[2],
  //   duration: 1,
  // });
  // }
  // };

  // function DracoModel({
  //   file,
  //   texture,
  //   position,
  //   scale,
  //   rotate,
  //   opacity,
  //   isOpacity,
  // }: OBJModelProps) {
  //   const gltf = useLoader(GLTFLoader, file, (loader) => {
  //     const draco = new DRACOLoader();
  //     draco.setDecoderConfig({ type: "js" });
  //     draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  //     loader.setDRACOLoader(draco);
  //   });
  //   const [isTextureLoaded, setIsTextureLoaded] = useState(false);
  //   const { camera } = useThree();

  //   function checkTextureAlreadyLoaded(textureName: string): boolean {
  //     return loadedTextures.includes(textureName);
  //   }

  //   function addLoadedTexture(textureName: string): void {
  //     setLoadedTextures((prevTextures) => [...prevTextures, textureName]);
  //   }

  //   useEffect(() => {
  //     if (checkTextureAlreadyLoaded(texture.name)) {
  //       setIsTextureLoaded(true);
  //       return;
  //     }
  //     const checkTextureLoaded = () => {
  //       if (texture.image) {
  //         gltf.scene.traverse((child) => {
  //           if ((child as THREE.Mesh).isMesh) {
  //             const mesh = child as THREE.Mesh;
  //             if (isOpacity) {
  //               const material = new MeshStandardMaterial({
  //                 map: texture,
  //                 transparent: true,
  //                 alphaTest: 0.5,
  //                 opacity: opacity,
  //                 depthWrite: false,
  //                 depthTest: true,
  //               });
  //               mesh.material = material;
  //             }
  //             if (mesh.material instanceof MeshStandardMaterial) {
  //               mesh.material.roughness = 1;
  //             }
  //           }
  //         });
  //         setIsTextureLoaded(true);
  //         addLoadedTexture(texture.name);
  //       } else {
  //         setTimeout(checkTextureLoaded, 100);
  //       }
  //     };
  //     checkTextureLoaded();
  //   }, [gltf, texture]);

  //   useFrame(() => {
  //     if (sphereRef.current) {
  //       const { rotation } = camera;
  //       sphereRef.current.rotation.x = rotation.x;
  //       sphereRef.current.rotation.y = rotation.y;
  //       sphereRef.current.rotation.z = rotation.z;
  //     }
  //     if (aboutRef.current) {
  //       const { rotation } = camera;
  //       aboutRef.current.rotation.x = rotation.x;
  //       aboutRef.current.rotation.y = rotation.y;
  //       aboutRef.current.rotation.z = rotation.z;
  //     }
  //   });

  //   if (!isTextureLoaded) {
  //     return null;
  //   }

  //   return (
  //     <primitive
  //       object={gltf.scene.clone()}
  //       position={position}
  //       scale={scale}
  //       rotation={
  //         rotate
  //           ? [
  //               (rotate[0] * Math.PI) / 180,
  //               (rotate[1] * Math.PI) / 180,
  //               (rotate[2] * Math.PI) / 180,
  //             ]
  //           : [0, 0, 0]
  //       }
  //     />
  //   );
  // }
  // const images = [
  //   "./img/g1.png",
  //   "./img/l2.png",
  //   "./img/o3.png",
  //   "./img/r4.png",
  //   "./img/a5.png",
  //   "./img/xxglora.png",
  // ];
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, []);

  function OBJModel({
    file,
    texture,
    position,
    scale,
    rotate,
    opacity,
    isOpacity,
  }: OBJModelProps) {
    const gltf = useLoader(GLTFLoader, file);
    const [isTextureLoaded, setIsTextureLoaded] = useState(false);
    const { camera } = useThree();
    function checkTextureAlreadyLoaded(textureName: string): boolean {
      return loadedTextures.includes(textureName);
    }

    function addLoadedTexture(textureName: string): void {
      setLoadedTextures((prevTextures) => [...prevTextures, textureName]);
    }

    useEffect(() => {
      if (checkTextureAlreadyLoaded(texture.name)) {
        setIsTextureLoaded(true);
        return;
      }

      const checkTextureLoaded = () => {
        if (texture.image) {
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              if (isOpacity) {
                const material = new MeshStandardMaterial({
                  map: texture,
                  transparent: true,
                  alphaTest: 0.5,
                  opacity: opacity,
                  depthWrite: false,
                  depthTest: true,
                });
                mesh.material = material;
              }
              if (mesh.material instanceof MeshStandardMaterial) {
                mesh.material.roughness = 1;
              }
            }
          });
          setIsTextureLoaded(true);
          addLoadedTexture(texture.name);
        } else {
          setTimeout(checkTextureLoaded, 100);
        }
      };
      checkTextureLoaded();
    }, [gltf, texture]);

    useFrame(() => {
      if (sphereRef.current) {
        // Получаем позицию и поворот камеры
        const { rotation } = camera;
        // Обновляем поворот объекта в соответствии с поворотом камеры
        sphereRef.current.rotation.x = rotation.x;
        sphereRef.current.rotation.y = rotation.y;
        sphereRef.current.rotation.z = rotation.z;
      }
      // if (aboutRef.current) {
      // Получаем позицию и поворот камеры
      // const { rotation } = camera;
      // Обновляем поворот объекта в соответствии с поворотом камеры
      // aboutRef.current.rotation.x = rotation.x;
      // aboutRef.current.rotation.y = rotation.y;
      // aboutRef.current.rotation.z = rotation.z;
      // }
    });
    if (!isTextureLoaded) {
      return null;
    }

    return (
      <primitive
        object={gltf.scene.clone()}
        position={position}
        scale={scale}
        rotation={
          rotate
            ? [
                (rotate[0] * Math.PI) / 180,
                (rotate[1] * Math.PI) / 180,
                (rotate[2] * Math.PI) / 180,
              ]
            : [0, 0, 0]
        }
      />
    );
  }

  function ColorToTexture(color: any) {
    const data = new Uint8Array([color.r, color.g, color.b, 255]);
    const texture = new DataTexture(data, 1, 1, RGBAFormat);
    texture.needsUpdate = true;

    return texture;
  }

  return (
    <>
      {loadedTextures.length < 1 && (
        <div className="fixed w-full h-full z-[60] bg-[#FFF8ED] flex justify-center items-center">
          <div className="flex  justify-center  lg:w-[1000px] sm:w-[500px] w-[300px] h-10 sm:h-24 lg:h-48 mx-auto px-2">
            {/* <img src="./img/glora.png" alt="" />
            <img
              src="./img/xxglora.png"
              alt=""
              className="animate-[spin_4s_linear_infinite]"
            /> */}
            <img
              src="./img/g1.png"
              alt=""
              className="animate-[showG_5s_ease-in-out_infinite] h-full object-contain"
            />
            <img
              src="./img/l2.png"
              alt=""
              className="animate-[showL_5s_ease-in-out_infinite] h-full object-contain"
            />
            <img
              src="./img/o3.png"
              alt=""
              className="animate-[showO_5s_ease-in-out_infinite] h-full object-contain"
            />
            <img
              src="./img/r4.png"
              alt=""
              className="animate-[showR_5s_ease-in-out_infinite] h-full object-contain"
            />
            <img
              src="./img/a5.png"
              alt=""
              className="animate-[showA_5s_ease-in-out_infinite] h-full object-contain"
            />
            <img
              src="./img/xxglora.png"
              alt=""
              className="animate-[showX_5s_ease-in-out_infinite] h-full object-contain"
            />
            {/*  <div
              className="flex  justify-start  lg:w-[1000px] sm:w-[500px] w-[300px] h-10 sm:h-24 lg:h-48 mx-auto px-2
          "
            >
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt=""
                  className={`animate-[show_2s]  h-full object-contain ${
                    index <= currentImageIndex ? "visible" : "hidden"
                  }`}
                />
              ))} 
            </div>*/}
          </div>
        </div>
      )}

      <Canvas
        className="w-full h-full  bg-[#FFF8ED]"
        camera={{ position: [-60, 14, -35] }}
        shadows
        style={{}}
      >
        <perspectiveCamera
          ref={cameraRef}
          position={[0, 0, 5]}
          fov={75}
          aspect={window.innerWidth / window.innerHeight}
          near={0.1}
          far={1000}
        />
        <directionalLight
          position={[12000, 5000, 12000]}
          castShadow
          intensity={3}
          // color="#fff0de"
        />
        <directionalLight
          position={[-12000, 5000, -12000]}
          castShadow
          intensity={3}
          // color="#fff0de"
        />
        <directionalLight
          position={[12000, 50, -12000]}
          castShadow
          intensity={3}
          // color="#fff0de"
        />
        <directionalLight
          position={[-12000, 50, 12000]}
          castShadow
          intensity={1}
          // color="#fff0de"
        />

        <OBJModel
          scale={[1, 1, 1]}
          file="/models/pre-finale.gltf"
          texture={ColorToTexture(new THREE.Color(65, 105, 225))}
          position={[0, -4, 0]}
          opacity={0.93}
          rotate={[0, 0, 0]}
          isOpacity={false}
        />
        {/* <OBJModel
        scale={[1, 1, 1]}
        file="/models/planelast3.gltf"
        texture={ColorToTexture(new THREE.Color(65, 105, 225))}
        position={[0, 0, 0]}
        opacity={0.8}
        rotate={[0, 0, 0]}
        isOpacity={true}
      /> */}
        {/* <OBJModel
            file="/models/man.glb"
            texture={ColorToTexture(new THREE.Color(0, 0, 0))}
            position={[-2, -2, 2]}
          /> */}
        {currentTime > content[0].start_time &&
          currentTime < content[0].end_time && (
            <>
              {/* <OBJModel
              file="/models/navigation.gltf"
              texture={ColorToTexture(new THREE.Color(65, 105, 225))}
              position={[0, -8.3, 0]}
              scale={[1, 1, 1]}
              opacity={0.8}
              rotate={[0, 0, 0]}
              isOpacity={true}
            /> */}
              {content[0].navigation.map((item, i) => (
                <React.Fragment key={i}>
                  {currentTime > item.time_start &&
                    currentTime < item.time_end && (
                      <OBJModel
                        file="/models/navinew.gltf"
                        texture={ColorToTexture(new THREE.Color(65, 105, 225))}
                        position={item.position}
                        scale={[25, 25, 25]}
                        opacity={1}
                        rotate={item.rotate}
                        isOpacity={true}
                      />
                    )}
                </React.Fragment>
              ))}
            </>
          )}
        <meshStandardMaterial map={glassTexture} />
        {content.map((x: any, i: number) => (
          <React.Fragment key={i}>
            <mesh
              ref={sphereRef}
              position={[
                x.position[0] - (x.rotate ? -1 : 1),
                x.position[1] + 5,
                x.position[2] + (x.rotate ? -1 : 1),
              ]}
              onClick={() =>
                // handleClick([x.position[0], x.position[1], x.position[2]], i)
                setContentId(i)
              }
            >
              <OBJModel
                file="/models/arrow glorax.gltf"
                texture={ColorToTexture(new THREE.Color(65, 105, 225))}
                position={[0, 0, 0]}
                scale={[20, 20, 20]}
                opacity={0.93}
                rotate={[90, 0, 0]}
                isOpacity={false}
              />
              <meshStandardMaterial
                color={"#FFC226"}
                roughnessMap={glassTexture}
              />
            </mesh>
          </React.Fragment>
        ))}
        {/* <mesh>
          <OBJModel
            file="/models/x logo glorax-premium.gltf"
            texture={ColorToTexture(new THREE.Color(65, 105, 225))}
            position={[14.3, 13, 6]}
            scale={[35, 35, 35]}
            opacity={0.93}
            rotate={[85, 13, 120]}
            isOpacity={false}
          />
        </mesh> */}
        <mesh>
          <OBJModel
            file="/models/x logo.gltf"
            texture={ColorToTexture(new THREE.Color(65, 105, 225))}
            position={[0, 0, 8.8]}
            scale={[20, 20, 20]}
            opacity={0.93}
            rotate={[90, 0, 120]}
            isOpacity={false}
          />
        </mesh>
        <OrbitControls
          maxPolarAngle={Math.PI / 2.0}
          minDistance={15}
          maxDistance={17}
          target={[0, 1, 0]}
          ref={controlsRef}
          enablePan={false}
        />
      </Canvas>
    </>
  );
}

export default CanvasComponent;
