import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Individuals from './Individuals';
import useData from '../stores/useData';
import { getGroupsPositions } from '../systems/groups';
import { Float, PresentationControls } from '@react-three/drei';
import useEnv from '../stores/useEnv';

const Groups = () => {
  const { groups: entities } = useData();
  const { initialCameraPositionVector } = useEnv();
  const [entitiesPositions, setEntitiesPositions] = useState({});
  const [cameraTarget, setCameraTarget] = useState(initialCameraPositionVector);

  const clicked = useRef();
  const { camera } = useThree();

  /**
   * Go to object & reset
   */
  const goToObject = (e) => {
    e.stopPropagation();
    clicked.current = e.object;
    const OFFSET = 50;

    // Target a little above the clicked object
    const target = new THREE.Vector3()
      .subVectors(clicked.current.position, new THREE.Vector3(0, 0, 0))
      .normalize()
      .multiplyScalar(OFFSET)
      .add(clicked.current.position);

    // Draw a vector perpendicular to center -> object
    const vector = new THREE.Vector3()
      .subVectors(clicked.current.position, new THREE.Vector3(0, 0, 0))
      .normalize()
      .cross(new THREE.Vector3(0, 1, 0))
      .multiplyScalar(OFFSET);
    // target.add(vector);

    setCameraTarget(target);
  };

  const reset = () => {
    clicked.current = null;
    setCameraTarget(initialCameraPositionVector);
  };

  const zoom = (e) => {
    if (!clicked.current) return;

    const zoomFactor = 0.005;
    const zoom = e.deltaY > 0 ? zoomFactor : -zoomFactor;

    // Limit the zoom in
    if (clicked.current.position.distanceTo(cameraTarget) < 15) {
      if (zoom < 0) return;
      // and zoom out
    } else if (clicked.current.position.distanceTo(cameraTarget) > 100) {
      if (zoom > 0) return;
    }

    setCameraTarget(cameraTarget.multiplyScalar(1 + zoom));
  };

  useFrame(() => {
    camera.position.lerp(cameraTarget, 0.02);
    camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    setEntitiesPositions(getGroupsPositions(entities));
  }, [entities]);

  useEffect(() => {
    window.addEventListener('mousewheel', zoom);
    return () => window.removeEventListener('mousewheel', zoom);
  });

  return (
    <group onPointerMissed={reset}>
      {entities.map((group) => {
        return (
          <group key={group.symbol}>
            <Float speed={1} floatIntensity={0.1} rotationIntensity={0.1}>
              {/* <PresentationControls> */}
              <mesh
                position={entitiesPositions[group.symbol]}
                userData={{ symbol: group.symbol }}
                onClick={goToObject}
              >
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color={group.color} />
              </mesh>
              {/* </PresentationControls> */}
            </Float>
            <Individuals
              group={group}
              basePosition={entitiesPositions[group.symbol]}
            />
          </group>
        );
      })}
    </group>
  );
};

export default Groups;
