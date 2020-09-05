
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
function noop() { }
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
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
    return value === '' ? undefined : +value;
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_input_value(input, value) {
    if (value != null || input.value) {
        input.value = value;
    }
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
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
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
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
        dirty
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if ($$.bound[i])
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
        $set() {
            // overridden by instance, if it has props
        }
    };
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.2' }, detail)));
}
function append_dev(target, node) {
    dispatch_dev("SvelteDOMInsert", { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev("SvelteDOMInsert", { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev("SvelteDOMRemove", { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
    else
        dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.data === data)
        return;
    dispatch_dev("SvelteDOMSetData", { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}

/* src/InputSlider.svelte generated by Svelte v3.22.2 */
const file = "src/InputSlider.svelte";

function create_fragment(ctx) {
	let div;
	let output;
	let t0;
	let output_style_value;
	let t1;
	let input;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			output = element("output");
			t0 = text(/*value*/ ctx[0]);
			t1 = space();
			input = element("input");
			this.c = noop;
			attr_dev(output, "style", output_style_value = `left: ${(/*value*/ ctx[0] - /*min*/ ctx[1]) / Math.abs(/*min*/ ctx[1] - /*max*/ ctx[2]) * 90}%`);
			toggle_class(output, "isActive", /*isActive*/ ctx[4]);
			add_location(output, file, 136, 2, 2968);
			attr_dev(input, "type", "range");
			attr_dev(input, "min", /*min*/ ctx[1]);
			attr_dev(input, "step", /*step*/ ctx[3]);
			attr_dev(input, "max", /*max*/ ctx[2]);
			add_location(input, file, 142, 2, 3090);
			attr_dev(div, "role", "range");
			add_location(div, file, 135, 0, 2947);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, div, anchor);
			append_dev(div, output);
			append_dev(output, t0);
			append_dev(div, t1);
			append_dev(div, input);
			set_input_value(input, /*value*/ ctx[0]);
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(input, "focus", /*focus_handler*/ ctx[7], false, false, false),
				listen_dev(input, "blur", /*blur_handler*/ ctx[8], false, false, false),
				listen_dev(input, "input", /*handleInput*/ ctx[5], false, false, false),
				listen_dev(input, "change", /*input_change_input_handler*/ ctx[9]),
				listen_dev(input, "input", /*input_change_input_handler*/ ctx[9])
			];
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*value*/ 1) set_data_dev(t0, /*value*/ ctx[0]);

			if (dirty & /*value, min, max*/ 7 && output_style_value !== (output_style_value = `left: ${(/*value*/ ctx[0] - /*min*/ ctx[1]) / Math.abs(/*min*/ ctx[1] - /*max*/ ctx[2]) * 90}%`)) {
				attr_dev(output, "style", output_style_value);
			}

			if (dirty & /*isActive*/ 16) {
				toggle_class(output, "isActive", /*isActive*/ ctx[4]);
			}

			if (dirty & /*min*/ 2) {
				attr_dev(input, "min", /*min*/ ctx[1]);
			}

			if (dirty & /*step*/ 8) {
				attr_dev(input, "step", /*step*/ ctx[3]);
			}

			if (dirty & /*max*/ 4) {
				attr_dev(input, "max", /*max*/ ctx[2]);
			}

			if (dirty & /*value*/ 1) {
				set_input_value(input, /*value*/ ctx[0]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { min = 0 } = $$props;
	let { max = 100 } = $$props;
	let { step = 1 } = $$props;
	let { value = 50 } = $$props;
	let isActive = false;
	let timeout;

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

	const writable_props = ["min", "max", "step", "value"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<plant-slider> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("plant-slider", $$slots, []);
	const focus_handler = () => $$invalidate(4, isActive = true);
	const blur_handler = () => $$invalidate(4, isActive = false);

	function input_change_input_handler() {
		value = to_number(this.value);
		$$invalidate(0, value);
	}

	$$self.$set = $$props => {
		if ("min" in $$props) $$invalidate(1, min = $$props.min);
		if ("max" in $$props) $$invalidate(2, max = $$props.max);
		if ("step" in $$props) $$invalidate(3, step = $$props.step);
		if ("value" in $$props) $$invalidate(0, value = $$props.value);
	};

	$$self.$capture_state = () => ({
		space,
		min,
		max,
		step,
		value,
		isActive,
		timeout,
		handleInput
	});

	$$self.$inject_state = $$props => {
		if ("min" in $$props) $$invalidate(1, min = $$props.min);
		if ("max" in $$props) $$invalidate(2, max = $$props.max);
		if ("step" in $$props) $$invalidate(3, step = $$props.step);
		if ("value" in $$props) $$invalidate(0, value = $$props.value);
		if ("isActive" in $$props) $$invalidate(4, isActive = $$props.isActive);
		if ("timeout" in $$props) timeout = $$props.timeout;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		value,
		min,
		max,
		step,
		isActive,
		handleInput,
		timeout,
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
				insert_dev(options.target, this, options.anchor);
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

/* src/InputNumber.svelte generated by Svelte v3.22.2 */
const file$1 = "src/InputNumber.svelte";

function create_fragment$1(ctx) {
	let div;
	let button0;
	let t0;
	let input;
	let t1;
	let button1;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			button0 = element("button");
			t0 = space();
			input = element("input");
			t1 = space();
			button1 = element("button");
			this.c = noop;
			add_location(button0, file$1, 110, 2, 2335);
			attr_dev(input, "step", /*step*/ ctx[3]);
			attr_dev(input, "max", /*max*/ ctx[2]);
			attr_dev(input, "min", /*min*/ ctx[1]);
			attr_dev(input, "type", "number");
			add_location(input, file$1, 112, 2, 2386);
			attr_dev(button1, "class", "plus");
			add_location(button1, file$1, 114, 2, 2458);
			add_location(div, file$1, 109, 0, 2327);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, div, anchor);
			append_dev(div, button0);
			append_dev(div, t0);
			append_dev(div, input);
			/*input_binding*/ ctx[9](input);
			set_input_value(input, /*value*/ ctx[0]);
			append_dev(div, t1);
			append_dev(div, button1);
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(button0, "click", /*click_handler*/ ctx[8], false, false, false),
				listen_dev(input, "input", /*input_input_handler*/ ctx[10]),
				listen_dev(button1, "click", /*click_handler_1*/ ctx[11], false, false, false)
			];
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*step*/ 8) {
				attr_dev(input, "step", /*step*/ ctx[3]);
			}

			if (dirty & /*max*/ 4) {
				attr_dev(input, "max", /*max*/ ctx[2]);
			}

			if (dirty & /*min*/ 2) {
				attr_dev(input, "min", /*min*/ ctx[1]);
			}

			if (dirty & /*value*/ 1 && to_number(input.value) !== /*value*/ ctx[0]) {
				set_input_value(input, /*value*/ ctx[0]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			/*input_binding*/ ctx[9](null);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function strip(number) {
	return parseFloat(number).toPrecision(4);
}

function instance$1($$self, $$props, $$invalidate) {
	const dispatch = createEventDispatcher();
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

	const writable_props = ["min", "max", "step", "value"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<plant-number> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("plant-number", $$slots, []);
	const click_handler = () => handleChange(-step);

	function input_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(4, el = $$value);
		});
	}

	function input_input_handler() {
		value = to_number(this.value);
		$$invalidate(0, value);
	}

	const click_handler_1 = () => handleChange(+step);

	$$self.$set = $$props => {
		if ("min" in $$props) $$invalidate(1, min = $$props.min);
		if ("max" in $$props) $$invalidate(2, max = $$props.max);
		if ("step" in $$props) $$invalidate(3, step = $$props.step);
		if ("value" in $$props) $$invalidate(0, value = $$props.value);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher,
		dispatch,
		min,
		max,
		step,
		value,
		el,
		handleChange,
		strip,
		dispatchEvent
	});

	$$self.$inject_state = $$props => {
		if ("min" in $$props) $$invalidate(1, min = $$props.min);
		if ("max" in $$props) $$invalidate(2, max = $$props.max);
		if ("step" in $$props) $$invalidate(3, step = $$props.step);
		if ("value" in $$props) $$invalidate(0, value = $$props.value);
		if ("el" in $$props) $$invalidate(4, el = $$props.el);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

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
		dispatch,
		dispatchEvent,
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
				insert_dev(options.target, this, options.anchor);
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

/* src/InputSelect.svelte generated by Svelte v3.22.2 */
const file$2 = "src/InputSelect.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i];
	return child_ctx;
}

// (94:2) {:else}
function create_else_block(ctx) {
	let div;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = "none";
			attr_dev(div, "id", "selected-value");
			add_location(div, file$2, 94, 4, 1719);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, div, anchor);
			if (remount) dispose();
			dispose = listen_dev(div, "click", /*handleOpen*/ ctx[4], false, false, false);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(94:2) {:else}",
		ctx
	});

	return block;
}

// (92:2) {#if selectedValue !== undefined}
function create_if_block_1(ctx) {
	let div;
	let t;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			t = text(/*selectedValue*/ ctx[0]);
			attr_dev(div, "id", "selected-value");
			add_location(div, file$2, 92, 4, 1636);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
			if (remount) dispose();
			dispose = listen_dev(div, "click", /*handleOpen*/ ctx[4], false, false, false);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*selectedValue*/ 1) set_data_dev(t, /*selectedValue*/ ctx[0]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(92:2) {#if selectedValue !== undefined}",
		ctx
	});

	return block;
}

// (98:2) {#if open}
function create_if_block(ctx) {
	let div;
	let each_value = /*items*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "id", "item-wrapper");
			add_location(div, file$2, 98, 4, 1803);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*items, selectedValue, setSelected*/ 41) {
				each_value = /*items*/ ctx[3];
				validate_each_argument(each_value);
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
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(98:2) {#if open}",
		ctx
	});

	return block;
}

// (100:6) {#each items as item}
function create_each_block(ctx) {
	let p;
	let t0_value = /*item*/ ctx[12] + "";
	let t0;
	let t1;
	let p_style_value;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[10](/*item*/ ctx[12], ...args);
	}

	const block = {
		c: function create() {
			p = element("p");
			t0 = text(t0_value);
			t1 = space();
			attr_dev(p, "style", p_style_value = `opacity: ${/*item*/ ctx[12] === /*selectedValue*/ ctx[0] ? 0.5 : 1}`);
			attr_dev(p, "class", "item");
			add_location(p, file$2, 100, 8, 1863);
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, p, anchor);
			append_dev(p, t0);
			append_dev(p, t1);
			if (remount) dispose();
			dispose = listen_dev(p, "click", click_handler, false, false, false);
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*items*/ 8 && t0_value !== (t0_value = /*item*/ ctx[12] + "")) set_data_dev(t0, t0_value);

			if (dirty & /*items, selectedValue*/ 9 && p_style_value !== (p_style_value = `opacity: ${/*item*/ ctx[12] === /*selectedValue*/ ctx[0] ? 0.5 : 1}`)) {
				attr_dev(p, "style", p_style_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(p);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(100:6) {#each items as item}",
		ctx
	});

	return block;
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

	const block = {
		c: function create() {
			div = element("div");
			if_block0.c();
			t = space();
			if (if_block1) if_block1.c();
			this.c = noop;
			attr_dev(div, "id", "main");
			add_location(div, file$2, 89, 0, 1562);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if_block0.m(div, null);
			append_dev(div, t);
			if (if_block1) if_block1.m(div, null);
			/*div_binding*/ ctx[11](div);
		},
		p: function update(ctx, [dirty]) {
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
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_block0.d();
			if (if_block1) if_block1.d();
			/*div_binding*/ ctx[11](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$2($$self, $$props, $$invalidate) {
	const dispatch = createEventDispatcher();
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

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<plant-select> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("plant-select", $$slots, []);
	const click_handler = item => setSelected(item);

	function div_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(2, main = $$value);
		});
	}

	$$self.$capture_state = () => ({
		createEventDispatcher,
		dispatch,
		selectedValue,
		open,
		main,
		handleChange,
		handleOpen,
		setSelected,
		items,
		setItems,
		setValue
	});

	$$self.$inject_state = $$props => {
		if ("selectedValue" in $$props) $$invalidate(0, selectedValue = $$props.selectedValue);
		if ("open" in $$props) $$invalidate(1, open = $$props.open);
		if ("main" in $$props) $$invalidate(2, main = $$props.main);
		if ("items" in $$props) $$invalidate(3, items = $$props.items);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
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
		dispatch,
		handleChange,
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
				insert_dev(options.target, this, options.anchor);
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

	set setItems(value) {
		throw new Error("<plant-select>: Cannot set read-only property 'setItems'");
	}

	get setValue() {
		return this.$$.ctx[7];
	}

	set setValue(value) {
		throw new Error("<plant-select>: Cannot set read-only property 'setValue'");
	}
}

customElements.define("plant-select", InputSelect);

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
function copy(out, a) {
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
function set(out, x, y) {
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
function add(out, a, b) {
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
function subtract(out, a, b) {
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
function multiply(out, a, b) {
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
function divide(out, a, b) {
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
function scale(out, a, b) {
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
function distance(a, b) {
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
function squaredDistance(a, b) {
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
function length(a) {
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
function squaredLength(a) {
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
function negate(out, a) {
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
function inverse(out, a) {
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
function normalize(out, a) {
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
function dot(a, b) {
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
function cross(a, b) {
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
function lerp(out, a, b, t) {
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
function transformMat4(out, a, m) {
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
function exactEquals(a, b) {
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
        set(this, x, y);
        return this;
    }

    copy(v) {
        copy(this, v);
        return this;
    }

    add(va, vb) {
        if (vb) add(this, va, vb);
        else add(this, this, va);
        return this;
    }

    sub(va, vb) {
        if (vb) subtract(this, va, vb);
        else subtract(this, this, va);
        return this;
    }

    multiply(v) {
        if (v.length) multiply(this, this, v);
        else scale(this, this, v);
        return this;
    }

    divide(v) {
        if (v.length) divide(this, this, v);
        else scale(this, this, 1 / v);
        return this;
    }

    inverse(v = this) {
        inverse(this, v);
        return this;
    }

    // Can't use 'length' as Array.prototype uses it
    len() {
        return length(this);
    }

    distance(v) {
        if (v) return distance(this, v);
        else return length(this);
    }

    squaredLen() {
        return this.squaredDistance();
    }

    squaredDistance(v) {
        if (v) return squaredDistance(this, v);
        else return squaredLength(this);
    }

    negate(v = this) {
        negate(this, v);
        return this;
    }

    cross(va, vb) {
        if (vb) return cross(va, vb);
        return cross(this, va);
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

    applyMatrix3(mat3) {
        transformMat3(this, this, mat3);
        return this;
    }

    applyMatrix4(mat4) {
        transformMat4(this, this, mat4);
        return this;
    }

    lerp(v, a) {
        lerp(this, this, v, a);
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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var FileSaver_min = createCommonjsModule(function (module, exports) {
(function(a,b){b();})(commonjsGlobal,function(){function b(a,b){return "undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(b,c,d){var e=new XMLHttpRequest;e.open("GET",b),e.responseType="blob",e.onload=function(){a(e.response,c,d);},e.onerror=function(){console.error("could not download file");},e.send();}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send();}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"));}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b);}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof commonjsGlobal&&commonjsGlobal.global===commonjsGlobal?commonjsGlobal:void 0,a=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href);},4E4),setTimeout(function(){e(j);},0));}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else {var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i);});}}:function(a,b,d,e){if(e=e||open("","_blank"),e&&(e.document.title=e.document.body.innerText="downloading..."),"string"==typeof a)return c(a,b,d);var g="application/octet-stream"===a.type,h=/constructor/i.test(f.HTMLElement)||f.safari,i=/CriOS\/[\d]+/.test(navigator.userAgent);if((i||g&&h)&&"object"==typeof FileReader){var j=new FileReader;j.onloadend=function(){var a=j.result;a=i?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),e?e.location.href=a:location=a,e=null;},j.readAsDataURL(a);}else {var k=f.URL||f.webkitURL,l=k.createObjectURL(a);e?e.location=l:location.href=l,e=null,setTimeout(function(){k.revokeObjectURL(l);},4E4);}});f.saveAs=a.saveAs=a,(module.exports=a);});

//# sourceMappingURL=FileSaver.min.js.map
});

function A(t){var e=t.length-1;return t.map(function(t,r,i){if(0===r)return {rx:.4*i[r+1].x*0,ry:t.y+.4*(i[r+1].y-t.y)*0};if(r===e)return {lx:i[r-1].x+.4*(t.x-i[r-1].x)*2,ly:i[r-1].y+.4*(t.y-i[r-1].y)*2};if(t.y>i[r+1].y&&t.y>i[r-1].y||t.y<i[r+1].y&&t.y<i[r-1].y)return {lx:i[r-1].x+.4*(t.x-i[r-1].x),ly:t.y,rx:t.x+.4*(i[r+1].x-t.x),ry:t.y};var n={x:i[r-1].x-i[r+1].x,y:i[r-1].y-i[r+1].y},s=Math.sqrt(Math.pow(n.x,2)+Math.pow(n.y,2));n.x/=s,n.y/=s;var a=i[r+1].x-t.x,o=t.x-i[r-1].x;return {lx:t.x+n.x*o*.4,ly:t.y+n.y*o*.4,rx:t.x-n.x*a*.4,ry:t.y-n.y*a*.4}})}function b(t){var e=t.length-1,r={},i=A(t);return t.map(function(t,r,n){return r<e?function(t,e,r,i,n,s,a,o,h,l){for(var u,c,g=n-r,f=a-n,d=h-a,p=s-i,m=o-s,v=l-o,y=-1e4,E=-1e4,x=[{x:r,y:i}],T=1;T<t;T++){var A=T/t,b=r+g*A,w=n+f*A;u=i+p*A;var S=(b+=(w-b)*A)+((w+=(a+d*A-w)*A)-b)*A,_=(u+=((c=s+m*A)-u)*A)+((c+=(o+v*A-c)*A)-u)*A,F=S-y,P=_-E;F*F+P*P>0&&(x.push({x:S,y:_}),y=S,E=_);}return x.push({x:h,y:l}),x}(20*e,0,t.x,t.y,i[r].rx,i[r].ry,i[r+1].lx,i[r+1].ly,n[r+1].x,n[r+1].y):void 0}).flat().filter(function(t){return !!t&&!(t.x in r)&&(r[t.x]=!0,!0)})}var w={__proto__:null,computeControlPoints:A,drawLinear:function(t,e){t.save(),t.beginPath(),e.forEach(function(e,r,i){r<i.length-1&&(t.strokeStyle="gray",t.moveTo(e.x,e.y),t.lineTo(i[r+1].x,i[r+1].y));}),t.stroke(),t.restore();},drawControlPoints:function(t,e){A(e).forEach(function(r,i){"rx"in r&&"ry"in r&&(t.fillRect(r.rx-1,r.ry-1,2,2),t.beginPath(),t.moveTo(e[i].x,e[i].y),t.lineTo(r.rx,r.ry),t.stroke()),"lx"in r&&"ly"in r&&(t.fillRect(r.lx-1,r.ly-1,2,2),t.beginPath(),t.moveTo(e[i].x,e[i].y),t.lineTo(r.lx,r.ly),t.stroke());});},drawCurve:function(t,e){var r=A(e);e.forEach(function(e,i,n){i<n.length-1&&(t.moveTo(e.x,e.y),t.bezierCurveTo(r[i].rx,r[i].ry,r[i+1].lx,r[i+1].ly,n[i+1].x,n[i+1].y),t.stroke());});},toArray:b,drawSamplePoints:function(t,e){t.save(),t.fillStyle="red",b(e).forEach(function(e){t.fillRect(e.x-1,e.y-1,2,2);}),t.restore();}};//# sourceMappingURL=index.mjs.map

/* src/InputCurve.svelte generated by Svelte v3.22.2 */

const { window: window_1 } = globals;
const file$3 = "src/InputCurve.svelte";

function create_fragment$3(ctx) {
	let div;
	let canvas_1;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			canvas_1 = element("canvas");
			this.c = noop;
			attr_dev(canvas_1, "width", /*cWidth*/ ctx[3]);
			attr_dev(canvas_1, "height", /*cHeight*/ ctx[4]);
			add_location(canvas_1, file$3, 171, 2, 3816);
			attr_dev(div, "id", "main");
			add_location(div, file$3, 159, 0, 3611);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, div, anchor);
			append_dev(div, canvas_1);
			/*canvas_1_binding*/ ctx[16](canvas_1);
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(window_1, "mouseup", /*mouseup_handler*/ ctx[15], false, false, false),
				listen_dev(div, "mouseover", /*mouseover_handler*/ ctx[17], false, false, false),
				listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[18], false, false, false),
				listen_dev(div, "mousemove", /*handleMouseMove*/ ctx[5], false, false, false),
				listen_dev(div, "mousedown", /*handleMouseDown*/ ctx[6], false, false, false)
			];
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*cWidth*/ 8) {
				attr_dev(canvas_1, "width", /*cWidth*/ ctx[3]);
			}

			if (dirty & /*cHeight*/ 16) {
				attr_dev(canvas_1, "height", /*cHeight*/ ctx[4]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			/*canvas_1_binding*/ ctx[16](null);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const hoverDistance = 0.1;
const tension = 0.4;
const width = 200;
const height = 200;

function instance$3($$self, $$props, $$invalidate) {
	let { points = [{ x: 0, y: 1, locked: true }, { x: 1, y: 0, locked: true }] } = $$props;
	let canvas, ctx;
	let isHovered = false;
	let isRendering = false;
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

		w.drawCurve(ctx, absPoints);

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

	const writable_props = ["points"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<plant-curve> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("plant-curve", $$slots, []);

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
			$$invalidate(0, canvas = $$value);
		});
	}

	const mouseover_handler = () => {
		$$invalidate(1, isHovered = true);
		render();
	};

	const mouseleave_handler = () => {
		$$invalidate(1, isHovered = false);
	};

	$$self.$set = $$props => {
		if ("points" in $$props) $$invalidate(8, points = $$props.points);
	};

	$$self.$capture_state = () => ({
		onMount,
		Vec2,
		curve: w,
		points,
		canvas,
		ctx,
		hoverDistance,
		tension,
		isHovered,
		isRendering,
		activePoint,
		mousePos,
		mouseDownPos,
		pointDownPos,
		width,
		height,
		cWidth,
		cHeight,
		handleMouseMove,
		handleMouseDown,
		render,
		drawControlPoints
	});

	$$self.$inject_state = $$props => {
		if ("points" in $$props) $$invalidate(8, points = $$props.points);
		if ("canvas" in $$props) $$invalidate(0, canvas = $$props.canvas);
		if ("ctx" in $$props) ctx = $$props.ctx;
		if ("isHovered" in $$props) $$invalidate(1, isHovered = $$props.isHovered);
		if ("isRendering" in $$props) isRendering = $$props.isRendering;
		if ("activePoint" in $$props) $$invalidate(2, activePoint = $$props.activePoint);
		if ("cWidth" in $$props) $$invalidate(3, cWidth = $$props.cWidth);
		if ("cHeight" in $$props) $$invalidate(4, cHeight = $$props.cHeight);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

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
		ctx,
		mousePos,
		mouseDownPos,
		pointDownPos,
		isRendering,
		drawControlPoints,
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
				insert_dev(options.target, this, options.anchor);
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

/* src/InputShape.svelte generated by Svelte v3.22.2 */

const { window: window_1$1 } = globals;
const file$4 = "src/InputShape.svelte";

function create_fragment$4(ctx) {
	let div;
	let canvas_1;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			canvas_1 = element("canvas");
			this.c = noop;
			attr_dev(canvas_1, "width", /*cWidth*/ ctx[3]);
			attr_dev(canvas_1, "height", /*cHeight*/ ctx[4]);
			add_location(canvas_1, file$4, 255, 2, 5533);
			attr_dev(div, "id", "main");
			add_location(div, file$4, 243, 0, 5328);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor, remount) {
			insert_dev(target, div, anchor);
			append_dev(div, canvas_1);
			/*canvas_1_binding*/ ctx[19](canvas_1);
			if (remount) run_all(dispose);

			dispose = [
				listen_dev(window_1$1, "mouseup", /*mouseup_handler*/ ctx[18], false, false, false),
				listen_dev(div, "mouseover", /*mouseover_handler*/ ctx[20], false, false, false),
				listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[21], false, false, false),
				listen_dev(div, "mousemove", /*handleMouseMove*/ ctx[5], false, false, false),
				listen_dev(div, "mousedown", /*handleMouseDown*/ ctx[6], false, false, false)
			];
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*cWidth*/ 8) {
				attr_dev(canvas_1, "width", /*cWidth*/ ctx[3]);
			}

			if (dirty & /*cHeight*/ 16) {
				attr_dev(canvas_1, "height", /*cHeight*/ ctx[4]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			/*canvas_1_binding*/ ctx[19](null);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const hoverDistance$1 = 0.1;
const tension$1 = 0.4;
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
	let isRendering = false;
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

	const writable_props = ["points"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<plant-shape> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("plant-shape", $$slots, []);

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
			$$invalidate(0, canvas = $$value);
		});
	}

	const mouseover_handler = () => {
		$$invalidate(1, isHovered = true);
		render();
	};

	const mouseleave_handler = () => {
		$$invalidate(1, isHovered = false);
	};

	$$self.$set = $$props => {
		if ("points" in $$props) $$invalidate(8, points = $$props.points);
	};

	$$self.$capture_state = () => ({
		onMount,
		Vec2,
		curve: w,
		points,
		canvas,
		ctx,
		hoverDistance: hoverDistance$1,
		tension: tension$1,
		isHovered,
		isRendering,
		activePoint,
		gradient,
		mousePos,
		mouseDownPos,
		pointDownPos,
		width: width$1,
		height: height$1,
		cWidth,
		cHeight,
		handleMouseMove,
		handleMouseDown,
		render,
		drawControlPoints,
		drawLines,
		drawShape
	});

	$$self.$inject_state = $$props => {
		if ("points" in $$props) $$invalidate(8, points = $$props.points);
		if ("canvas" in $$props) $$invalidate(0, canvas = $$props.canvas);
		if ("ctx" in $$props) ctx = $$props.ctx;
		if ("isHovered" in $$props) $$invalidate(1, isHovered = $$props.isHovered);
		if ("isRendering" in $$props) isRendering = $$props.isRendering;
		if ("activePoint" in $$props) $$invalidate(2, activePoint = $$props.activePoint);
		if ("gradient" in $$props) gradient = $$props.gradient;
		if ("cWidth" in $$props) $$invalidate(3, cWidth = $$props.cWidth);
		if ("cHeight" in $$props) $$invalidate(4, cHeight = $$props.cHeight);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

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
		ctx,
		gradient,
		mousePos,
		mouseDownPos,
		pointDownPos,
		isRendering,
		drawControlPoints,
		drawLines,
		drawShape,
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
				insert_dev(options.target, this, options.anchor);
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

// *****************************************
// * Notice that the component is not instantiated and mounted to the document <body className="">
// * Since the compiler is creating a custom element, we instead define and use the custom element
// * in the index.html file to simulate the end-user experience.
// ******************************************

function stateToElement(template, value = 0) {

  if (Array.isArray(template.values)) {
    const element = new InputSelect();
    element.setItems(template.values);
    element.setValue(+value || value || template.values[0]);
    return element;
  }

  if (template.inputType === 'slider') {
    const element = new InputSlider();
    if ('max' in template) element.setAttribute('max', template.max);
    if ('min' in template) element.setAttribute('min', template.min);
    if ('step' in template) element.setAttribute('step', template.step);
    element.setAttribute('value', value || template.value);
    return element;
  }

  if (template.inputType === 'curve') {
    const element = new InputCurve();
    if ('points' in template) element.setAttribute('points', template.points);
    return element;
  }

  if (template.inputType === 'shape') {
    const element = new InputShape();
    if ('points' in template) element.setAttribute('points', template.points);
    return element;
  }

  if (template.type === 'number' || typeof template.value === 'number') {
    const element = new InputNumber();
    if ('max' in template) element.setAttribute('max', template.max);
    if ('min' in template) element.setAttribute('min', template.min);
    if ('step' in template) element.setAttribute('step', template.step);
    const { value: _value = value } = template;
    element.setAttribute('value', parseFloat(_value));
    return element;
  }
}

export { InputCurve, InputNumber, InputSelect, InputShape, InputSlider, stateToElement };
//# sourceMappingURL=index.js.map
