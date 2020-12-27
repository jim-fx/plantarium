import { Writable, writable } from 'svelte/store';

enum MessageType {
  INFO,
  WARNING,
  ERROR,
  CONFIRM,
}

interface Message {
  type: MessageType;
  content: string;
  title: string;
  values?: unknown[];
  timeout?: number;
  resolve?: (answer: boolean | string | unknown) => void;
  reject?: () => void;
}

const store: Writable<Message> = writable(null);

interface AlertOptions {
  content: string;
  title: string;
  options: unknown[];
  type: string;
  callback: (answer: boolean | string | unknown) => void;
}

const createAlert = (
  content: string | unknown[],
  options?: Partial<AlertOptions> | unknown[],
) => {
  if (!content && !options) return;

  let msg: Message = {
    type: MessageType.INFO,
    content: '',
    title: '',
  };

  if (!options) {
    if (Array.isArray(content)) {
      msg = {
        type: MessageType.CONFIRM,
        values: content,
        title: 'Select',
        content: '',
      };
    } else {
      msg = {
        type: MessageType.INFO,
        title: 'Info',
        content: content,
      };
    }
  } else {
    if (Array.isArray(options) && typeof content === 'string') {
      msg = {
        type: MessageType.CONFIRM,
        values: options,
        title: 'Confirm',
        content: content,
      };
    }
  }

  if (options) {
    if ('type' in options) {
      const t = options.type.toLowerCase();
      if (t.includes('err')) {
        msg.type = MessageType.ERROR;
      } else if (t.includes('warn')) {
        msg.type = MessageType.WARNING;
      }
    }
  }

  let res, rej;
  const p = new Promise((_res, _rej) => {
    res = _res;
    rej = _rej;
  });

  msg.reject = () => {
    rej();
  };

  msg.resolve = (answer: unknown) => {
    res(answer);
  };

  if (msg.type === MessageType.INFO || msg.type === MessageType.WARNING) {
    msg.timeout = 2000;
    setTimeout(msg.resolve, 2000);
  }

  switch (msg.type) {
    case MessageType.CONFIRM:
      msg.title = msg.title || 'Confirm';
      break;
    case MessageType.ERROR:
      msg.title = msg.title || 'Error';
      break;
    case MessageType.WARNING:
      msg.title = msg.title || 'Warning';
      break;
    case MessageType.INFO:
      msg.title = msg.title || 'Info';
      break;
  }

  store.set(msg);

  p.finally(() => {
    store.set(null);
  });

  return p;
};

/*
addMessage("Some general information about state");
addMessage(["Pls", "Select", "one", "of", "those", "values"], () => handleAnswer);
addMessage("Pls answer this important question", () => handleAnswer);
addMessage("Something went very wrong",{type: "error"});
*/

export { store, createAlert, MessageType };
