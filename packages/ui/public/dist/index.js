import { curve } from '@plantarium/helpers';

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function to_number(value) {
    return value === '' ? null : +value;
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
let SvelteElement;
if (typeof HTMLElement === 'function') {
    SvelteElement = class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            // @ts-ignore todo: improve typings
            for (const key in this.$$.slotted) {
                // @ts-ignore todo: improve typings
                this.appendChild(this.$$.slotted[key]);
            }
        }
        attributeChangedCallback(attr, _oldValue, newValue) {
            this[attr] = newValue;
        }
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            // TODO should this delegate to addEventListener?
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    };
}

/* packages/ui/src/InputSlider.svelte generated by Svelte v3.25.0 */

function create_fragment(ctx) {
	let div;
	let output;
	let t0;
	let output_style_value;
	let t1;
	let input;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			output = element("output");
			t0 = text(/*value*/ ctx[0]);
			t1 = space();
			input = element("input");
			this.c = noop;
			attr(output, "style", output_style_value = `left: ${(/*value*/ ctx[0] - /*min*/ ctx[1]) / Math.abs(/*min*/ ctx[1] - /*max*/ ctx[2]) * 90}%`);
			toggle_class(output, "isActive", /*isActive*/ ctx[4]);
			attr(input, "type", "range");
			attr(input, "min", /*min*/ ctx[1]);
			attr(input, "step", /*step*/ ctx[3]);
			attr(input, "max", /*max*/ ctx[2]);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, output);
			append(output, t0);
			append(div, t1);
			append(div, input);
			set_input_value(input, /*value*/ ctx[0]);

			if (!mounted) {
				dispose = [
					listen(input, "focus", /*focus_handler*/ ctx[6]),
					listen(input, "blur", /*blur_handler*/ ctx[7]),
					listen(input, "input", /*handleInput*/ ctx[5]),
					listen(input, "change", /*input_change_input_handler*/ ctx[8]),
					listen(input, "input", /*input_change_input_handler*/ ctx[8])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*value*/ 1) set_data(t0, /*value*/ ctx[0]);

			if (dirty & /*value, min, max*/ 7 && output_style_value !== (output_style_value = `left: ${(/*value*/ ctx[0] - /*min*/ ctx[1]) / Math.abs(/*min*/ ctx[1] - /*max*/ ctx[2]) * 90}%`)) {
				attr(output, "style", output_style_value);
			}

			if (dirty & /*isActive*/ 16) {
				toggle_class(output, "isActive", /*isActive*/ ctx[4]);
			}

			if (dirty & /*min*/ 2) {
				attr(input, "min", /*min*/ ctx[1]);
			}

			if (dirty & /*step*/ 8) {
				attr(input, "step", /*step*/ ctx[3]);
			}

			if (dirty & /*max*/ 4) {
				attr(input, "max", /*max*/ ctx[2]);
			}

			if (dirty & /*value*/ 1) {
				set_input_value(input, /*value*/ ctx[0]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { min = 0 } = $$props;
	let { max = 100 } = $$props;
	let { step = 1 } = $$props;
	let { value = 50 } = $$props;
	let isActive = false;

	function handleInput(e) {
		const event = new CustomEvent("change",
		{
				detail: parseFloat(value),
				bubbles: true,
				cancelable: true,
				composed: true, // makes the event jump shadow DOM boundary
				
			});

		this.dispatchEvent(event);
	}

	const focus_handler = () => $$invalidate(4, isActive = true);
	const blur_handler = () => $$invalidate(4, isActive = false);

	function input_change_input_handler() {
		value = to_number(this.value);
		$$invalidate(0, value);
	}

	$$self.$$set = $$props => {
		if ("min" in $$props) $$invalidate(1, min = $$props.min);
		if ("max" in $$props) $$invalidate(2, max = $$props.max);
		if ("step" in $$props) $$invalidate(3, step = $$props.step);
		if ("value" in $$props) $$invalidate(0, value = $$props.value);
	};

	return [
		value,
		min,
		max,
		step,
		isActive,
		handleInput,
		focus_handler,
		blur_handler,
		input_change_input_handler
	];
}

class InputSlider extends SvelteElement {
	constructor(options) {
		super();
		this.shadowRoot.innerHTML = `<style>div{position:relative;margin:0px;margin-bottom:12px;padding-top:6px}input[type='range']{position:absolute;-webkit-appearance:none;width:100%;background:transparent;margin:0}input[type='range']:focus{outline:none}input[type='range']::-webkit-slider-runnable-track{width:100%;height:2px;cursor:pointer;background:#4b4b4b;border-radius:1.4px}input[type='range']::-webkit-slider-thumb{height:8px;width:8px;border-radius:50px;background:#4b4b4b;cursor:pointer;-webkit-appearance:none;margin-top:-3.2px}input[type='range']:hover::-webkit-slider-thumb{box-shadow:0px 0px 5px rgba(0, 0, 0, 0.5)}input[type='range']:focus::-webkit-slider-runnable-track{background:#585858}input[type='range']::-moz-range-track{width:100%;height:2px;cursor:pointer;background:#4b4b4b;border-radius:1.4px;border:0px solid rgba(1, 1, 1, 0)}input[type='range']::-moz-range-thumb{height:8px;width:8px;border-radius:50px;background:#4b4b4b;cursor:pointer}input[type='range']::-ms-track{width:100%;height:2px;cursor:pointer;background:transparent;border-color:transparent;color:transparent}input[type='range']::-ms-fill-lower{background:#3e3e3e;border-radius:2.8px}input[type='range']::-ms-fill-upper{background:#4b4b4b;border-radius:2.8px}input[type='range']::-ms-thumb{height:8px;width:8px;border-radius:50px;background:#4b4b4b;cursor:pointer;height:2px}input[type='range']:focus::-ms-fill-lower{background:#4b4b4b}input[type='range']:focus::-ms-fill-upper{background:#585858}output{position:absolute;display:inline;pointer-events:none;font-size:0.7em;color:#cccccc;text-shadow:0px 0px 2px black;top:-1.2em;opacity:0;transform:translateY(5px);transition:transform 0.3s ease, opacity 0.3s ease}div:hover>output{transform:translateY(0px);opacity:1}</style>`;
		init(this, { target: this.shadowRoot }, instance, create_fragment, safe_not_equal, { min: 1, max: 2, step: 3, value: 0 });

		if (options) {
			if (options.target) {
				insert(options.target, this, options.anchor);
			}

			if (options.props) {
				this.$set(options.props);
				flush();
			}
		}
	}

	static get observedAttributes() {
		return ["min", "max", "step", "value"];
	}

	get min() {
		return this.$$.ctx[1];
	}

	set min(min) {
		this.$set({ min });
		flush();
	}

	get max() {
		return this.$$.ctx[2];
	}

	set max(max) {
		this.$set({ max });
		flush();
	}

	get step() {
		return this.$$.ctx[3];
	}

	set step(step) {
		this.$set({ step });
		flush();
	}

	get value() {
		return this.$$.ctx[0];
	}

	set value(value) {
		this.$set({ value });
		flush();
	}
}

customElements.define("plant-slider", InputSlider);

/* packages/ui/src/InputNumber.svelte generated by Svelte v3.25.0 */

function create_fragment$1(ctx) {
	let div;
	let button0;
	let t0;
	let input;
	let t1;
	let button1;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			button0 = element("button");
			t0 = space();
			input = element("input");
			t1 = space();
			button1 = element("button");
			this.c = noop;
			attr(input, "step", /*step*/ ctx[3]);
			attr(input, "max", /*max*/ ctx[2]);
			attr(input, "min", /*min*/ ctx[1]);
			attr(input, "type", "number");
			attr(button1, "class", "plus");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, button0);
			append(div, t0);
			append(div, input);
			/*input_binding*/ ctx[7](input);
			set_input_value(input, /*value*/ ctx[0]);
			append(div, t1);
			append(div, button1);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*click_handler*/ ctx[6]),
					listen(input, "input", /*input_input_handler*/ ctx[8]),
					listen(button1, "click", /*click_handler_1*/ ctx[9])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*step*/ 8) {
				attr(input, "step", /*step*/ ctx[3]);
			}

			if (dirty & /*max*/ 4) {
				attr(input, "max", /*max*/ ctx[2]);
			}

			if (dirty & /*min*/ 2) {
				attr(input, "min", /*min*/ ctx[1]);
			}

			if (dirty & /*value*/ 1 && to_number(input.value) !== /*value*/ ctx[0]) {
				set_input_value(input, /*value*/ ctx[0]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			/*input_binding*/ ctx[7](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { min = -Infinity } = $$props;
	let { max = Infinity } = $$props;
	let { step = 1 } = $$props;
	let { value = 0 } = $$props;
	let el;

	function handleChange(change) {
		$$invalidate(0, value = Math.max(min, Math.min(+value + change, max)));
	}

	function dispatchEvent() {
		// 1. Create the custom event.
		const event = new CustomEvent("change",
		{
				detail: parseFloat(value),
				bubbles: true,
				cancelable: true,
				composed: true
			});

		// 2. Dispatch the custom event.
		el && el.dispatchEvent(event);
	}

	const click_handler = () => handleChange(-step);

	function input_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			el = $$value;
			$$invalidate(4, el);
		});
	}

	function input_input_handler() {
		value = to_number(this.value);
		$$invalidate(0, value);
	}

	const click_handler_1 = () => handleChange(+step);

	$$self.$$set = $$props => {
		if ("min" in $$props) $$invalidate(1, min = $$props.min);
		if ("max" in $$props) $$invalidate(2, max = $$props.max);
		if ("step" in $$props) $$invalidate(3, step = $$props.step);
		if ("value" in $$props) $$invalidate(0, value = $$props.value);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*value*/ 1) {
			 value !== undefined && dispatchEvent();
		}
	};

	return [
		value,
		min,
		max,
		step,
		el,
		handleChange,
		click_handler,
		input_binding,
		input_input_handler,
		click_handler_1
	];
}

