import { createAlert, createToast } from '@plantarium/ui';
import { localState } from '../../helpers';
import steps from './steps';
import store from './store';
import TutorWrapper from './Tutor.svelte';

const affirmatives = ['yes', 'next', 'lets go', 'okay'];

let pm;

const Tutor = {
  handleReject: () => {
    createToast('Perfectly fine, you can reach the tutor under here');
  },
  currentIndex: 0,
  previous: async function () {
    //
  },
  next: async function () {
    const currentStep = steps[this.currentIndex];
    if (!currentStep) return;
    if (currentStep.setup) await currentStep.setup({ pm });
    store.set(currentStep);
    this.currentIndex++;

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
        values: ['nah', 'yes'],
      });

      // this.currentIndex = 5;
      if (res === 'yes') this.next();
      else this.handleReject();
    }, 100);
  },
};

export { Tutor, TutorWrapper };
