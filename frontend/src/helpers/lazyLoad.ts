const components = {
  pmv: {
    name: 'ProjectManagerView',
    import: () =>
      //@ts-ignore
      import('../components/project-manager/ProjectManagerView.svelte'),
  },
  smv: {
    name: 'ProjectManagerView',
    import: () =>
      //@ts-ignore
      import('../components/settings-manager/SettingsManagerView.svelte'),
  },
};

export default async (name) => {
  if (name in components) {
    const comp = await components[name].import();
    console.log('[APP] loaded ' + name + ' component');
    return comp.default;
  }
};