class InputNumber extends SvelteElement {
	constructor(options) {
		super();

		this.shadowRoot.innerHTML = `<style>input[type='number']{-webkit-appearance:textfield;-moz-appearance:textfield;appearance:textfield}input[type='number']::-webkit-inner-spin-button,input[type='number']::-webkit-outer-spin-button{-webkit-appearance:none}div{position:relative;width:100%;display:flex;background-color:#4b4b4b;border-radius:2px;font-family:'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, 'Oxygen-Sans', Ubuntu, Cantarell, 'Helvetica Neue', sans-serif}div,div *{box-sizing:border-box}div button{outline:none;background-color:transparent;border:none;width:10%;cursor:pointer;margin:0;margin:0 2%;position:relative}div button:before,div button:after{display:inline-block;position:absolute;content:'';width:80%;height:1.5px;background-color:white;border-radius:4px;transform:translate(-50%, -50%)}div button.plus:after{transform:translate(-50%, -50%) rotate(90deg)}div input[type='number']{color:white;background-color:transparent;padding:8%;width:72%;font-size:0.6em;font-weight:bold;text-align:center;border:none;border-style:none}</style>`;

		init(this, { target: this.shadowRoot }, instance$1, create_fragment$1, safe_not_equal, { min: 1, max: 2, step: 3, value: 0 });

		if (options) {
			if (options.target) {
				insert(options.target, this, options.anchor);
			}

			if (options.props) {
				this.$set(options.props);
				flush();
			}
		}
	}

	static get observedAttributes() {
		return ["min", "max", "step", "value"];
	}

	get min() {
		return this.$$.ctx[1];
	}

	set min(min) {
		this.$set({ min });
		flush();
	}

	get max() {
		return this.$$.ctx[2];
	}

	set max(max) {
		this.$set({ max });
		flush();
	}

	get step() {
		return this.$$.ctx[3];
	}

	set step(step) {
		this.$set({ step });
		flush();
	}

	get value() {
		return this.$$.ctx[0];
	}

	set value(value) {
		this.$set({ value });
		flush();
	}
}

customElements.define("plant-number", InputNumber);

/* packages/ui/src/InputSelect.svelte generated by Svelte v3.25.0 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	return child_ctx;
}

// (90:2) {:else}
function create_else_block(ctx) {
	let div;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			div.textContent = "none";
			attr(div, "id", "selected-value");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			if (!mounted) {
				dispose = listen(div, "click", /*handleOpen*/ ctx[4]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

// (88:2) {#if selectedValue !== undefined}
function create_if_block_1(ctx) {
	let div;
	let t;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			t = text(/*selectedValue*/ ctx[0]);
			attr(div, "id", "selected-value");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);

			if (!mounted) {
				dispose = listen(div, "click", /*handleOpen*/ ctx[4]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*selectedValue*/ 1) set_data(t, /*selectedValue*/ ctx[0]);
		},
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

// (94:2) {#if open}
function create_if_block(ctx) {
	let div;
	let each_value = /*items*/ ctx[3];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "id", "item-wrapper");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p(ctx, dirty) {
			if (dirty & /*items, selectedValue, setSelected*/ 41) {
				each_value = /*items*/ ctx[3];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
		}
	};
}

