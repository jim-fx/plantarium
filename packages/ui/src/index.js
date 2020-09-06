import InputSlider from './InputSlider.svelte';
import InputNumber from './InputNumber.svelte';
import InputSelect from './InputSelect.svelte';
import InputCurve from './InputCurve.svelte';
import InputShape from './InputShape.svelte';

export { InputNumber, InputSlider, InputSelect, InputCurve, InputShape };

// *****************************************
// * Notice that the component is not instantiated and mounted to the document <body className="">
// * Since the compiler is creating a custom element, we instead define and use the custom element
// * in the index.html file to simulate the end-user experience.
// ******************************************

export function stateToElement(template, value = 0) {

  if (Array.isArray(template.values)) {
    const element = new InputSelect();
    element.setItems(template.values);
    element.setValue(+value || value || template.values[0]);
    return element;
  }

  if (template.inputType === 'slider') {
    const element = new InputSlider();
    if ('max' in template) element.setAttribute('max', template.max);
    if ('min' in template) element.setAttribute('min', template.min);
    if ('step' in template) element.setAttribute('step', template.step);
    element.setAttribute('value', value || template.value);
    return element;
  }

  if (template.inputType === 'curve') {
    const element = new InputCurve();
    if ('points' in template) element.setAttribute('points', template.points);
    return element;
  }

  if (template.inputType === 'shape') {
    const element = new InputShape();
    if ('points' in template) element.setAttribute('points', template.points);
    return element;
  }

  if (template.type === 'number' || typeof template.value === 'number') {
    const element = new InputNumber();
    if ('max' in template) element.setAttribute('max', template.max);
    if ('min' in template) element.setAttribute('min', template.min);
    if ('step' in template) element.setAttribute('step', template.step);
    element.setAttribute('value', value);
    return element;
  }
}
