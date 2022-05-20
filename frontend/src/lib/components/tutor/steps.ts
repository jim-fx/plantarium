import { goto } from "$app/navigation";
import { wait } from "@plantarium/helpers";
import { createAlert, createToast } from "@plantarium/ui";
import Greeting from "./elements/Greeting.svelte"
import Final from "./elements/Final.svelte"
import { createOverlay } from "./store";

export async function intro(s: string) {

  if (s !== "waiting") return;

  const greetings = `It looks like this is your first time here...
    Want to take a little tour? `;

  await wait(7000);

  const res = await createToast(greetings, {
    title: '',
    timeout: 8000,
    values: ['nah', 'yes'],
  });

  if (res === 'yes') return "intro";
  return "exit";

}

export async function level1(s: string) {

  if (s !== "intro") return;

  let res = await createAlert(Greeting, { values: ["Lets go!"] });

  if (res === "exit") return "exit";

  return "level-plantview"
}

export async function test(s: string) {

  if (s !== "level-plantview") return;

  let res = await createOverlay({
    selector: ".scene-wrapper", description: `This is the <b>Plant View</b>, here you can explore the generated 3D model of your plant. 
Try to change the view by:

<ul>
<li>clicking and dragging</li>
<li>scrolling</li>
</ul>
`
  })

  if (res === "exit") return "exit";


  return "level-nodeintro"
}


export async function levelNodeIntro(s: string) {

  if (s !== "level-nodeintro") return;

  let visit = "Visit Nodes Tutorial"

  const res = await createOverlay({
    selector: '#nodesystem-view',
    description:
      `This is the <b>Node View</b>, here you define the way your plant looks. Try playing with some of the settings. If you are not so sure how nodes work, maybe visit the Nodes Tutorial`,
    values: [visit, "Continue"]
  })

  if (res === visit) {
    goto(window.location + "nodes/tutorial");
  }

  return "level-nodeview"

}

export async function levelNodeView(s: string) {

  if (s !== "level-nodeview") return;

  let res = await createOverlay({
    description: 'This Button opens the project view',
    clickSelector: 'header > div.left > div > div',
  })

  if (res === "exit") return "exit"

  res = await createOverlay({
    description:
      'This is the ProjectView, here you can create, rename, delete, import and export projects.',
    selector: '.project-manager-wrapper',
  })
  if (res === "exit") return "exit"

  res = await createOverlay({
    description: 'This Button opens the <b>Settings View</b>',
    clickSelector: 'header > div.right > div:nth-child(2) .icon-wrapper',
  })

  return "level-settings";
}

export async function settings(s: string) {

  if (s !== "level-settings") return;

  let res = await createOverlay({
    description:
      'This is the <b>SettingView</b>, here you can change some general settings.',
    selector:
      'header > div.right > div:nth-child(2) > div > div > div.wrapper.right.visible',
  });

  if (res === "exit") return "exit"

  res = await createOverlay({
    description:
      'When you encounter something which doesnt work or you have an idea for a new feature, use this button to report it.',
    clickSelector: 'header > div.right > div:nth-child(1) > div',
  })

  await wait(2000);

  if (res === "exit") return "exit"
  await createAlert(Final, { title: "Done 🎉🎉🎉", timeout: 0 })

  return "exit"


}
