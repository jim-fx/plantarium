import AlertWrapper from './alert/AlertWrapper.svelte';
import { createAlert } from './alert/AlertStore';

import ToastWrapper from './toast/ToastWrapper.svelte';
import { createToast } from './toast/ToastStore';

import Button from './Button.svelte';
import Icon from './Icon.svelte';
import InputCheckbox from './InputCheckbox.svelte';
import InputColor from './InputColor.svelte';
import InputCurve from './InputCurve.svelte';
import InputInteger from './InputInteger.svelte';
import InputFloat from './InputFloat.svelte';
import InputSelect from './InputSelect.svelte';
import InputShape from './InputShape.svelte';
import InputSlider from './InputSlider.svelte';
import InputSearch from './InputSearch.svelte';
import Section from './Section.svelte';
import StackTrace from './toast/StackTrace.svelte';
import type { SvelteComponent } from 'svelte';
import type { ValueTemplate } from './types';

export type {
  CheckboxTemplate,
  IntegerTemplate,
  FloatTemplate,
  ShapeTemplate,
  CurveTemplate,
  SelectTemplate,
} from "./types"

export {
  ValueTemplate,
  InputFloat,
  InputInteger,
  InputSlider,
  InputSelect,
  InputCheckbox,
  InputCurve,
  InputShape,
  InputSearch,
  InputColor,
  Button,
  Icon,
  Section,
  AlertWrapper,
  createAlert,
  ToastWrapper,
  createToast,
  StackTrace
};

// *****************************************
// * Notice that the component is not instantiated and mounted to the document <body className="">
// * Since the compiler is creating a custom element, we instead define and use the custom element
// * in the index.html file to simulate the end-user experience.
// ******************************************

export function stateToElement({
  target,
  template,
  value
}: {
  target: HTMLElement;
  template: ValueTemplate;
  value: unknown;
}): SvelteComponent {
  const component = stateToComponent(template);

  const props = { ...template, ...{ value } };
  delete props["type"]
  console.log("LoadElement", template.type, props, value)


  return new component({ target, props: { ...props, '--width': '100%' } });
}

export function stateToComponent(template: ValueTemplate): typeof SvelteComponent {
  if (template.type === 'select') {
    return InputSelect;
  }

  if (template.type === 'curve') {
    return InputCurve;
  }

  if (template.type === 'shape') {
    return InputShape;
  }

  if (template.type === 'number') {
    if (template?.inputType === "float") {
      return InputFloat;
    }
    return InputInteger;
  }

  return InputCheckbox;
}
