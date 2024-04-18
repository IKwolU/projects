import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const AnimationComponent = ({
  position,
  model,
  currentPosition,
  duration,
  audioTime,
}) => {
  const animationRef = useRef(null);

  useEffect(() => {
    gsap.to(animationRef.current.position, {
      duration: 10,
      x: position[0],
      y: position[1],
      z: position[2],
      delay: audioTime,
    });

    return () => {
      gsap.killTweensOf(animationRef.current.position);
    };
  }, [position, audioTime]);

  return <group ref={animationRef}>{model}</group>;
};

export default AnimationComponent;
