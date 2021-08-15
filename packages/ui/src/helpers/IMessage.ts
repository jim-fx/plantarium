export enum MessageType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
}

export interface Message {
  type: MessageType;
  content: string;
  title: string;
  values?: unknown[];
  timeout?: number;
  resolve?: (answer: boolean | string | unknown) => void;
  reject?: () => void;
}

export interface MessageOptions {
  content: string;
  title: string;
  options: unknown[];
  type: string;
  timeout: number;
  callback: (answer: boolean | string | unknown) => void;
}