// (96:6) {#each items as item}
function create_each_block(ctx) {
	let p;
	let t0_value = /*item*/ ctx[11] + "";
	let t0;
	let t1;
	let p_style_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[8](/*item*/ ctx[11], ...args);
	}

	return {
		c() {
			p = element("p");
			t0 = text(t0_value);
			t1 = space();
			attr(p, "style", p_style_value = `opacity: ${/*item*/ ctx[11] === /*selectedValue*/ ctx[0] ? 0.5 : 1}`);
			attr(p, "class", "item");
		},
		m(target, anchor) {
			insert(target, p, anchor);
			append(p, t0);
			append(p, t1);

			if (!mounted) {
				dispose = listen(p, "click", click_handler);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*items*/ 8 && t0_value !== (t0_value = /*item*/ ctx[11] + "")) set_data(t0, t0_value);

			if (dirty & /*items, selectedValue*/ 9 && p_style_value !== (p_style_value = `opacity: ${/*item*/ ctx[11] === /*selectedValue*/ ctx[0] ? 0.5 : 1}`)) {
				attr(p, "style", p_style_value);
			}
		},
		d(detaching) {
			if (detaching) detach(p);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment$2(ctx) {
	let div;
	let t;

	function select_block_type(ctx, dirty) {
		if (/*selectedValue*/ ctx[0] !== undefined) return create_if_block_1;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);
	let if_block1 = /*open*/ ctx[1] && create_if_block(ctx);

	return {
		c() {
			div = element("div");
			if_block0.c();
			t = space();
			if (if_block1) if_block1.c();
			this.c = noop;
			attr(div, "id", "main");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			if_block0.m(div, null);
			append(div, t);
			if (if_block1) if_block1.m(div, null);
			/*div_binding*/ ctx[9](div);
		},
		p(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div, t);
				}
			}

			if (/*open*/ ctx[1]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block(ctx);
					if_block1.c();
					if_block1.m(div, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			if_block0.d();
			if (if_block1) if_block1.d();
			/*div_binding*/ ctx[9](null);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let selectedValue = undefined;
	let open = false;
	let main;

	function handleChange() {
		const event = new CustomEvent("change",
		{
				detail: selectedValue,
				bubbles: true,
				cancelable: true,
				composed: true, // makes the event jump shadow DOM boundary
				
			});

		main.dispatchEvent(event);
	}

	function handleOpen() {
		$$invalidate(1, open = true);

		setTimeout(
			() => {
				document.addEventListener(
					"click",
					() => {
						$$invalidate(1, open = false);
					},
					{ once: true }
				);
			},
			50
		);
	}

	function setSelected(value) {
		$$invalidate(0, selectedValue = value);
		$$invalidate(1, open = false);
	}

	let items = [];

	function setItems(_items) {
		$$invalidate(3, items = _items);
	}

	function setValue(v) {
		$$invalidate(0, selectedValue = v);
	}

	const click_handler = item => setSelected(item);

	function div_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			main = $$value;
			$$invalidate(2, main);
		});
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*selectedValue*/ 1) {
			 selectedValue && handleChange();
		}
	};

	return [
		selectedValue,
		open,
		main,
		items,
		handleOpen,
		setSelected,
		setItems,
		setValue,
		click_handler,
		div_binding
	];
}

class InputSelect extends SvelteElement {
	constructor(options) {
		super();
		this.shadowRoot.innerHTML = `<style>#main{background-color:#4b4b4b;color:white;border-radius:2px;position:relative;font-size:0.6em;padding:8%}#selected-value{padding:0px 2px}#item-wrapper{position:absolute;width:100%;background-color:#4b4b4b;border-radius:2px;overflow:hidden;top:0;z-index:99;left:0}.item{padding:8%;margin:0;background-color:#4b4b4b;cursor:pointer;transition:background-color 0.2s ease}.item:hover{background-color:#3d3d3d}</style>`;
		init(this, { target: this.shadowRoot }, instance$2, create_fragment$2, safe_not_equal, { setItems: 6, setValue: 7 });

		if (options) {
			if (options.target) {
				insert(options.target, this, options.anchor);
			}

			if (options.props) {
				this.$set(options.props);
				flush();
			}
		}
	}

	static get observedAttributes() {
		return ["setItems", "setValue"];
	}

	get setItems() {
		return this.$$.ctx[6];
	}

	get setValue() {
		return this.$$.ctx[7];
	}
}

customElements.define("plant-select", InputSelect);

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */

function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return x * x + y * y + z * z;
}
/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return x * x + y * y + z * z;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  let ax = a[0],
      ay = a[1],
      az = a[2];
  let bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */

function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4(out, a, m) {
  let x = a[0],
      y = a[1],
      z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Same as above but doesn't apply translation.
 * Useful for rays.
 */

function scaleRotateMat4(out, a, m) {
  let x = a[0],
      y = a[1],
      z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z) / w;
  return out;
}
/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */

function transformQuat(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  let x = a[0],
      y = a[1],
      z = a[2];
  let qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  let uvx = qy * z - qz * y;
  let uvy = qz * x - qx * z;
  let uvz = qx * y - qy * x;
  let uuvx = qy * uvz - qz * uvy;
  let uuvy = qz * uvx - qx * uvz;
  let uuvz = qx * uvy - qy * uvx;
  let w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */

const angle = function () {
  const tempA = [0, 0, 0];
  const tempB = [0, 0, 0];
  return function (a, b) {
    copy(tempA, a);
    copy(tempB, b);
    normalize(tempA, tempA);
    normalize(tempB, tempB);
    let cosine = dot(tempA, tempB);

    if (cosine > 1.0) {
      return 0;
    } else if (cosine < -1.0) {
      return Math.PI;
    } else {
      return Math.acos(cosine);
    }
  };
}();
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

const isArrayLike = term => {
  if (term.length) return true;
  return false;
};

class Vec3 extends Array {
  // TODO: only be used in Camera class
  constructor(x = 0, y = x, z = x) {
    super(x, y, z);
    this.constant = void 0;
    return this;
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  get z() {
    return this[2];
  }

  set x(v) {
    this[0] = v;
  }

  set y(v) {
    this[1] = v;
  }

  set z(v) {
    this[2] = v;
  }

  set(x, y = x, z = x) {
    if (isArrayLike(x)) return this.copy(x);
    set(this, x, y, z);
    return this;
  }

  copy(v) {
    copy(this, v);
    return this;
  }

  add(va, vb) {
    if (vb) add(this, va, vb);else add(this, this, va);
    return this;
  }

  sub(va, vb) {
    if (vb) subtract(this, va, vb);else subtract(this, this, va);
    return this;
  }

  multiply(v) {
    if (v.length) multiply(this, this, v);else scale(this, this, v);
    return this;
  }

  divide(v) {
    if (v.length) divide(this, this, v);else scale(this, this, 1 / v);
    return this;
  }

  inverse(v = this) {
    inverse(this, v);
    return this;
  } // Can't use 'length' as Array.prototype uses it


  len() {
    return length(this);
  }

  distance(v) {
    if (v) return distance(this, v);else return length(this);
  }

  squaredLen() {
    return squaredLength(this);
  }

  squaredDistance(v) {
    if (v) return squaredDistance(this, v);else return squaredLength(this);
  }

  negate(v = this) {
    negate(this, v);
    return this;
  }

  cross(va, vb) {
    if (vb) cross(this, va, vb);else cross(this, this, va);
    return this;
  }

  scale(v) {
    scale(this, this, v);
    return this;
  }

  normalize() {
    normalize(this, this);
    return this;
  }

  dot(v) {
    return dot(this, v);
  }

  equals(v) {
    return exactEquals(this, v);
  }

  applyMatrix4(mat4) {
    transformMat4(this, this, mat4);
    return this;
  }

  scaleRotateMatrix4(mat4) {
    scaleRotateMat4(this, this, mat4);
    return this;
  }

  applyQuaternion(q) {
    transformQuat(this, this, q);
    return this;
  }

  angle(v) {
    return angle(this, v);
  }

  lerp(v, t) {
    lerp(this, this, v, t);
    return this;
  }

  clone() {
    return new Vec3(this[0], this[1], this[2]);
  }

  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    return this;
  }

  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    return a;
  }

  transformDirection(mat4) {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    this[0] = mat4[0] * x + mat4[4] * y + mat4[8] * z;
    this[1] = mat4[1] * x + mat4[5] * y + mat4[9] * z;
    this[2] = mat4[2] * x + mat4[6] * y + mat4[10] * z;
    return this.normalize();
  }

}

