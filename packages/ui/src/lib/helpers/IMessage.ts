import type { ComponentType, SvelteComponent } from 'svelte';

export enum MessageType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success'
}

export interface Message {
  id: string | Error | unknown;
  type: MessageType;
  content: string | Error | ComponentType;
  title?: string;
  props?: Record<string, unknown>;
  styleVars?: Record<string, string>;
  values?: string[];
  timeout?: number;
  resolve?: (answer: boolean | string | unknown) => void;
  reject?: () => void;
}

export interface MessageOptions {
  title: string;
  values: string[];
  styleVars: Record<string, string>;
  type: string;
  props: Record<string, unknown>;
  timeout: number;
  callback: (answer: boolean | string | unknown) => void;
}
