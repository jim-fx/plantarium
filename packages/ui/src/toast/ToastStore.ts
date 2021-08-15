import createMessageStore from '../helpers/createMessageStore';
import 'svelte/store';

const { store, createMessage: createToast } = createMessageStore();

export { store, createToast };
