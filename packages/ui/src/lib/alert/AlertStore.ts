import createMessageStore from '../helpers/createMessageStore.js';

const { store, createMessage, MessageType } = createMessageStore();

export { store, createMessage as createAlert, MessageType };
