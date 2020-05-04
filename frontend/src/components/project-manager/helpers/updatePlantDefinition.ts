import { PlantDescription } from '@plantarium/types';

import defaultPD from 'assets/defaultPlantDescription';
export default function upgradePlant(pd: PlantDescription): PlantDescription {
  return Object.assign(JSON.parse(JSON.stringify(defaultPD)), pd);
}
