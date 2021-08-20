import { createAlert, createToast } from '@plantarium/ui';
import { localState } from '../../helpers';
import steps from './steps';
import store from './store';
import TutorWrapper from './Tutor.svelte';

const affirmatives = ['yes', 'next', 'lets go', 'okay'];

let pm;

const Tutor = {
  handleReject: () => {
    localState.set('hasViewedTutorial', true);
    createToast('The tutorial is accessable under...');
  },
  currentIndex: 0,
  previous: async function () {
    //
  },
  next: async function () {
    const currentStep = steps[this.currentIndex];
    if (this.currentIndex === steps.length) {
      return;
    }
    if (currentStep.setup) await currentStep.setup({ pm });
    store.set(currentStep);
    this.currentIndex++;

    if (this.currentIndex > 2) {
      localState.set('hasViewedTutorial', true);
    }

    currentStep.title =
      currentStep.title ?? `Tutorial (${this.currentIndex}/${steps.length})`;

    if (currentStep.type === 'alert') {
      const res = await createAlert(currentStep.description, {
        title: currentStep.title,
        type: 'success',
        values: currentStep.options
          ? Object.keys(currentStep.options)
          : undefined,
        timeout: 0,
      });

      if (affirmatives.includes(res.toString())) return this.next();
    }

    if (currentStep.type === 'toast') {
      const res = await createToast(currentStep.description, {
        values: currentStep.options
          ? Object.keys(currentStep.options)
          : undefined,
        timeout: 0,
      });
      if (affirmatives.includes(res.toString())) return this.next();
    }

    const unsub = store.subscribe((v) => {
      if (v._isCompleted) {
        unsub();
        this.next();
      }
    });
  },
  init: function ({ projectManager }) {
    if (localState.get('hasViewedTutorial')) return;

    pm = projectManager;

    const greetings = `It looks like this is your first time here...
    Want to take a little tour? `;

    setTimeout(async () => {
      const res = await createToast(greetings, {
        title: '',
        timeout: 8000,
        values: ['nah', 'yes'],
      });

      // this.currentIndex = 5;
      if (res === 'yes') this.next();
      else this.handleReject();
    }, 10000);
  },
  restart: function () {
    localState.set('hasViewedTutorial', false);
    this.currentIndex = 0;
    this.next();
  },
};

export { Tutor, TutorWrapper };
