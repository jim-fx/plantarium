import createId from 'shortid';
import type { SvelteComponent } from 'svelte';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { Message, MessageOptions } from './IMessage';
import { MessageType } from './IMessage';

const createMessageFactory =
  (store: Writable<Message[]>) =>
  (
    content: string | Error | typeof SvelteComponent,
    options: Partial<MessageOptions> = {},
  ) => {
    if (!content && !options) return;

    const hasValues = Array.isArray(options?.values);

    const message: Message = {
      id: createId(),
      type: MessageType.INFO,
      content,
      props: options.props,
      title: options?.title ?? options?.type,
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
    }

    if (typeof message.timeout === 'undefined') {
      let timeout:number;

      if (message.type === MessageType.SUCCESS) {
        timeout = 3000;
      }

      if (message.type === MessageType.INFO) {
        timeout = 2000;
      }

      if (message.type === MessageType.WARNING) {
        timeout = 7000;
      }

      if (timeout && !hasValues) {
        message.timeout = timeout;
      }
    }

    if (!('title' in message)) {
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
