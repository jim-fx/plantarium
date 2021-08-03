import { logger } from '@plantarium/helpers';
import type { SvelteComponent } from 'svelte';

const log = logger('app');

const components = {
  pmv: {
    name: 'ProjectManagerView',
    import: () =>
      import('../components/project-manager/ProjectManagerView.svelte'),
  },
  smv: {
    name: 'ProjectManagerView',
    import: () =>
      import('../components/settings-manager/SettingsManagerView.svelte'),
  },
};

export default async (name: string): Promise<SvelteComponent> => {
  if (name in components) {
    const comp = await components[name].import();
    log('lazy loaded ' + name + ' component');
    return comp.default;
  }
};
