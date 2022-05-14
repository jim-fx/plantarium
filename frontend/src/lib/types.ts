import type { ValueTemplate } from "@plantarium/ui";

export type SettingsTemplate = {
  [key: string]:
  | ValueTemplate
  | { onlyDev?: boolean; options: SettingsTemplate };
};
