export default function (obj) {
  const themes = {};

  Object.entries(obj).forEach(([key, value]) => {
    const [themeName, variableName] = key.split('_');

    if (themeName in themes) {
      themes[themeName][variableName] = value;
    } else {
      themes[themeName] = { [variableName]: value };
    }
  });

  return themes;
}
