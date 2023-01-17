import { useEffect, useMemo, useState } from 'react';
import { Float } from '@react-three/drei';
import Entity from './Entity';
import { getIndividualsPositions } from '../systems/individuals';
import useInteraction from '../stores/useInteraction';

const Individuals = ({ group, basePosition = [0, 0, 0] }) => {
  const { hovered, setHovered } = useInteraction();

  // Get positions (sorted by their proximity to (0, 0, 0))
  const positions = useMemo(() => {
    return getIndividualsPositions(group, basePosition);
  }, [group, basePosition]);

  const individuals = useMemo(() => {
    return (
      group.data
        // Sort by loyalty (less loyal first)
        .sort((a, b) => {
          return b.scoreMajorite - a.scoreMajorite;
        })
        .map((individual, index) => {
          return {
            ...individual,
            position: positions[index],
          };
        })
    );
  }, [group, positions]);

  return (
    <group>
      {individuals.map((individual, index) => {
        return (
          <Float
            key={index}
            speed={1}
            floatIntensity={0.1}
            rotationIntensity={0.1}
          >
            <Entity
              data={individual}
              position={positions[index]}
              onClick={null}
              type='individual'
              onMouseEnter={() => setHovered(individual, 'individual')}
              onMouseLeave={() => setHovered(null)}
            />
          </Float>
        );
      })}
    </group>
  );
};

export default Individuals;
