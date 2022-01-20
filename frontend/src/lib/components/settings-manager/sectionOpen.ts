import { localState } from '../../helpers';

let index = 0;

const sections: boolean[] = (localState.get('sections') as boolean[]) || [];

export default () => {
  const i = index++;
  return {
    get() {
      return sections[i] || false;
    },
    set(open: boolean) {
      sections[i] = open;
      localState.set('sections', sections);
    },
  };
};
