import React, { useState, useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Texture,
  TextureLoader,
  RGBAFormat,
  DataTexture,
  MeshStandardMaterial,
} from "three";
import contentData from "./assets/content.json";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRecoilState } from "recoil";
import {
  isContentShowedAtom,
  currentTimeAtom,
  navigationTimeAtom,
  titleContentAtom,
} from "./atoms";

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
  const [, setContentShow] = useRecoilState(isContentShowedAtom);
  const sphereRef = useRef<THREE.Mesh>(null);
  const glassTexture = useLoader(TextureLoader, "/models/blueglass2.png");
  const controlsRef = useRef<any>();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [currentTime] = useRecoilState(currentTimeAtom);
  const [currentNav] = useRecoilState(navigationTimeAtom);
  const [loadedTextures, setLoadedTextures] = useState<string[]>([]);
  const [titleContent] = useRecoilState(titleContentAtom);
  const content = contentData.find((x) => x.title === titleContent);

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
        const { rotation } = camera;
        sphereRef.current.rotation.x = rotation.x;
        sphereRef.current.rotation.y = rotation.y;
        sphereRef.current.rotation.z = rotation.z;
      }
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

  const currentNavigationData = content!.nav_variants.find(
    (x) => x.id === currentNav
  );

  if (!content) {
    return <></>;
  }

  return (
    <>
      {loadedTextures.length < 1 && (
        <div className="fixed w-full h-full z-[60] bg-[#FFF8ED] flex justify-center items-center">
          <div className="flex  justify-center  lg:w-[1000px] sm:w-[500px] w-[300px] h-10 sm:h-24 lg:h-48 mx-auto px-2">
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
        />
        <directionalLight
          position={[-12000, 5000, -12000]}
          castShadow
          intensity={3}
        />
        <directionalLight
          position={[12000, 50, -12000]}
          castShadow
          intensity={3}
        />
        <directionalLight
          position={[-12000, 50, 12000]}
          castShadow
          intensity={1}
        />

        <OBJModel
          scale={[1, 1, 1]}
          file="/models/12.06map.gltf"
          texture={ColorToTexture(new THREE.Color(65, 105, 225))}
          position={[0, -4, 0]}
          opacity={0.93}
          rotate={[0, 0, 0]}
          isOpacity={false}
        />
        {/* <OBJModel
          scale={[10, 10, 10]}
          file="/models/location-point.gltf"
          texture={ColorToTexture(new THREE.Color(65, 105, 225))}
          position={[-2.4, -4.4, 1.65]}
          opacity={0.93}
          rotate={[0, 60, 0]}
          isOpacity={false}
        /> */}
        {currentTime > content.start_time && currentTime < content.end_time && (
          <>
            {
              <OBJModel
                file={currentNavigationData!.file}
                texture={ColorToTexture(new THREE.Color(65, 105, 225))}
                position={currentNavigationData!.nav_position}
                scale={[1, 1, 1]}
                opacity={0.8}
                rotate={[0, 0, 0]}
                isOpacity={true}
              />
            }
            <OBJModel
              file={`/models/${currentNavigationData!.start_point_file}`}
              texture={ColorToTexture(new THREE.Color(65, 105, 225))}
              position={currentNavigationData!.start_point_position}
              scale={[5, 5, 5]}
              opacity={0.8}
              rotate={currentNavigationData!.point_rotate}
              isOpacity={true}
            />
            {currentTime > currentNavigationData!.selection_time && (
              <OBJModel
                file="/models/arrowyellowglorax.gltf"
                texture={ColorToTexture(new THREE.Color(65, 105, 225))}
                position={currentNavigationData!.point_position}
                scale={[5, 5, 5]}
                opacity={0.8}
                rotate={currentNavigationData!.point_rotate}
                isOpacity={true}
              />
            )}
          </>
        )}
        <meshStandardMaterial map={glassTexture} />

        <React.Fragment>
          <mesh
            ref={sphereRef}
            position={[
              content.position[0] - (content.rotate ? -1 : 1),
              content.position[1] + 5,
              content.position[2] + (content.rotate ? -1 : 1),
            ]}
            onClick={() => setContentShow(true)}
          >
            {currentTime < content.arrow_time[0].time && (
              <OBJModel
                file="/models/sharik blue glorax.gltf"
                texture={ColorToTexture(new THREE.Color(65, 105, 225))}
                position={[0, 0, 0]}
                scale={[35, 35, 35]}
                opacity={0.93}
                rotate={[90, 0, 0]}
                isOpacity={false}
              />
            )}
            <meshStandardMaterial
              color={"#FFC226"}
              roughnessMap={glassTexture}
            />
          </mesh>
        </React.Fragment>

        {content.arrow_time.map((y, i) => (
          <React.Fragment key={i}>
            {currentTime > y.time && currentTime < y.time + 1 && (
              <mesh>
                <OBJModel
                  file="/models/arrow glorax.gltf"
                  texture={ColorToTexture(new THREE.Color(65, 105, 225))}
                  position={[-1.0, 0 + y.positionY, 1]}
                  scale={[20, 20, 20]}
                  opacity={0.93}
                  rotate={[90, 0, -60]}
                  isOpacity={false}
                />
              </mesh>
            )}
          </React.Fragment>
        ))}
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
