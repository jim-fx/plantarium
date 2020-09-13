import InputSlider from './InputSlider.svelte';
import InputNumber from './InputNumber.svelte';
import InputSelect from './InputSelect.svelte';
import InputCurve from './InputCurve.svelte';
import InputShape from './InputShape.svelte';
import type { ValueTemplate } from '@plantarium/types';
export { InputNumber, InputSlider, InputSelect, InputCurve, InputShape };
export declare function stateToElement(target: HTMLElement, template: ValueTemplate, value: any): InputSlider;
