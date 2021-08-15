import createMessageStore from '../helpers/createMessageStore';
import 'svelte/store';

const { store, createMessage: createAlert, MessageType } = createMessageStore();

export { store, createAlert, MessageType };
