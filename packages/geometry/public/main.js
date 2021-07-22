import * as geometry from './dist/index.js';
import { onValueChange } from './editor.js';
import * as scene from './scene.js';

onValueChange((v) => {
  const tempScene = {
    g: [],
    add: function (g) {
      this.g.push(g);
    },
  };

  try {
    eval(`(g,scene) => {console.log(g,scene); ${v}}`)(geometry, tempScene);
    // eslint-disable-next-line no-empty
  } catch (error) {
    // eslint-disable-next-line no-empty
    // console.log(error);
  } finally {
    scene.add(tempScene.g);
  }
});
