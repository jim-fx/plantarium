import { Parameter } from '@plantarium/types';
import noise from './noise';

export default (param: Parameter) => {
  if (param.variation && param.value) {
    return param.value + ((noise.n1d(param.value) + 1) / 2) * param.value;
  } else if (param.value) {
    return param.value;
  } else {
    return 1;
  }
};
