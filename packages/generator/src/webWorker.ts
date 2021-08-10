import { expose } from 'comlink';
import plant from './plant';

const obj = {
  plant,
};

expose(obj);
