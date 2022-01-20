import createMessageStore from '../helpers/createMessageStore';
import 'svelte/store';
import type { SvelteComponentDev } from 'svelte/internal';
import type { MessageOptions } from '../helpers/IMessage';

const { store, createMessage, MessageType } = createMessageStore();

const createAlert: (
  content: string | Error | typeof SvelteComponentDev,
  options?: Partial<MessageOptions>
) => Promise<unknown> = createMessage;

export { store, createAlert, MessageType };
