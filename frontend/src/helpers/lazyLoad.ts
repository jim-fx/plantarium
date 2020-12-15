const components = {
  pmv: {
    name: 'ProjectManagerView',
    import: () =>
      import('../components/project-manager/ProjectManagerView.svelte'),
  },
};

export default async (name) => {
  if (name in components) {
    const comp = await components[name].import();
    console.log('[APP] loaded ' + name + ' component');
    return comp.default;
  }
};
