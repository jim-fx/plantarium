import { NodeState, Node, NodeView } from "$lib"


const coffee_powder = {
  title: "Beans",
  type: "coffee_beans",
  outputs: ["coffee_beans"],
  parameters: {
    type: {
      type: "select",
      values: ["arabica", "bourbon", "catimor", "catuai", "caturra"],
      internal: true,
      value: "arabica"
    }
  },
  compute({ type }) {
    return {
      type: "coffee_beans",
      beanType: type
    }
  }
}

const coffee_grinder = {
  title: "Grinder",
  type: "coffee_grinder",
  outputs: ["coffee_powder"],
  parameters: {
    beans: {
      type: "coffee_beans",
      external: true,
    },
    grade: {
      type: "number",
      min: 0.2,
      max: 5,
      step: 0.05
    }
  },
  compute({ beans, grade }) {
    if (beans) {
      return {
        type: "coffee_powder",
        beanType: beans.beanType,
        grade
      }
    }
  }

}

const coffee_machine = {
  title: "Coffee Machine",
  type: "coffee_machine",
  outputs: ["fluid"],
  parameters: {
    powder: {
      type: "coffee_powder",
      external: true
    },
    water: {
      type: "fluid",
      external: true
    }
  },
  compute({ powder, water }) {

    if (powder && water) {
      if (water.fluidType !== "water") {
        return {
          ...powder,
          amount: 50,
          fluidType: "nasty",
          type: "fluid"
        }
      }
      return {
        ...powder,
        amount: 50,
        fluidType: "coffee",
        type: "fluid"
      }
    }

  }
}

const mix = {
  title: "Mix",
  type: "mix",
  outputs: ["fluid"],
  parameters: {
    fluidA: {
      type: "fluid",
      external: true
    },
    fluidB: {
      type: "fluid",
      external: true
    },
    // factor: {
    //   type: "number",
    //   min: 0,
    //   max: 1,
    //   step: 0.05
    // }
  },
  compute({ fluidA, fluidB }) {

    if (!fluidA || !fluidB) return fluidA || fluidB;

    const fluids = [];

    if (fluidA.fluidType === "mix") {
      fluids.push(...fluidA.fluids)
    } else {
      fluids.push(fluidA)
    }


    if (fluidB.fluidType === "mix") {
      fluids.push(...fluidB.fluids)
    } else {
      fluids.push(fluidB)
    }

    if (fluids.length === 2 && fluidA.fluidType === fluidB.fluidType && fluidA.fluidType === "water") {
      return fluidA;
    }

    return {
      type: "fluid",
      fluidType: "mix",
      fluids
    }

  }
}

class HumanNode extends Node {
  constructor(system, props) {
    super(system, props);

    this.attributes.type = "output"

    this.states = {
      input: new NodeState(this, 'input', {
        type: '*',
        external: true,
        label: false,
      }),
    };
    this.outputs = [];
  }

  compute({ input }) {
    return input;
  }
}

class HumanView extends NodeView {
  constructor(node) {
    super(node);

    const d = document.createElement('p');

    d.style.margin = '0px';
    d.style.fontSize = '9px'
    d.style.padding = '4px';
    // d.style.color = 'white';
    d.style.fontWeight = 'bold';

    node.on('computedData', (data) => {

      let result = "Hmm, I received nothing?"

      if (data?.type === "fluid") {


        if (data?.fluidType === "mix") {

          let fluids = data.fluids.map(f => f.fluidType).sort();

          if (fluids.length === 1) {
            data = data.fluids[0]
          }

          if (fluids.length === 2) {
            if (fluids[0] === "milk" && fluids[1] === "water") {
              result = "This reminds me of the time i was studying :)"
            } else if (fluids[0] === "coffee" && fluids[1] === "milk") {
              result = "Yess, latte macchiato, the pinnacle of coffee making"
            } else if (fluids[0] === fluids[1]) {
              if (fluids[0] === "coffee") {
                result = "Whaaaa, so strong, i can see time"
              } else {
                result = `Ohh, double ${fluids[0]}, very strong!`
              }
            } else if (fluids[0] === "coffee" && fluids[1] === "water") {
              result = "And that is what we call a americano"
            }
          } else {
            fluids.splice(-1, 0, "and")
            result = `Okay, ${fluids.join(", ").replace(", and, ", " and ")}, thats a bit much, dont you think?`
          }

        }

        if (data?.fluidType === "water") {
          result = "Hydrating! but pretty tasteless... A coffee would be nice"
        }

        if (data?.fluidType === "milk") {
          result = "Ahh, a cold glass of milk"
        }

        if (data?.fluidType === "nasty") {
          result = "Ewww, wtf is that?"
        }

        if (data?.fluidType === "coffee") {
          result = `Nice, a${data.grade > 4 ? " very strong" : "n"} espresso!`
          if (data?.beanType !== "arabica") {
            result += `<br>oh, ${data.beanType}, exotic bean choice, i like it`
          }
        }

      }

      if (data?.type === "coffee_beans") {
        result = "Crunch, Crunch, Crunch"
      }

      if (data?.type === "coffee_powder") {
        result = "Hmmm, " + data.beanType + " but i aint eating that."
      }

      d.innerHTML = result;
    });

    this.wrapper.appendChild(d);
  }
}

const human = {
  title: 'Person',
  type: "output",
  meta: {
    description: 'Wants coffee',
  },
  node: HumanNode,
  view: HumanView,
}

const milk = {
  title: "Milk",
  type: "milk",
  outputs: ["fluid"],
  compute() {
    return {
      type: "fluid",
      fluidType: "milk",
      amount: 50
    }


  }
}

const tap = {
  title: "Water",
  type: "water_tap",
  outputs: ["fluid"],
  compute() {
    return {
      type: "fluid",
      fluidType: "water"
    }
  }
}

export default [
  tap,
  human,
  milk,
  mix,
  coffee_powder,
  coffee_grinder,
  coffee_machine
]
