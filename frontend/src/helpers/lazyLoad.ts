import type { SvelteComponent } from 'svelte';

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
    console.log('[APP] loaded ' + name + ' component');
    return comp.default;
  }
};
