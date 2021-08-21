import './global.scss';
import Loader from './Loader.svelte';

let l;
try {
  l = new Loader({
    target: document.body,
  });
} catch (error) {
  // eslint-disable-next-line no-console
  console.log(error);
}

export default l;
