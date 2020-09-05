import * as branch from './branch';
import * as stem from './stem';
import * as noise from './noise';
import { PlantariumSettings } from '@plantarium/types';

export function skeleton(part: PlantPart, settings: PlantariumSettings) {
  switch (part.type) {
    case 'stem':
      return stem.skeleton(part, settings);
    case 'branch':
      return branch.skeleton(part, settings);
    case 'noise':
      return noise.skeleton(part, settings);
  }

  return part.parameters.input.result;
}

export function geometry(part: PlantPart, settings: PlantariumSettings) {
  switch (part.type) {
    case 'stem':
      return stem.geometry(part, settings);
    case 'branch':
      return branch.geometry(part, settings);
  }
  return part.parameters.input.result;
}
