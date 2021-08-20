import './global.scss';
import Loader from './Loader.svelte';

let l;
try {
  l = new Loader({
    target: document.body,
  });
} catch (error) {
  console.log(error);
}

export default l;
