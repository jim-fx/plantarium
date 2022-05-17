import type TutorStep from './ITutorStep';
import { browser } from "$app/env"
import Final from './steps/Final.svelte';
import Greeting from './steps/Greeting.svelte';

const steps: TutorStep[] = [
  {
    title: 'Tutorial',
    description: Greeting,
    options: {
      'lets go': () => {
        /**/
      },
    },
    type: 'alert',
  },
  {
    description: `This is the <b>Plant View</b>, here you can explore the generated 3D model of your plant. 
      Try to change the view by:`,
    selector: '.scene-wrapper',
    checks: [
      {
        description: 'Clicking and dragging',
        setup: function(isCompleted, { c }) {
          const el = document.querySelector(c.selector);
          if (el.getAttribute('setup') === 'true') return;
          el.setAttribute('setup', 'true');
          el.addEventListener('click', isCompleted, { once: true });
        },
      },
      {
        description: 'Scrolling / Zooming',
        setup: (isCompleted, { c }) => {
          const el = document.querySelector(c.selector + '> canvas');
          if (el.getAttribute('setup') === 'true') return;

          el.setAttribute('setup', 'true');

          el.addEventListener('wheel', isCompleted, {
            once: true,
            passive: true,
          });
        },
      },
    ],
  },
  {
    selector: '#nodesystem-view',
    description:
      `This is the <b>Node View</b>, here you define the way your plant looks. Try playing with some of the settings. If you are not so sure how this works, maybe visit the <a href="/nodes/tutorial?ref=${browser ? window.location : ""}">NodeTutorial</a>`,
  },
  {
    description: 'This Button opens the project view',
    clickSelector: 'header > div.left > div > div',
  },
  {
    description:
      'This is the ProjectView, here you can create/rename/delete projects.',
    selector: '.project-manager-wrapper',
    checks: [
      {
        description: 'create a new project',
        setup: (isCompleted, { pm }) => {
          pm.once('new', isCompleted);
        },
      },
      {
        description: 'rename the project',
        setup: (isCompleted, { pm }) => {
          pm.once('update', isCompleted);
        },
      },
      {
        description: 'delete the project',
        setup: (isCompleted, { pm }) => {
          pm.once('delete', isCompleted);
        },
      },
    ],
  },
  {
    description: 'This Button opens the <b>Settings View</b>',
    clickSelector: 'header > div.right > div:nth-child(2) .icon-wrapper',
  },
  {
    description:
      'This is the <b>SettingView</b>, here you can change some general settings.',
    selector:
      'header > div.right > div:nth-child(2) > div > div > div.wrapper.right.visible',
  },
  {
    description:
      'When you encounter something which doesnt work or you have an Idea for a new feature, use this button to report it.',
    clickSelector: 'header > div.right > div:nth-child(1) > div',
  },
  {
    title: 'Tutorial',
    description: Final,
    options: {
      'lets go': () => {
        /**/
      },
    },
    type: 'alert',
  },
];

export default steps;
