import 'svelte/store';
import type { Writable } from 'svelte/store';
import createMessageStore from '../helpers/createMessageStore';
import type { Message, MessageOptions } from '../helpers/IMessage';

const { store: _store, createMessage } = createMessageStore();

const store: Writable<Message[]> = _store;

const createToast: (
  content: string | Error,
  options?: Partial<MessageOptions>
) => Promise<unknown> | undefined = createMessage;

export { store, createToast };
