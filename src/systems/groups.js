import coordinates from './data/coordinates.json';

export const getGroupsPositions = (groups) => {
  let positions = {};
  const majorityGroupRadius = 30;
  const minorityGroupRadius = 80;

  // Filter the groups
  const isMaj = (group) => group.politicalPosition === 'Majoritaire';
  const majorityGroups = groups.filter((group) => isMaj(group));
  const oppositionGroups = groups.filter((group) => !isMaj(group));
  // Get the appropriate coordinates
  const majorityCoords = coordinates[majorityGroups.length];
  const oppositionCoords = coordinates[oppositionGroups.length];

  // Place the groups
  majorityGroups.forEach((group, index) => {
    const x = Number(majorityCoords[index].x) * majorityGroupRadius;
    const y = Number(majorityCoords[index].y) * majorityGroupRadius;
    const z = Number(majorityCoords[index].z) * majorityGroupRadius;
    positions[group.shortName] = [x, y, z];
  });

  oppositionGroups.forEach((group, index) => {
    const x = Number(oppositionCoords[index].x) * minorityGroupRadius;
    const y = Number(oppositionCoords[index].y) * minorityGroupRadius;
    const z = Number(oppositionCoords[index].z) * minorityGroupRadius;
    positions[group.shortName] = [x, y, z];
  });

  return positions;
};
