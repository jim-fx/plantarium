# Script for the Tutorial

## Introduction

Hi, im Max, i created this tool because i really like to work with nodes. I think they are a great way to realize a fully procedural workflow.

But this workflow is also a bit hard to get started with, as you need to have a rough mental model of how everything works to become productiv.

Now i will try to show you my mental model of how they work, so maybe you can understand them too.

## Nodes

Lets create our first Node, rightclick anywhere to create a new node. Lets create a number node.

As you can see the node has a number input where you can set it to a certain number, and on the rightside, it has a small socket.

We can connect the outputs of Nodes to the inputs of other nodes, lets try it out.

## Connecting Nodes

Create a new Node, this time a output node. Click on the right socket of the number node and drag your cursor until a wire appears, now connect that wire to the input socket on the left side of the output node.

Now you should see the number from the input node on the output node. You can imagine each node as a small machine that generates something and the output of that machine is piped through the wires to the next nodes.

## Math

Now for something more complex, lets add a Math Node.

Select the math node with the mouse and drag it on top of the wires of the already connected nodes. Then change the value of the b input of the math node. the output should now change.

## Booleans

The fun thing about this system is that it can not only work with numbers, but with booleans to. Booleans can have two values, either true or false.

We can build a small program that always picks the largest of two numbers. First, lets create another number node, then create a compare node and plug the outputs of the number nodes into the input of the compare nodes. Then create a picker nodes and also plug the outputs of the numbers into the picker node, then the output of the compare node into the top input of the picker node.

Now finally we can connect the output of the picker node into the output node.

## Finally

I hope you could get a glimpse at how nodes work and how powerfull they can be. If you want you can play around with these a bit more, or you can return to plantarium to start playing with the plant nodes over there.

Over and out, max
