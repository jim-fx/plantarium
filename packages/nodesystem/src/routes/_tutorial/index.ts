import { browser } from "$app/env";
import type { NodeSystem } from "$lib";
import { createAlert, createToast } from "@plantarium/ui";
import { readable, type Readable } from "svelte/store";

export default class TutorialManager {

  nodeSystem: NodeSystem;

  state: string = "waiting";
  stateStore: Readable<string>;
  isRunning: boolean = false;

  setState: (s: string) => void;

  constructor() {

    this.stateStore = readable(this.state, (set) => {
      this.setState = async (s) => {
        if (!s) return;
        set(s);
        this.state = s;
        let newState = await this.start()
        this.isRunning = false;
        if (typeof newState === "string" && newState && newState !== this.state) {
          this.setState(newState);
        }

      };
    })
  }

  async start() {

    if (this.isRunning) return;
    this.isRunning = true;

    if (this.state === "waiting") {

      const res = await createAlert(`This guide will help you understand how Node based Interfaces work in general, and how the Plantarium Nodesystem works. 

Do you want to start the tutorial, or first play around a bit?`, { values: ["Let's get started", "Play Around"], title: "Hi :)" })
      if (res === "Let's get started") {
        this.setState("level-0")
      } else {
        this.setState("playing")
      }
    }


    if (this.state === "level-0") {
      await createToast(`I like to think of Nodes as little factories connected by pipes.

Each Node, or Factory gets some inputs, transforms them and outputs something new.`, { values: ["Okay...?", "Understood"] })

      return "level-1"
    }

    if (this.state === "level-1") {
      const res = await createToast("Alright, who wants a coffee?", { values: ["Meee!", "No Thanks"] })
      if (res === "No Thanks") {
        return "level-1-interlude-0"
      } else {
        return "level-2"
      }
    }

    if (this.state.startsWith("level-1-interlude-")) {
      const level = +this.state.replace("level-1-interlude-", "");
      if (level === 0) {
        const res = await createToast(`ERROR: Participant did not accept coffee?`, { type: "error", values: ["Accept Coffee", "Nah, dont want coffee"] })
        console.log({ res })
        if (res === "Accept Coffee") {
          return "level-2"
        } else {
          return "level-1-interlude-1"
        }
      } else if (level === 1) {
        const res = await createToast("You reeally dont like coffee, do you?", { values: ["Nope", "Just Trolling :)"] })
        if (res.startsWith("Just")) {
          await createToast("Alright, I can understand that 🙃, lets continue...", { timeout: 2000 });
          return "level-2"
        } else {
          await createToast("Hmm, okay, then lets imagine that we dont make a coffee for you but for a person which really likes coffee?", { values: ["okay", "okay", "okay"] })
          return "level-2"

        }
      }
    }


    if (this.state === "level-2") {
      await createToast(`Well then, what do we need to make a coffee? A coffee machine of course!

You can create one by pressing [shift+a] search for *machine* and press [enter]

<i>Btw, if you encounter any problems, just reload the page, the progress is saved :)</i>
`, { values: ["Done"] })

      return "level-3"
    }

    if (this.state === "level-3") {

      await createToast(`Yeaah 🎉🎉🎉🎉
Congrats on your first node :)`, { type: "success" })

      await createToast(`You can drag nodes around, delete them by selecting them and pressing [x] and also copy and paste them.`, { values: ["Okay"] })

      await createToast("As we can see the coffee machine has some inputs on the left side and some outputs on the right side. I wonder if we can connect anything to those...?", {
        values: ["Continue"]
      })

      return "level-4"

    }


    if (this.state === "level-4") {
      await createToast(`Offcourse we can :)

Create a <b>water node</b> on the left side of the coffee machine.`, { values: ["Done"] });


      await createToast(`The water node has a single output with the same color as the water input of the coffee machine.

This means that those sockets are compatible.

Click on the output of the water node and drag it to the input of the coffee machine.

<i>Sometimes its a bit easier to just select both nodes and press [c] on the keyboard.</i>
`, { values: ["Connected!"] })

      return "level-5"
    }

    if (this.state === "level-5") {

      await createToast(`Not much happened here, because we dont yet have an output node in our system.

Lets create a <b>Person</b> one on the right side of the coffee machine and connect the coffee machine to it.`, { values: ["Done!"] })

      return "level-6"

    }

    if (this.state === "level-6") {

      const res = await createToast(`There is something missing here, can you guess what it is?`, { values: ["Coffee Powder", "Sense of humor"] });

      if (res === "Sense of humor") {
        await createToast("...")
      }

      await createToast(`Apparently we are in a very fancy kitchen here, because we dont seem to have coffee powder, only coffee beans...

Lets add those on the left side of the coffee machine.
`, { values: ["Done"] })

      const res2 = await createToast(`We cant connect the coffee beans directly to the machine, we need to grind them first...

Any idea how to do that?`, {
        values: ["Coffee Grinder", `Wait for the inevateble heat death 
of the universe, they should be powdered by then.`]
      })

      if (res2 !== "Coffee Grinder") {
        await createToast("Yeahh, sadly we dont have that much time.")
      }

      await createToast("Lets add a coffee grinder in between the coffee beans and the coffee machine and connect it", { values: ["Done"] })


      const r = await createToast("Yayy, we have coffee", { type: "success" })

      console.log({ r })

      return "level-7"

    }

    if (this.state === "level-7") {

      const res = await createToast("The tutorial is now finished, if you want you can play around with this setup <i>(there are a few easter eggs to find)</i> a bit more or you can go back", { values: ["play around", "go back"] });

      if (res === "go back") {
        window?.history?.back()
      } else {
        return "playing"
      }

    }


    this.isRunning = false;


  }

  end() {

  }

}