// attribute params
const tempVec3 = new Vec3();

// Not automatic - devs to use these methods manually
// gl.colorMask( colorMask, colorMask, colorMask, colorMask );
// gl.clearColor( r, g, b, a );
// gl.stencilMask( stencilMask );
// gl.stencilFunc( stencilFunc, stencilRef, stencilMask );
// gl.stencilOp( stencilFail, stencilZFail, stencilZPass );
// gl.clearStencil( stencil );

const tempVec3$1 = new Vec3();

const EPSILON = 0.000001;
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */

function copy$1(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function set$1(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */

function invert(out, a) {
  let a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  let a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  let a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  let a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  let a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  let a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  let a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  let a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */

function multiply$1(out, a, b) {
  let a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  let a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  let a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  let a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  let b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  let x = v[0],
      y = v[1],
      z = v[2];
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale$1(out, a, v) {
  let x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate(out, a, rad, axis) {
  let x = axis[0],
      y = axis[1],
      z = axis[2];
  let len = Math.hypot(x, y, z);
  let s, c, t;
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;
  let b00, b01, b02;
  let b10, b11, b12;
  let b20, b21, b22;

  if (Math.abs(len) < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getScaling(out, mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
function getMaxScaleOnAxis(mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];
  const x = m11 * m11 + m12 * m12 + m13 * m13;
  const y = m21 * m21 + m22 * m22 + m23 * m23;
  const z = m31 * m31 + m32 * m32 + m33 * m33;
  return Math.sqrt(Math.max(x, y, z));
}
/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */

const getRotation = function () {
  const temp = [0, 0, 0];
  return function (out, mat) {
    let scaling = temp;
    getScaling(scaling, mat);
    let is1 = 1 / scaling[0];
    let is2 = 1 / scaling[1];
    let is3 = 1 / scaling[2];
    let sm11 = mat[0] * is1;
    let sm12 = mat[1] * is2;
    let sm13 = mat[2] * is3;
    let sm21 = mat[4] * is1;
    let sm22 = mat[5] * is2;
    let sm23 = mat[6] * is3;
    let sm31 = mat[8] * is1;
    let sm32 = mat[9] * is2;
    let sm33 = mat[10] * is3;
    let trace = sm11 + sm22 + sm33;
    let S = 0;

    if (trace > 0) {
      S = Math.sqrt(trace + 1.0) * 2;
      out[3] = 0.25 * S;
      out[0] = (sm23 - sm32) / S;
      out[1] = (sm31 - sm13) / S;
      out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S;
      out[0] = 0.25 * S;
      out[1] = (sm12 + sm21) / S;
      out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S;
      out[0] = (sm12 + sm21) / S;
      out[1] = 0.25 * S;
      out[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S;
      out[0] = (sm31 + sm13) / S;
      out[1] = (sm23 + sm32) / S;
      out[2] = 0.25 * S;
    }

    return out;
  };
}();
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */

function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  let x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  let sx = s[0];
  let sy = s[1];
  let sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */

function fromQuat(out, q) {
  let x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function perspective(out, fovy, aspect, near, far) {
  let f = 1.0 / Math.tan(fovy / 2);
  let nf = 1 / (near - far);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = 2 * far * near * nf;
  out[15] = 0;
  return out;
}
/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function ortho(out, left, right, bottom, top, near, far) {
  let lr = 1 / (left - right);
  let bt = 1 / (bottom - top);
  let nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} target Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */

function targetTo(out, eye, target, up) {
  let eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];
  let z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];
  let len = z0 * z0 + z1 * z1 + z2 * z2;

  if (len === 0) {
    // eye and target are in the same position
    z2 = 1;
  } else {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  let x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;

  if (len === 0) {
    // up and z are parallel
    if (upz) {
      upx += 1e-6;
    } else if (upy) {
      upz += 1e-6;
    } else {
      upy += 1e-6;
    }

    x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;
  }

  len = 1 / Math.sqrt(len);
  x0 *= len;
  x1 *= len;
  x2 *= len;
  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}

class Mat4 extends Array {
  constructor(m00 = 1, m01 = 0, m02 = 0, m03 = 0, m10 = 0, m11 = 1, m12 = 0, m13 = 0, m20 = 0, m21 = 0, m22 = 1, m23 = 0, m30 = 0, m31 = 0, m32 = 0, m33 = 1) {
    super(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
    return this;
  }

  get x() {
    return this[12];
  }

  get y() {
    return this[13];
  }

  get z() {
    return this[14];
  }

  get w() {
    return this[15];
  }

  set x(v) {
    this[12] = v;
  }

  set y(v) {
    this[13] = v;
  }

  set z(v) {
    this[14] = v;
  }

  set w(v) {
    this[15] = v;
  }

  set(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    if (m00.length) return this.copy(m00);
    set$1(this, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
    return this;
  }

  translate(v, m = this) {
    translate(this, m, v);
    return this;
  }

  rotate(v, axis, m = this) {
    rotate(this, m, v, axis);
    return this;
  }

  scale(v, m = this) {
    scale$1(this, m, typeof v === 'number' ? [v, v, v] : v);
    return this;
  }

  multiply(ma, mb) {
    if (mb) {
      multiply$1(this, ma, mb);
    } else {
      multiply$1(this, this, ma);
    }

    return this;
  }

  identity() {
    identity(this);
    return this;
  }

  copy(m) {
    copy$1(this, m);
    return this;
  }

  fromPerspective({
    fov,
    aspect,
    near,
    far
  } = {}) {
    perspective(this, fov, aspect, near, far);
    return this;
  }

  fromOrthogonal({
    left,
    right,
    bottom,
    top,
    near,
    far
  }) {
    ortho(this, left, right, bottom, top, near, far);
    return this;
  }

  fromQuaternion(q) {
    fromQuat(this, q);
    return this;
  }

  setPosition(v) {
    this.x = v[0];
    this.y = v[1];
    this.z = v[2];
    return this;
  }

  inverse(m = this) {
    invert(this, m);
    return this;
  }

  compose(q, pos, scale) {
    fromRotationTranslationScale(this, q, pos, scale);
    return this;
  }

  getRotation(q) {
    getRotation(q, this);
    return this;
  }

  getTranslation(pos) {
    getTranslation(pos, this);
    return this;
  }

  getScaling(scale) {
    getScaling(scale, this);
    return this;
  }

  getMaxScaleOnAxis() {
    return getMaxScaleOnAxis(this);
  }

  lookAt(eye, target, up) {
    targetTo(this, eye, target, up);
    return this;
  }

  determinant() {
    return determinant(this);
  }

  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    this[3] = a[o + 3];
    this[4] = a[o + 4];
    this[5] = a[o + 5];
    this[6] = a[o + 6];
    this[7] = a[o + 7];
    this[8] = a[o + 8];
    this[9] = a[o + 9];
    this[10] = a[o + 10];
    this[11] = a[o + 11];
    this[12] = a[o + 12];
    this[13] = a[o + 13];
    this[14] = a[o + 14];
    this[15] = a[o + 15];
    return this;
  }

  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    a[o + 3] = this[3];
    a[o + 4] = this[4];
    a[o + 5] = this[5];
    a[o + 6] = this[6];
    a[o + 7] = this[7];
    a[o + 8] = this[8];
    a[o + 9] = this[9];
    a[o + 10] = this[10];
    a[o + 11] = this[11];
    a[o + 12] = this[12];
    a[o + 13] = this[13];
    a[o + 14] = this[14];
    a[o + 15] = this[15];
    return a;
  }

}

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */

function copy$2(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */

function set$2(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */

function normalize$1(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  let len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot$1(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */

function identity$1(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/

function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  let s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Multiplies two quats
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */

function multiply$2(out, a, b) {
  let ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  let bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateX(out, a, rad) {
  rad *= 0.5;
  let ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  let bx = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateY(out, a, rad) {
  rad *= 0.5;
  let ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  let by = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateZ(out, a, rad) {
  rad *= 0.5;
  let ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  let bz = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */

function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  let ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  let bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  let omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients


  if (1.0 - cosom > 0.000001) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values


  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */

function invert$1(out, a) {
  let a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  let dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  let invDot = dot ? 1.0 / dot : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */

function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */

function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  let fTrace = m[0] + m[4] + m[8];
  let fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    let i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    let j = (i + 1) % 3;
    let k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} euler Angles to rotate around each axis in degrees.
 * @param {String} order detailing order of operations. Default 'XYZ'.
 * @returns {quat} out
 * @function
 */

function fromEuler(out, euler, order = 'YXZ') {
  let sx = Math.sin(euler[0] * 0.5);
  let cx = Math.cos(euler[0] * 0.5);
  let sy = Math.sin(euler[1] * 0.5);
  let cy = Math.cos(euler[1] * 0.5);
  let sz = Math.sin(euler[2] * 0.5);
  let cz = Math.cos(euler[2] * 0.5);

  if (order === 'XYZ') {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === 'YXZ') {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  } else if (order === 'ZXY') {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === 'ZYX') {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  } else if (order === 'YZX') {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === 'XZY') {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  }

  return out;
}
/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */

const copy$3 = copy$2;
/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */

const set$3 = set$2;
/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */

const dot$2 = dot$1;
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */

const normalize$2 = normalize$1;

class Quat extends Array {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    super(x, y, z, w);
    this.onChange = void 0;

    this.onChange = () => {};

    return this;
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  get z() {
    return this[2];
  }

  get w() {
    return this[3];
  }

  set x(v) {
    this[0] = v;
    this.onChange();
  }

  set y(v) {
    this[1] = v;
    this.onChange();
  }

  set z(v) {
    this[2] = v;
    this.onChange();
  }

  set w(v) {
    this[3] = v;
    this.onChange();
  }

  identity() {
    identity$1(this);
    this.onChange();
    return this;
  }

  set(x, y, z, w) {
    if (x.length) return this.copy(x);
    set$3(this, x, y, z, w);
    this.onChange();
    return this;
  }

  rotateX(a) {
    rotateX(this, this, a);
    this.onChange();
    return this;
  }

  rotateY(a) {
    rotateY(this, this, a);
    this.onChange();
    return this;
  }

  rotateZ(a) {
    rotateZ(this, this, a);
    this.onChange();
    return this;
  }

  inverse(q = this) {
    invert$1(this, q);
    this.onChange();
    return this;
  }

  conjugate(q = this) {
    conjugate(this, q);
    this.onChange();
    return this;
  }

  copy(q) {
    copy$3(this, q);
    this.onChange();
    return this;
  }

  normalize(q = this) {
    normalize$2(this, q);
    this.onChange();
    return this;
  }

  multiply(qA, qB) {
    if (qB) {
      multiply$2(this, qA, qB);
    } else {
      multiply$2(this, this, qA);
    }

    this.onChange();
    return this;
  }

  dot(v) {
    return dot$2(this, v);
  }

  fromMatrix3(matrix3) {
    fromMat3(this, matrix3);
    this.onChange();
    return this;
  }

  fromEuler(euler) {
    fromEuler(this, euler, euler.order);
    return this;
  }

  fromAxisAngle(axis, a) {
    setAxisAngle(this, axis, a);
    return this;
  }

  slerp(q, t) {
    slerp(this, this, q, t);
    return this;
  }

  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    this[3] = a[o + 3];
    return this;
  }

  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    a[o + 3] = this[3];
    return a;
  }

}

const tmpMat4 = new Mat4();

const tempMat4 = new Mat4();
const tempVec3a = new Vec3();
const tempVec3b = new Vec3();

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */

function copy$5(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */

function set$5(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */

function add$1(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */

function subtract$1(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */

function multiply$4(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
}
/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */

function divide$1(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
}
/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */

function scale$3(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}
/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */

function distance$1(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return Math.sqrt(x * x + y * y);
}
/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance$1(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return x * x + y * y;
}
/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */

function length$1(a) {
  var x = a[0],
      y = a[1];
  return Math.sqrt(x * x + y * y);
}
/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength$1(a) {
  var x = a[0],
      y = a[1];
  return x * x + y * y;
}
/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */

function negate$1(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
}
/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */

function inverse$1(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
}
/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */

function normalize$3(out, a) {
  var x = a[0],
      y = a[1];
  var len = x * x + y * y;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  return out;
}
/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot$3(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
/**
 * Computes the cross product of two vec2's
 * Note that the cross product returns a scalar
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} cross product of a and b
 */

function cross$1(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}
/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */

function lerp$1(out, a, b, t) {
  var ax = a[0],
      ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}
/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
}
/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat4$1(out, a, m) {
  let x = a[0];
  let y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}
/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals$1(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

class Vec2 extends Array {
  constructor(x = 0, y = x) {
    super(x, y);
    return this;
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  set x(v) {
    this[0] = v;
  }

  set y(v) {
    this[1] = v;
  }

  set(x, y = x) {
    if (x.length) return this.copy(x);
    set$5(this, x, y);
    return this;
  }

  copy(v) {
    copy$5(this, v);
    return this;
  }

  add(va, vb) {
    if (vb) add$1(this, va, vb);else add$1(this, this, va);
    return this;
  }

  sub(va, vb) {
    if (vb) subtract$1(this, va, vb);else subtract$1(this, this, va);
    return this;
  }

  multiply(v) {
    if (v.length) multiply$4(this, this, v);else scale$3(this, this, v);
    return this;
  }

  divide(v) {
    if (v.length) divide$1(this, this, v);else scale$3(this, this, 1 / v);
    return this;
  }

  inverse(v = this) {
    inverse$1(this, v);
    return this;
  } // Can't use 'length' as Array.prototype uses it


  len() {
    return length$1(this);
  }

  distance(v) {
    if (v) return distance$1(this, v);else return length$1(this);
  }

  squaredLen() {
    return this.squaredDistance();
  }

  squaredDistance(v) {
    if (v) return squaredDistance$1(this, v);else return squaredLength$1(this);
  }

  negate(v = this) {
    negate$1(this, v);
    return this;
  }

  cross(va, vb) {
    if (vb) return cross$1(va, vb);
    return cross$1(this, va);
  }

  scale(v) {
    scale$3(this, this, v);
    return this;
  }

  normalize() {
    normalize$3(this, this);
    return this;
  }

  dot(v) {
    return dot$3(this, v);
  }

  equals(v) {
    return exactEquals$1(this, v);
  }

  applyMatrix3(mat3) {
    transformMat3(this, this, mat3);
    return this;
  }

  applyMatrix4(mat4) {
    transformMat4$1(this, this, mat4);
    return this;
  }

  lerp(v, a) {
    lerp$1(this, this, v, a);
  }

  clone() {
    return new Vec2(this[0], this[1]);
  }

  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    return this;
  }

  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    return a;
  }

}
const tempVec3$2 = new Vec3();
const tempVec2a = new Vec2();
const tempVec2b = new Vec2();

// TODO: barycentric code shouldn't be here, but where?
const tempVec2a$1 = new Vec2();
const tempVec2b$1 = new Vec2();
const tempVec2c = new Vec2();
const tempVec3a$1 = new Vec3();
const tempVec3b$1 = new Vec3();
const tempVec3c = new Vec3();
const tempVec3d = new Vec3();
const tempVec3e = new Vec3();
const tempVec3f = new Vec3();
const tempVec3g = new Vec3();
const tempVec3h = new Vec3();
const tempVec3i = new Vec3();
const tempVec3j = new Vec3();
const tempVec3k = new Vec3();
const tempMat4$1 = new Mat4();

const _a0 = new Vec3(),
      _a1 = new Vec3(),
      _a2 = new Vec3(),
      _a3 = new Vec3();

const prevPos = new Vec3();
const prevRot = new Quat();
const prevScl = new Vec3();
const nextPos = new Vec3();
const nextRot = new Quat();
const nextScl = new Vec3();

const tempMat4$2 = new Mat4();

const tmp = new Vec3();

const tmpVec3A = new Vec3();
const tmpVec3B = new Vec3();
const tmpVec3C = new Vec3();
const tmpVec3D = new Vec3();
const tmpQuatA = new Quat();
const tmpQuatB = new Quat();
const tmpQuatC = new Quat();
const tmpQuatD = new Quat();

const tempMat4$3 = new Mat4();
const identity$3 = new Mat4();

/* packages/ui/src/InputCurve.svelte generated by Svelte v3.25.0 */

const { window: window_1 } = globals;

function create_fragment$3(ctx) {
	let div;
	let canvas_1;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			canvas_1 = element("canvas");
			this.c = noop;
			attr(canvas_1, "width", /*cWidth*/ ctx[3]);
			attr(canvas_1, "height", /*cHeight*/ ctx[4]);
			attr(div, "id", "main");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, canvas_1);
			/*canvas_1_binding*/ ctx[10](canvas_1);

			if (!mounted) {
				dispose = [
					listen(window_1, "mouseup", /*mouseup_handler*/ ctx[9]),
					listen(div, "mouseover", /*mouseover_handler*/ ctx[11]),
					listen(div, "mouseleave", /*mouseleave_handler*/ ctx[12]),
					listen(div, "mousemove", /*handleMouseMove*/ ctx[5]),
					listen(div, "mousedown", /*handleMouseDown*/ ctx[6])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*cWidth*/ 8) {
				attr(canvas_1, "width", /*cWidth*/ ctx[3]);
			}

			if (dirty & /*cHeight*/ 16) {
				attr(canvas_1, "height", /*cHeight*/ ctx[4]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			/*canvas_1_binding*/ ctx[10](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

const hoverDistance = 0.1;
const width = 200;
const height = 200;

function instance$3($$self, $$props, $$invalidate) {
	let { points = [{ x: 0, y: 1, locked: true }, { x: 1, y: 0, locked: true }] } = $$props;
	let canvas, ctx;
	let isHovered = false;
	let activePoint = undefined;
	const mousePos = new Vec2(0, 0);
	const mouseDownPos = new Vec2(0, 0);
	const pointDownPos = new Vec2(0, 0);
	let cWidth = width;
	let cHeight = height;

	const handleMouseMove = ev => {
		if (isHovered) {
			mousePos.x = ev.offsetX / width;
			mousePos.y = ev.offsetY / height;

			if (activePoint) {
				$$invalidate(2, activePoint.x = mousePos.x, activePoint);
				$$invalidate(2, activePoint.y = mousePos.y, activePoint);
			}
		}
	};

	const handleMouseDown = ev => {
		if (activePoint) {
			points.splice(points.indexOf(activePoint), 1);
		} else {
			const _points = points.map((p, i) => {
				return {
					i,
					d: Math.abs(p.x - mousePos.x) + Math.abs(p.y - mousePos.y)
				};
			}).sort((a, b) => {
				return a.d < b.d ? -1 : 1;
			});

			if (_points[0].d < hoverDistance && !points[_points[0].i].locked) {
				$$invalidate(2, activePoint = points[_points[0].i]);
				pointDownPos.x = activePoint.x;
				pointDownPos.y = activePoint.y;
				mouseDownPos.x = ev.offsetX / cWidth;
				mouseDownPos.y = (cHeight - ev.offsetY) / cHeight;
			} else {
				const point = {
					x: mousePos.x,
					y: mousePos.y,
					locked: false
				};

				$$invalidate(2, activePoint = point);
				pointDownPos.x = activePoint.x;
				pointDownPos.y = activePoint.y;
				mouseDownPos.x = ev.offsetX / cWidth;
				mouseDownPos.y = (cHeight - ev.offsetY) / cHeight;
				points.push(point);
			}
		}
	};

	function render() {
		ctx.clearRect(0, 0, cWidth, cHeight);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "white";
		ctx.fillStyle = "white";

		const absPoints = points.sort((a, b) => a.x > b.x ? 1 : -1).map(({ x, y, locked = false }) => {
			return { x: x * cWidth, y: y * cHeight, locked };
		});

		curve.drawCurve(ctx, absPoints);

		if (isHovered) {
			requestAnimationFrame(render);
			drawControlPoints(absPoints);
		}
	}

	const drawControlPoints = pts => pts.forEach((p, i) => {
		ctx.beginPath();
		const mouseDistance = Math.abs(points[i].x - mousePos.x) + Math.abs(points[i].y - mousePos.y);

		if (!p.locked) {
			if (mouseDistance < hoverDistance) {
				ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
				ctx.fillStyle = "white";
				ctx.fill();
			} else {
				ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
				ctx.fillStyle = "#4b4b4b";
				ctx.fill();
				ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
				ctx.lineWidth = 2;
				ctx.stroke();
			}
		}
	});

	onMount(() => {
		ctx = canvas.getContext("2d");
		const { devicePixelRatio } = window;

		if (devicePixelRatio) {
			$$invalidate(3, cWidth = width * devicePixelRatio);
			$$invalidate(4, cHeight = height * devicePixelRatio);
		}

		setTimeout(render, 50);
	});

	const mouseup_handler = () => {
		setTimeout(
			() => {
				$$invalidate(2, activePoint = undefined);
			},
			100
		);
	};

	function canvas_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			canvas = $$value;
			$$invalidate(0, canvas);
		});
	}

	const mouseover_handler = () => {
		$$invalidate(1, isHovered = true);
		render();
	};

	const mouseleave_handler = () => {
		$$invalidate(1, isHovered = false);
	};

	$$self.$$set = $$props => {
		if ("points" in $$props) $$invalidate(8, points = $$props.points);
	};

	return [
		canvas,
		isHovered,
		activePoint,
		cWidth,
		cHeight,
		handleMouseMove,
		handleMouseDown,
		render,
		points,
		mouseup_handler,
		canvas_1_binding,
		mouseover_handler,
		mouseleave_handler
	];
}

class InputCurve extends SvelteElement {
	constructor(options) {
		super();
		this.shadowRoot.innerHTML = `<style>#main{width:200px;height:200px;background-color:#4b4b4b;border-radius:2px;overflow:hidden}#main>canvas{width:100%}</style>`;
		init(this, { target: this.shadowRoot }, instance$3, create_fragment$3, safe_not_equal, { points: 8 });

		if (options) {
			if (options.target) {
				insert(options.target, this, options.anchor);
			}

			if (options.props) {
				this.$set(options.props);
				flush();
			}
		}
	}

	static get observedAttributes() {
		return ["points"];
	}

	get points() {
		return this.$$.ctx[8];
	}

	set points(points) {
		this.$set({ points });
		flush();
	}
}

customElements.define("plant-curve", InputCurve);

/* packages/ui/src/InputShape.svelte generated by Svelte v3.25.0 */

const { window: window_1$1 } = globals;

function create_fragment$4(ctx) {
	let div;
	let canvas_1;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			canvas_1 = element("canvas");
			this.c = noop;
			attr(canvas_1, "width", /*cWidth*/ ctx[3]);
			attr(canvas_1, "height", /*cHeight*/ ctx[4]);
			attr(div, "id", "main");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, canvas_1);
			/*canvas_1_binding*/ ctx[10](canvas_1);

			if (!mounted) {
				dispose = [
					listen(window_1$1, "mouseup", /*mouseup_handler*/ ctx[9]),
					listen(div, "mouseover", /*mouseover_handler*/ ctx[11]),
					listen(div, "mouseleave", /*mouseleave_handler*/ ctx[12]),
					listen(div, "mousemove", /*handleMouseMove*/ ctx[5]),
					listen(div, "mousedown", /*handleMouseDown*/ ctx[6])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*cWidth*/ 8) {
				attr(canvas_1, "width", /*cWidth*/ ctx[3]);
			}

			if (dirty & /*cHeight*/ 16) {
				attr(canvas_1, "height", /*cHeight*/ ctx[4]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			/*canvas_1_binding*/ ctx[10](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

const hoverDistance$1 = 0.1;
const width$1 = 200;
const height$1 = 200;

function instance$4($$self, $$props, $$invalidate) {
	let { points = [
		{ x: 0.5, y: 1, locked: true },
		{ x: 0.2, y: 0.6 },
		{ x: 0.2, y: 0.3 },
		{ x: 0.5, y: 0, locked: true }
	] } = $$props;

	let canvas, ctx;
	let isHovered = false;
	let activePoint = undefined;
	let gradient;
	const mousePos = new Vec2(0, 0);
	const mouseDownPos = new Vec2(0, 0);
	const pointDownPos = new Vec2(0, 0);
	let cWidth = width$1;
	let cHeight = height$1;

	const handleMouseMove = ev => {
		if (isHovered) {
			mousePos.x = ev.offsetX / width$1;
			mousePos.y = ev.offsetY / height$1;

			if (activePoint) {
				if (activePoint.locked) {
					$$invalidate(2, activePoint.x = Math.min(0.5, mousePos.x), activePoint);
				} else {
					$$invalidate(2, activePoint.x = Math.min(0.5, mousePos.x), activePoint);
					$$invalidate(2, activePoint.y = mousePos.y, activePoint);
				}
			}
		}
	};

	const handleMouseDown = ev => {
		if (activePoint) {
			points.splice(points.indexOf(activePoint), 1);
		} else {
			const _points = points.map((p, i) => {
				return {
					i,
					d: Math.abs(p.x - mousePos.x) + Math.abs(p.y - mousePos.y)
				};
			}).sort((a, b) => {
				return a.d < b.d ? -1 : 1;
			});

			if (_points[0].d < hoverDistance$1) {
				$$invalidate(2, activePoint = points[_points[0].i]);
				pointDownPos.x = activePoint.x;
				pointDownPos.y = activePoint.y;
				mouseDownPos.x = ev.offsetX / cWidth;
				mouseDownPos.y = (cHeight - ev.offsetY) / cHeight;
			} else {
				const point = {
					x: mousePos.x,
					y: mousePos.y,
					locked: false
				};

				$$invalidate(2, activePoint = point);
				pointDownPos.x = activePoint.x;
				pointDownPos.y = activePoint.y;
				mouseDownPos.x = ev.offsetX / cWidth;
				mouseDownPos.y = (cHeight - ev.offsetY) / cHeight;
				points.push(point);
			}
		}
	};

	function render() {
		ctx.clearRect(0, 0, cWidth, cHeight);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "white";
		ctx.fillStyle = "white";

		$$invalidate(8, points = points.sort(({ y: ay, x: ax }, { y: by, x: bx }) => {
			if (ay === by) {
				if (ay < 0.5) {
					return ax > bx ? 1 : -1;
				} else {
					return ax > bx ? -1 : 1;
				}
			}

			return ay > by ? 1 : -1;
		}));

		if (points[0].x !== 0.5) {
			delete points[0].locked;
			$$invalidate(8, points = [{ x: 0.5, y: 0, locked: true }, ...points]);
		}

		if (points[points.length - 1].x !== 0.5) {
			delete points[points.length - 1].locked;
			$$invalidate(8, points = [...points, { x: 0.5, y: 1, locked: true }]);
		}

		$$invalidate(8, points = points.sort(({ y: ay, x: ax }, { y: by, x: bx }) => {
			if (ay === by) {
				if (ay < 0.5) {
					return ax > bx ? -1 : 1;
				} else {
					return ax > bx ? 1 : -1;
				}
			}

			return ay > by ? 1 : -1;
		}));

		const absPoints = points.map(({ x, y, locked = false }) => {
			return { x: x * cWidth, y: y * cHeight, locked };
		});

		drawLines(absPoints);
		drawShape(absPoints);

		if (isHovered) {
			requestAnimationFrame(render);
			drawControlPoints(absPoints);
		}
	}

	function drawControlPoints(pts) {
		pts.forEach((p, i) => {
			ctx.beginPath();
			const mouseDistance = Math.abs(points[i].x - mousePos.x) + Math.abs(points[i].y - mousePos.y);

			if (mouseDistance < hoverDistance$1) {
				ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
				ctx.fillStyle = "white";
				ctx.fill();
			} else {
				ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
				ctx.fillStyle = "#4b4b4b";
				ctx.fill();
				ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
				ctx.lineWidth = 2;
				ctx.stroke();
			}
		});
	}

	function drawLines(pts) {
		ctx.beginPath();
		ctx.moveTo(pts[0].x, pts[0].y);

		pts.forEach((p, i) => {
			// Skip first point
			if (i === 0) return;

			ctx.lineTo(pts[i].x, pts[i].y);
		});

		ctx.closePath();
		ctx.stroke();
	}

	function drawShape(pts) {
		ctx.beginPath();
		ctx.moveTo(cWidth - pts[0].x, pts[0].y);

		pts.forEach((p, i) => {
			// Skip first point
			if (i === 0) return;

			ctx.lineTo(cWidth - pts[i].x, pts[i].y);
		});

		ctx.closePath();
		ctx.fillStyle = gradient;
		ctx.fill();
	}

	onMount(() => {
		ctx = canvas.getContext("2d");
		const { devicePixelRatio } = window;

		if (devicePixelRatio) {
			$$invalidate(3, cWidth = width$1 * devicePixelRatio);
			$$invalidate(4, cHeight = height$1 * devicePixelRatio);
		}

		gradient = ctx.createLinearGradient(0, 0, 0, cHeight);
		gradient.addColorStop(0, "#65e2a0");
		gradient.addColorStop(1, "#337150");
		setTimeout(render, 50);
	});

	const mouseup_handler = () => {
		setTimeout(
			() => {
				$$invalidate(2, activePoint = undefined);
			},
			100
		);
	};

	function canvas_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			canvas = $$value;
			$$invalidate(0, canvas);
		});
	}

	const mouseover_handler = () => {
		$$invalidate(1, isHovered = true);
		render();
	};

	const mouseleave_handler = () => {
		$$invalidate(1, isHovered = false);
	};

	$$self.$$set = $$props => {
		if ("points" in $$props) $$invalidate(8, points = $$props.points);
	};

	return [
		canvas,
		isHovered,
		activePoint,
		cWidth,
		cHeight,
		handleMouseMove,
		handleMouseDown,
		render,
		points,
		mouseup_handler,
		canvas_1_binding,
		mouseover_handler,
		mouseleave_handler
	];
}

class InputShape extends SvelteElement {
	constructor(options) {
		super();
		this.shadowRoot.innerHTML = `<style>#main{width:200px;height:200px;background-color:#4b4b4b;border-radius:2px;overflow:hidden}#main>canvas{width:100%}</style>`;
		init(this, { target: this.shadowRoot }, instance$4, create_fragment$4, safe_not_equal, { points: 8 });

		if (options) {
			if (options.target) {
				insert(options.target, this, options.anchor);
			}

			if (options.props) {
				this.$set(options.props);
				flush();
			}
		}
	}

	static get observedAttributes() {
		return ["points"];
	}

	get points() {
		return this.$$.ctx[8];
	}

	set points(points) {
		this.$set({ points });
		flush();
	}
}

customElements.define("plant-shape", InputShape);

/* packages/ui/src/InputCheckbox.svelte generated by Svelte v3.25.0 */

function create_fragment$5(ctx) {
	let div;

	return {
		c() {
			div = element("div");

			div.innerHTML = `<input type="checkbox"/> 

  <label class="checkbox-label" for="checkbox-id-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>cross</title><line vector-effect="non-scaling-stroke" class="b0ff5687-6367-498c-a1f2-615cbbb6ed44" x1="27.84" y1="74.16" x2="72.16" y2="29.84"></line><line vector-effect="non-scaling-stroke" class="b0ff5687-6367-498c-a1f2-615cbbb6ed44" x1="27.84" y1="29.99" x2="72.16" y2="74.01"></line></svg></label>`;

			this.c = noop;
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function instance$5($$self, $$props, $$invalidate) {
	let { value = false } = $$props;

	function dispatchEvent() {
		// 1. Create the custom event.
		const event = new CustomEvent("change",
		{
				detail: !!value,
				bubbles: true,
				cancelable: true,
				composed: true
			});
	}

	$$self.$$set = $$props => {
		if ("value" in $$props) $$invalidate(0, value = $$props.value);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*value*/ 1) {
			 value !== undefined && dispatchEvent();
		}
	};

	return [value];
}

class InputCheckbox extends SvelteElement {
	constructor(options) {
		super();

		this.shadowRoot.innerHTML = `<style>input[type='checkbox']{visibility:hidden;position:absolute}div{position:relative;width:100%;display:flex;background-color:#4b4b4b;border-radius:2px;font-family:'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, 'Oxygen-Sans', Ubuntu, Cantarell, 'Helvetica Neue', sans-serif}div,div *{box-sizing:border-box}</style>`;

		init(this, { target: this.shadowRoot }, instance$5, create_fragment$5, safe_not_equal, { value: 0 });

		if (options) {
			if (options.target) {
				insert(options.target, this, options.anchor);
			}

			if (options.props) {
				this.$set(options.props);
				flush();
			}
		}
	}

	static get observedAttributes() {
		return ["value"];
	}

	get value() {
		return this.$$.ctx[0];
	}

	set value(value) {
		this.$set({ value });
		flush();
	}
}

customElements.define("plant-checkbox", InputCheckbox);

// *****************************************
// * Notice that the component is not instantiated and mounted to the document <body className="">
// * Since the compiler is creating a custom element, we instead define and use the custom element
// * in the index.html file to simulate the end-user experience.
// ******************************************
function stateToElement(target, template, value) {
    var _a;
    if (value === undefined && 'defaultValue' in template) {
        value = (_a = template.defaultValue) !== null && _a !== void 0 ? _a : 0;
    }
    if (template.inputType === 'select' || Array.isArray(template.values)) {
        var element = new InputSelect({ target: target });
        element.setItems(template.values);
        element.setValue(+value || value || template.values[0]);
        return element;
    }
    if (template.inputType === 'slider' || template.step) {
        var element = new InputSlider({ target: target });
        if ('max' in template)
            element.setAttribute('max', template.max);
        if ('min' in template)
            element.setAttribute('min', template.min);
        if ('step' in template)
            element.setAttribute('step', template.step);
        element.setAttribute('value', value || template.value);
        return element;
    }
    if (template.inputType === 'curve') {
        var element = new InputCurve({ target: target });
        if ('points' in template)
            element.setAttribute('points', template.points);
        return element;
    }
    if (template.inputType === 'shape') {
        var element = new InputShape({ target: target });
        if ('points' in template)
            element.setAttribute('points', template.points);
        return element;
    }
    if (template.type === 'number' || typeof value === 'number') {
        var element = new InputNumber({ target: target });
        if ('max' in template)
            element.setAttribute('max', template.max);
        if ('min' in template)
            element.setAttribute('min', template.min);
        if ('step' in template)
            element.setAttribute('step', template.step);
        element.setAttribute('value', value);
        return element;
    }
    if (template.type === 'checkbox' || typeof value === 'boolean') {
        var element = new InputCheckbox({ target: target });
        element.setAttribute('value', value);
        return element;
    }
}

export { InputCurve, InputNumber, InputSelect, InputShape, InputSlider, stateToElement };
//# sourceMappingURL=index.js.map
