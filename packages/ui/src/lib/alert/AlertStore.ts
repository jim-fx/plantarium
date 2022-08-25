import type { SvelteComponentDev } from 'svelte/internal';
import type { Writable } from 'svelte/store';
import createMessageStore from '../helpers/createMessageStore.js';
import type { Message, MessageOptions } from '../helpers/IMessage.js';

const { store: _store, createMessage, MessageType } = createMessageStore();

const store: Writable<Message[]> = _store;

const createAlert: (
  content: string | Error | typeof SvelteComponentDev,
  options?: Partial<MessageOptions>
) => Promise<unknown> | undefined = createMessage;

export { store, createAlert, MessageType };
