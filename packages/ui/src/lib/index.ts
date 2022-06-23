import { createAlert } from './alert/AlertStore';
import AlertWrapper from './alert/AlertWrapper.svelte';

import { createToast } from './toast/ToastStore';
import ToastWrapper from './toast/ToastWrapper.svelte';

import type { SvelteComponent } from 'svelte';
import Button from './Button.svelte';
import ButtonGroup from "./ButtonGroup.svelte";
import Icon from './Icon.svelte';
import InputCheckbox from './InputCheckbox.svelte';
import InputColor from './InputColor.svelte';
import InputCurve from './InputCurve.svelte';
import InputFloat from './InputFloat.svelte';
import InputInteger from './InputInteger.svelte';
import InputRange from './InputRange.svelte';
import InputSearch from './InputSearch.svelte';
import InputSelect from './InputSelect.svelte';
import InputShape from './InputShape.svelte';
import InputSlider from './InputSlider.svelte';
import InputTab from './InputTab.svelte';
import InputText from './InputText.svelte';
import InputVec2 from './InputVec2.svelte';
import InputVec3 from './InputVec3.svelte';
import LikeButton from './LikeButton.svelte';
import Section from './Section.svelte';
import StackTrace from './toast/StackTrace.svelte';
import type { ValueTemplate } from './types';
export { default as Gallery } from "./Gallery.svelte";
export { default as GalleryItem } from "./GalleryItem.svelte";
export { default as LogViewer } from "./LogViewer.svelte";
export type {
  CheckboxTemplate, CurveTemplate, FloatTemplate, IntegerTemplate, RangeTemplate, SelectTemplate, ShapeTemplate, ValueTemplate
} from "./types";
export {
  InputFloat,
  InputInteger,
  InputText,
  InputSlider,
  ButtonGroup,
  LikeButton,
  InputVec2,
  InputVec3,
  InputRange,
  InputSelect,
  InputCheckbox,
  InputCurve,
  InputShape,
  InputSearch,
  InputTab,
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
  delete props["internal"]
  delete props["label"]
  delete props["description"]

  return new component({ target, props });
}

export function stateToComponent(template: ValueTemplate): typeof SvelteComponent {
  if (template.type === 'select') {
    if (template.inputType === "tab") {
      return InputTab
    }
    return InputSelect;
  }

  if (template.type === 'curve') {
    return InputCurve;
  }

  if (template.type === 'shape') {
    return InputShape;
  }

  if (template.type === "vec3") {
    return InputVec3
  }

  if (template.type === "vec2") {

    if (template.inputType === "range") {
      return InputRange;
    }

    return InputVec2;
  }

  if (template.type === 'number') {
    if (template.inputType) {
      if (template.inputType === "float") {
        return InputFloat;
      }
      if (template.inputType === "integer") {
        return InputInteger
      }
    }

    if (template?.step && (template.step % 1 !== 0)) {
      return InputFloat;
    }

    return InputInteger;
  }

  return InputCheckbox;
}
