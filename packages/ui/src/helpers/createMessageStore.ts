import { Writable, writable } from 'svelte/store';
import { Message, MessageOptions, MessageType } from './IMessage';

const createMessageFactory =
  (store: Writable<Message[]>) =>
  (content: string, options?: Partial<MessageOptions>) => {
    if (!content && !options) return;

    let res, rej;
    const p = new Promise((_res, _rej) => {
      res = _res;
      rej = _rej;
    });

    const message: Message = {
      type: MessageType.INFO,
      content,
      title: options?.type,
      values: options?.options,
      timeout: options?.timeout,
      reject: rej,
      resolve: res,
    };

    if (options) {
      if ('type' in options) {
        const t = options.type.toLowerCase();
        Object.values(MessageType).forEach((v) => {
          if (t === v) message.type = v;
        });
      }

      if (!('timeout' in options) || typeof options.timeout === 'undefined') {
        if (
          message.type === MessageType.INFO ||
          message.type === MessageType.WARNING
        ) {
          message.timeout = 2000;
          setTimeout(message.resolve, 2000);
        }
      }

      if (!options.title) {
        switch (message.type) {
          case MessageType.ERROR:
            message.title = message.title || 'Error';
            break;
          case MessageType.WARNING:
            message.title = message.title || 'Warning';
            break;
          case MessageType.INFO:
            message.title = message.title || 'Info';
            break;
        }
      }
    }

    store.update((messages) => [...messages, message]);

    console.log(message);

    p.finally(() => store.update((msgs) => msgs.filter((m) => m !== message)));

    return p;
  };

export default () => {
  const store: Writable<Message[]> = writable([]);

  const createMessage = createMessageFactory(store);

  return { store, createMessage, MessageType };
};
