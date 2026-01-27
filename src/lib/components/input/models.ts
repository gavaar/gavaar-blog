import { TemplateRef } from '@angular/core';

export enum GavInputType {
  Number = 'number',
  Text = 'text',
  Textarea = 'textarea',
  Select = 'select',
  Slider = 'slider',
}

/**
 * #### All inputs
 * @prop label - What is shown above the input
 * @prop placeholder - What is shown in the input when empty
 * 
 * #### Select
 * @prop options - Value for multi-select input. Unused if passed to another type.
 * @prop selectOptionTemplate - Template to build options for the multi-select input.
 */
export interface InputConfig {
  label?: string;
  placeholder?: string;
  selectOptions?: { key: string; value: string; }[];
  selectOptionTemplate?: TemplateRef<{ $implicit: string }>;
}
