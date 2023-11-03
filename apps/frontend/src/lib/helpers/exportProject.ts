import { createWorker } from '@plantarium/generator';
import { download } from '@plantarium/helpers';
import type { PlantariumSettings, Project } from '@plantarium/types';
import { createToast } from '@plantarium/ui';

const worker = createWorker();

export default async function exportModel(
  p: Project,
  s: typeof PlantariumSettings,
) {
  const res = await worker?.exportToObject(p, s);

  if (res?.errors?.length) {
    createToast(res.errors[0], { type: 'error' });
    return;
  }

  download.obj(res, 'plant-' + (p?.meta?.name || p?.id));
}
