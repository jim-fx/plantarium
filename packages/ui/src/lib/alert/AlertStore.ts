import createMessageStore from '../helpers/createMessageStore';
import 'svelte/store';
import type { SvelteComponentDev } from 'svelte/internal';
import type { Message, MessageOptions } from '../helpers/IMessage';
import type { Writable } from 'svelte/store';

const { store: _store, createMessage, MessageType } = createMessageStore();

const store: Writable<Message[]> = _store;

const createAlert: (
  content: string | Error | typeof SvelteComponentDev,
  options?: Partial<MessageOptions>
) => Promise<unknown> = createMessage;

export { store, createAlert, MessageType };
