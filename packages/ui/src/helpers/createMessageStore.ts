import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Message, MessageOptions } from './IMessage';
import { MessageType } from './IMessage';
import createId from 'shortid';

const createMessageFactory =
  (store: Writable<Message[]>) =>
  (content: string | Error, options?: Partial<MessageOptions>) => {
    if (!content && !options) return;

    const hasValues = Array.isArray(options?.values);

    const message: Message = {
      id: createId(),
      type: MessageType.INFO,
      content: typeof content === 'string' ? content : '',
      title: options?.type,
      values: options?.values,
      timeout: options?.timeout,
    };

    const p = new Promise((_res, _rej) => {
      message.resolve = _res;
      message.reject = _rej;
    });
    p.finally(() =>
      store.update((msgs) => msgs.filter((m) => m.id !== message.id)),
    );

    // Find out type

    if (options && 'type' in options) {
      const t = options.type.toLowerCase();
      Object.values(MessageType).forEach((v) => {
        if (t === v) message.type = v;
      });
    }

    if (content instanceof Error) {
      message.type = MessageType.ERROR;
      message.content = content.message;
    }

    if (typeof message.timeout === 'undefined') {
      let timeout;

      if (message.type === MessageType.SUCCESS) {
        timeout = 3000;
      }

      if (message.type === MessageType.INFO) {
        timeout = 2000;
      }

      if (message.type === MessageType.WARNING) {
        timeout = 7000;
      }

      console.log(timeout);

      if (timeout && !hasValues) {
        message.timeout = timeout;
      }
    }

    if (!message.title) {
      message.title =
        message.type.toUpperCase().slice(0, 1) + message.type.slice(1);
    }

    store.update((messages) => [...messages, message]);

    if (message.timeout) {
      setTimeout(message.resolve, message.timeout);
    }

    return p;
  };

export default () => {
  const store: Writable<Message[]> = writable([]);

  const createMessage = createMessageFactory(store);

  return { store, createMessage, MessageType };
};
