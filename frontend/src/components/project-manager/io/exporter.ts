import * as generate from '@plantarium/generator';
import { getSeed, download, convertToOBJ } from '@plantarium/helpers';
import { PlantDescription, PlantariumSettings } from '@plantarium/types';

export default {
  download: async (pd: PlantDescription, settings: PlantariumSettings) => {
    // const model = await generate.plant(pd, settings);
    // const obj = convertToOBJ(model);
    // download.obj(obj, pd.meta.name);
  },
};
