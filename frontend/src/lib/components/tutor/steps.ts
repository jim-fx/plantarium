import { goto } from "$app/navigation";
import { wait } from "@plantarium/helpers";
import { createAlert, createToast } from "@plantarium/ui";
import Final from "./elements/Final.svelte";
import Greeting from "./elements/Greeting.svelte";
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

  const res = await createAlert(Greeting, { values: ["Lets go!"] });

  if (res === "exit") return "exit";

  return "level-plantview"
}

export async function test(s: string) {

  if (s !== "level-plantview") return;

  const res = await createOverlay({
    selector: ".scene-wrapper", description: `This is the <b>Plant View</b>, here you can explore the generated 3D model of your plant. 
Try to change the view by:

<ul>
<li>clicking and dragging</li>
<li>scrolling</li>
</ul>
`
  })

  if (res === "exit") return "exit";


  return "level-quickselect"
}

export async function projectHelp(s: string) {

  if (s !== "level-quickselect") return;

  let res = await createOverlay({
    description: 'This Button opens the quick select menu',
    clickSelector: 'header > div.left > span:first-child',
  })

  if (res === "exit") return "exit"

  res = await createOverlay({
    description:
      'This is the <b>QuickSelect</b> menu, here you can create, rename, delete, import and export projects.',
    selector: '.quick-select-wrapper',
  })
  if (res === "exit") return "exit"

  res = await createOverlay({
    description: 'This Button opens the <b>Settings View</b>',
    clickSelector: 'header > div.right > div:nth-child(3) .icon-wrapper',
  })

  return "level-settings";
}



export async function settings(s: string) {

  if (s !== "level-settings") return;

  let res = await createOverlay({
    description:
      'This is the <b>SettingView</b>, here you can change some general settings.',
    selector:
      'header > div.right > div > .hover-wrapper > .wrapper',
  });

  if (res === "exit") return "exit"

  res = await createOverlay({
    description:
      'When you encounter something which doesnt work or you have an idea for a new feature, use this button to report it.',
    clickSelector: 'header > div.right > .hover-wrapper:nth-child(2)',
  })

  await wait(1000);

  return "level-nodeintro"

}


export async function levelNodeIntro(s: string) {

  if (s !== "level-nodeintro") return;

  const visit = "Node Introduction";

  const res = await createOverlay({
    selector: '#nodesystem-view',
    description:
      `This is the <b>Node View</b>, here you define the way your plant looks. <br> If you are not so sure how nodes work, maybe visit the <b>${visit}</b>.`,
    values: [visit, "Continue"]
  })

  if (res === visit) {
    goto(window.location + "nodes/tutorial?ref=" + window.location);
  }

  return "level-plantnodes-0"

}

export async function plantNodes(s: string) {

  if (!s.startsWith("level-plantnodes-")) return;

  const level = +s.replace("level-plantnodes-", "");

  if (level === 0) {
    await createAlert(`This is the introduction to the <b>Plantarium</b> NodeSystem. <br>. You can also get here by using the <b>?</b> panel on the top right.`, { values: ["Lets Go"] })

    await createToast(`First, lets make sure that we start with a clean project, be opening the project manager <b>QuickSelect</b> menu and clicking <b>new</b>`, { values: ["Done!"] });

    return "level-plantnodes-1"
  }

  if (level === 1) {

    let res = await createToast(`You should see a single stem on the left side, and two nodes on the right side. <br><br> Let's try and create a simple plant. We start by rotating the stem on the right side, press <b>[shift+a]</b>, search for <i>rotate</i> and press <b>[enter]</b>`, { values: ["Done"] });
    if (!res) return "final";

    res = await createToast(`Click on the new node and drag it onto the connection between <i>stem</i> and <i>output</i>. If the nodes are to close together you can click on their name and move them.`, { values: ["Done"] });
    if (!res) return "final";

    await createToast(`<i>Tip:</i> Press <b>?</b> on the keyboard and hover over nodes to find out what they do`, { timeout: 5000 });

    res = await createToast(`Set the axis to <b>x</b>, disable <b>spread</b> and increase the angle to around 0.6`, { values: ["Done"] });
    if (!res) return "final";

    res = await createToast(`Now we increase the <b>amount</b> on the stem node to something like 5. <br>We dont see any change because all the stems are in exactly the same place.`, { values: ["Done"] });
    if (!res) return "final";

    res = await createToast(`Create a new <b>Rotate</b> node and connect it between the other rotate node and the output. Set the axis to y and increase the angle. <br> You should now see all the other stems.`, { values: ["Done"] });
    if (!res) return "final";

    await createToast(`That kind of looks like a plant 🎉`, { type: "success" });

    res = await createToast(`Now, create a <b>gravity</b> node and connect it between the last rotate node and the output, set the strength to ~0.5`, { values: ["Done"] });
    if (!res) return "final";

    res = await createToast(`For the final touch create an <b>instance</b> node and connect it between the gravity and the output`, { values: ["Done"] });
    if (!res) return "final";


    res = await createToast("The node will complain that it needs a model to instance, create a <b>leaf</b> node and connect it to the model input of the instance node", { values: ["Done"] })


    await createToast(`<i>Tip:</i> when you drag a node socket while holding <b>[ctrl]</b> and release, it shows you a menu of available nodes`, { values: ["Cool!"] });

    return "final"

  }


}

export async function final(s: string) {

  if (s !== "final") return;

  await wait(2000);

  await createAlert(Final, { title: "Done 🎉🎉🎉", timeout: 0, values: ["Finish Tutorial"] })

  return "exit"

}
