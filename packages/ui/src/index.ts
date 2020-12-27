import InputSlider from './InputSlider.svelte';
import InputNumber from './InputNumber.svelte';
import InputSelect from './InputSelect.svelte';
import InputCurve from './InputCurve.svelte';
import InputShape from './InputShape.svelte';
import InputCheckbox from './InputCheckbox.svelte';
import InputColor from './InputColor.svelte';
import Button from './Button.svelte';
import Icon from './Icon.svelte';
import Section from './Section.svelte';
import Alert from './alert/Alert.svelte';
import { createAlert } from './alert/AlertStore';

export {
  InputNumber,
  InputSlider,
  InputSelect,
  InputCurve,
  InputShape,
  InputColor,
  Button,
  Icon,
  Section,
  Alert,
  createAlert,
};

// *****************************************
// * Notice that the component is not instantiated and mounted to the document <body className="">
// * Since the compiler is creating a custom element, we instead define and use the custom element
// * in the index.html file to simulate the end-user experience.
// ******************************************

export function stateToElement(
  target: HTMLElement,
  template: ValueTemplate,
  value: unknown,
) {
  if (value === undefined && 'value' in template) {
    value = template.value;
  }

  const component = stateToComponent(template, value);

  const props: Partial<ValueTemplate> = { ...template };
  delete props.type;
  delete props.inputType;
  delete props.internal;

  props.value = value as string | number | boolean | Vector2[];

  return new component({ target, props: { ...props } });
}

export function stateToComponent(template: ValueTemplate, value: unknown) {
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
