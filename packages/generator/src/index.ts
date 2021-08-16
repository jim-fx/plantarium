import { default as plant } from './plant';
import { ground } from '@plantarium/geometry';
import worker from './webworker/createWebWorker';
export { plant, ground, worker };
export default {
  plant,
  ground,
  worker,
};
