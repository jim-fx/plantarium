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
import Section from './Section.svelte';

import type { SvelteComponentDev } from 'svelte/internal/index';

export {
  InputNumber,
  InputSlider,
  InputSelect,
  InputCheckbox,
  InputCurve,
  InputShape,
  InputColor,
  Button,
  Icon,
  Section,
  AlertWrapper,
  createAlert,
  ToastWrapper,
  createToast,
};

// *****************************************
// * Notice that the component is not instantiated and mounted to the document <body className="">
// * Since the compiler is creating a custom element, we instead define and use the custom element
// * in the index.html file to simulate the end-user experience.
// ******************************************

export function stateToElement({
  target,
  template,
  value,
}: {
  target: HTMLElement;
  template: ValueTemplate;
  value: unknown;
}) {
  if (value === undefined && 'value' in template) {
    value = template.value;
  }

  const component = stateToComponent(template, value);

  const props: Partial<ValueTemplate> = { ...template };
  delete props.type;
  delete props.inputType;
  delete props.defaultValue;
  delete props.internal;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  props['value'] = value;

  return new component({ target, props: { ...props } });
}

export function stateToComponent(
  template: ValueTemplate,
  value: unknown,
): typeof SvelteComponentDev {
  if (template.inputType === 'select' || Array.isArray(template.values)) {
    return InputSelect;
  }

  if (template.inputType === 'slider' || 'step' in template) {
    return InputSlider;
  }

  if (template.inputType === 'curve') {
    return InputCurve;
  }

  if (template.inputType === 'shape') {
    return InputShape;
  }

  if (template.type === 'number' || typeof value === 'number') {
    return InputNumber;
  }

  return InputCheckbox;
}
