import InputSlider from './InputSlider.svelte';
import InputNumber from './InputNumber.svelte';
import InputSelect from './InputSelect.svelte';
import InputCurve from './InputCurve.svelte';
import InputShape from './InputShape.svelte';
import InputCheckbox from './InputCheckbox.svelte';
import Button from './Button.svelte';
import Icon from './Icon.svelte';

export {
  InputNumber,
  InputSlider,
  InputSelect,
  InputCurve,
  InputShape,
  Button,
  Icon,
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

  if (template.inputType === 'select' || Array.isArray(template.values)) {
    return new InputSelect({
      target,
      props: {
        values: template.values,
        selectedValue: value,
      },
    });
  }

  if (template.inputType === 'slider' || template.step) {
    return new InputSlider({
      target,
      props: {
        max: template.max,
        min: template.min,
        step: template.step,
        value: template.value,
      },
    });
  }

  if (template.inputType === 'curve') {
    return new InputCurve({
      target,
      props: { points: value || template.value },
    });
  }

  if (template.inputType === 'shape') {
    return new InputShape({
      target,
      props: {
        points: template.value,
      },
    });
  }

  if (template.type === 'number' || typeof value === 'number') {
    return new InputNumber({
      target,
      props: {
        max: template.max,
        min: template.min,
        step: template.step,
        value: template.value,
      },
    });
  }

  if (template.type === 'boolean' || typeof value === 'boolean') {
    return new InputCheckbox({
      target,
      props: { value: template.value },
    });
  }
}
