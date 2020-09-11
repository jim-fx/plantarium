
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
    return value === '' ? undefined : +value;
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
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

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.1' }, detail)));
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
    if (text.wholeText === data)
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

/* src/InputSlider.svelte generated by Svelte v3.24.1 */
const file = "src/InputSlider.svelte";

function create_fragment(ctx) {
	let div;
	let output;
	let t0;
	let output_style_value;
	let t1;
	let input;
	let mounted;
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
			add_location(output, file, 136, 2, 2955);
			attr_dev(input, "type", "range");
			attr_dev(input, "min", /*min*/ ctx[1]);
			attr_dev(input, "step", /*step*/ ctx[3]);
			attr_dev(input, "max", /*max*/ ctx[2]);
			add_location(input, file, 142, 2, 3077);
			add_location(div, file, 135, 0, 2947);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, output);
			append_dev(output, t0);
			append_dev(div, t1);
			append_dev(div, input);
			set_input_value(input, /*value*/ ctx[0]);

			if (!mounted) {
				dispose = [
					listen_dev(input, "focus", /*focus_handler*/ ctx[6], false, false, false),
					listen_dev(input, "blur", /*blur_handler*/ ctx[7], false, false, false),
					listen_dev(input, "input", /*handleInput*/ ctx[5], false, false, false),
					listen_dev(input, "change", /*input_change_input_handler*/ ctx[8]),
					listen_dev(input, "input", /*input_change_input_handler*/ ctx[8])
				];

				mounted = true;
			}
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
			mounted = false;
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

	$$self.$$set = $$props => {
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

/* src/InputNumber.svelte generated by Svelte v3.24.1 */
const file$1 = "src/InputNumber.svelte";

function create_fragment$1(ctx) {
	let div;
	let button0;
	let t0;
	let input;
	let t1;
	let button1;
	let mounted;
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
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, button0);
			append_dev(div, t0);
			append_dev(div, input);
			/*input_binding*/ ctx[7](input);
			set_input_value(input, /*value*/ ctx[0]);
			append_dev(div, t1);
			append_dev(div, button1);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler*/ ctx[6], false, false, false),
					listen_dev(input, "input", /*input_input_handler*/ ctx[8]),
					listen_dev(button1, "click", /*click_handler_1*/ ctx[9], false, false, false)
				];

				mounted = true;
			}
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
			/*input_binding*/ ctx[7](null);
			mounted = false;
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

/* src/InputSelect.svelte generated by Svelte v3.24.1 */
const file$2 = "src/InputSelect.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i];
	return child_ctx;
}

// (94:2) {:else}
function create_else_block(ctx) {
	let div;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = "none";
			attr_dev(div, "id", "selected-value");
			add_location(div, file$2, 94, 4, 1719);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (!mounted) {
				dispose = listen_dev(div, "click", /*handleOpen*/ ctx[4], false, false, false);
				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
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
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			t = text(/*selectedValue*/ ctx[0]);
			attr_dev(div, "id", "selected-value");
			add_location(div, file$2, 92, 4, 1636);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);

			if (!mounted) {
				dispose = listen_dev(div, "click", /*handleOpen*/ ctx[4], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*selectedValue*/ 1) set_data_dev(t, /*selectedValue*/ ctx[0]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
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
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[8](/*item*/ ctx[12], ...args);
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
		m: function mount(target, anchor) {
			insert_dev(target, p, anchor);
			append_dev(p, t0);
			append_dev(p, t1);

			if (!mounted) {
				dispose = listen_dev(p, "click", click_handler, false, false, false);
				mounted = true;
			}
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
			mounted = false;
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
			/*div_binding*/ ctx[9](div);
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
			/*div_binding*/ ctx[9](null);
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
			main = $$value;
			$$invalidate(2, main);
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
    var x = b[0] - a[0], y = b[1] - a[1];
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
    var x = b[0] - a[0], y = b[1] - a[1];
    return x * x + y * y;
}
/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
    var x = a[0], y = a[1];
    return Math.sqrt(x * x + y * y);
}
/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
    var x = a[0], y = a[1];
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
    var x = a[0], y = a[1];
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
    var ax = a[0], ay = a[1];
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
    var x = a[0], y = a[1];
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
        if (x.length)
            return this.copy(x);
        set(this, x, y);
        return this;
    }
    copy(v) {
        copy(this, v);
        return this;
    }
    add(va, vb) {
        if (vb)
            add(this, va, vb);
        else
            add(this, this, va);
        return this;
    }
    sub(va, vb) {
        if (vb)
            subtract(this, va, vb);
        else
            subtract(this, this, va);
        return this;
    }
    multiply(v) {
        if (v.length)
            multiply(this, this, v);
        else
            scale(this, this, v);
        return this;
    }
    divide(v) {
        if (v.length)
            divide(this, this, v);
        else
            scale(this, this, 1 / v);
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
        if (v)
            return distance(this, v);
        else
            return length(this);
    }
    squaredLen() {
        return this.squaredDistance();
    }
    squaredDistance(v) {
        if (v)
            return squaredDistance(this, v);
        else
            return squaredLength(this);
    }
    negate(v = this) {
        negate(this, v);
        return this;
    }
    cross(va, vb) {
        if (vb)
            return cross(va, vb);
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


});

function e(t,i){for(var n=0;n<i.length;n++){var e=i[n];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e);}}function r(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}function s(t,i){t.prototype=Object.create(i.prototype),t.prototype.constructor=t,t.__proto__=i;}function o(t){return (o=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function h(t,i){return (h=Object.setPrototypeOf||function(t,i){return t.__proto__=i,t})(t,i)}function a(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return !1}}function u(t,i,n){return (u=a()?Reflect.construct:function(t,i,n){var e=[null];e.push.apply(e,i);var r=new(Function.bind.apply(t,e));return n&&h(r,n.prototype),r}).apply(null,arguments)}function c(t){var i="function"==typeof Map?new Map:void 0;return (c=function(t){if(null===t||-1===Function.toString.call(t).indexOf("[native code]"))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==i){if(i.has(t))return i.get(t);i.set(t,n);}function n(){return u(t,arguments,o(this).constructor)}return n.prototype=Object.create(t.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),h(n,t)})(t)}function l(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function U(t){var i=t.length-1;return t.map(function(t,n,e){if(0===n)return {rx:.4*e[n+1].x*0,ry:t.y+.4*(e[n+1].y-t.y)*0};if(n===i)return {lx:e[n-1].x+.4*(t.x-e[n-1].x)*2,ly:e[n-1].y+.4*(t.y-e[n-1].y)*2};if(t.y>e[n+1].y&&t.y>e[n-1].y||t.y<e[n+1].y&&t.y<e[n-1].y)return {lx:e[n-1].x+.4*(t.x-e[n-1].x),ly:t.y,rx:t.x+.4*(e[n+1].x-t.x),ry:t.y};var r={x:e[n-1].x-e[n+1].x,y:e[n-1].y-e[n+1].y},s=Math.sqrt(Math.pow(r.x,2)+Math.pow(r.y,2));r.x/=s,r.y/=s;var o=e[n+1].x-t.x,h=t.x-e[n-1].x;return {lx:t.x+r.x*h*.4,ly:t.y+r.y*h*.4,rx:t.x-r.x*o*.4,ry:t.y-r.y*o*.4}})}function k(t){var i=t.length-1,n={},e=U(t);return t.map(function(t,n,r){return n<i?function(t,i,n,e,r,s,o,h,a,u){for(var c,l,f,d,v=r-n,g=o-r,p=a-o,m=s-e,y=h-s,w=u-h,x=-1e4,E=-1e4,b=[{x:n,y:e}],A=1;A<t;A++){var T=A/t;c=n+v*T,l=e+m*T;var M=(c+=((f=r+g*T)-c)*T)+((f+=(o+p*T-f)*T)-c)*T,S=(l+=((d=s+y*T)-l)*T)+((d+=(h+w*T-d)*T)-l)*T,_=M-x,F=S-E;_*_+F*F>0&&(b.push({x:M,y:S}),x=M,E=S);}return b.push({x:a,y:u}),b}(20*i,0,t.x,t.y,e[n].rx,e[n].ry,e[n+1].lx,e[n+1].ly,r[n+1].x,r[n+1].y):void 0}).flat().filter(function(t){return !!t&&!(t.x in n)&&(n[t.x]=!0,!0)})}var q={__proto__:null,computeControlPoints:U,drawLinear:function(t,i){t.save(),t.beginPath(),i.forEach(function(i,n,e){n<e.length-1&&(t.strokeStyle="gray",t.moveTo(i.x,i.y),t.lineTo(e[n+1].x,e[n+1].y));}),t.stroke(),t.restore();},drawControlPoints:function(t,i){U(i).forEach(function(n,e){"rx"in n&&"ry"in n&&(t.fillRect(n.rx-1,n.ry-1,2,2),t.beginPath(),t.moveTo(i[e].x,i[e].y),t.lineTo(n.rx,n.ry),t.stroke()),"lx"in n&&"ly"in n&&(t.fillRect(n.lx-1,n.ly-1,2,2),t.beginPath(),t.moveTo(i[e].x,i[e].y),t.lineTo(n.lx,n.ly),t.stroke());});},drawCurve:function(t,i){var n=U(i);i.forEach(function(i,e,r){e<r.length-1&&(t.moveTo(i.x,i.y),t.bezierCurveTo(n[e].rx,n[e].ry,n[e+1].lx,n[e+1].ly,r[e+1].x,r[e+1].y),t.stroke());});},toArray:k,drawSamplePoints:function(t,i){t.save(),t.fillStyle="red",k(i).forEach(function(i){t.fillRect(i.x-1,i.y-1,2,2);}),t.restore();}};function D(t){var i=t[0],n=t[1],e=t[2];return Math.sqrt(i*i+n*n+e*e)}function B(t,i){return t[0]=i[0],t[1]=i[1],t[2]=i[2],t}function X(t,i,n){return t[0]=i[0]+n[0],t[1]=i[1]+n[1],t[2]=i[2]+n[2],t}function j(t,i,n){return t[0]=i[0]-n[0],t[1]=i[1]-n[1],t[2]=i[2]-n[2],t}function Y(t,i,n){return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t}function G(t){var i=t[0],n=t[1],e=t[2];return i*i+n*n+e*e}function W(t,i){var n=i[0],e=i[1],r=i[2],s=n*n+e*e+r*r;return s>0&&(s=1/Math.sqrt(s)),t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t}function z(t,i){return t[0]*i[0]+t[1]*i[1]+t[2]*i[2]}function H(t,i,n){var e=i[0],r=i[1],s=i[2],o=n[0],h=n[1],a=n[2];return t[0]=r*a-s*h,t[1]=s*o-e*a,t[2]=e*h-r*o,t}var V,Z,K=(V=[0,0,0],Z=[0,0,0],function(t,i){B(V,t),B(Z,i),W(V,V),W(Z,Z);var n=z(V,Z);return n>1?0:n<-1?Math.PI:Math.acos(n)}),J=function(t){function i(i,n,e){var r;return void 0===i&&(i=0),void 0===n&&(n=i),void 0===e&&(e=i),(r=t.call(this,i,n,e)||this).constant=void 0,l(r)||l(r)}s(i,t);var n=i.prototype;return n.set=function(t,i,n){return void 0===i&&(i=t),void 0===n&&(n=t),t.length?this.copy(t):(function(t,i,n,e){t[0]=i,t[1]=n,t[2]=e;}(this,t,i,n),this)},n.copy=function(t){return B(this,t),this},n.add=function(t,i){return i?X(this,t,i):X(this,this,t),this},n.sub=function(t,i){return i?j(this,t,i):j(this,this,t),this},n.multiply=function(t){var i,n;return t.length?((i=this)[0]=this[0]*(n=t)[0],i[1]=this[1]*n[1],i[2]=this[2]*n[2]):Y(this,this,t),this},n.divide=function(t){var i,n;return t.length?((i=this)[0]=this[0]/(n=t)[0],i[1]=this[1]/n[1],i[2]=this[2]/n[2]):Y(this,this,1/t),this},n.inverse=function(t){var i,n;return void 0===t&&(t=this),(i=this)[0]=1/(n=t)[0],i[1]=1/n[1],i[2]=1/n[2],this},n.len=function(){return D(this)},n.distance=function(t){return t?(n=(i=t)[0]-this[0],e=i[1]-this[1],r=i[2]-this[2],Math.sqrt(n*n+e*e+r*r)):D(this);var i,n,e,r;},n.squaredLen=function(){return G(this)},n.squaredDistance=function(t){return t?(n=(i=t)[0]-this[0])*n+(e=i[1]-this[1])*e+(r=i[2]-this[2])*r:G(this);var i,n,e,r;},n.negate=function(t){var i,n;return void 0===t&&(t=this),(i=this)[0]=-(n=t)[0],i[1]=-n[1],i[2]=-n[2],this},n.cross=function(t,i){return i?H(this,t,i):H(this,this,t),this},n.scale=function(t){return Y(this,this,t),this},n.normalize=function(){return W(this,this),this},n.dot=function(t){return z(this,t)},n.equals=function(t){return this[0]===(i=t)[0]&&this[1]===i[1]&&this[2]===i[2];var i;},n.applyMatrix4=function(t){var i,n,e,r,s,o;return (i=this)[0]=((n=t)[0]*(e=this[0])+n[4]*(r=this[1])+n[8]*(s=this[2])+n[12])/(o=(o=n[3]*e+n[7]*r+n[11]*s+n[15])||1),i[1]=(n[1]*e+n[5]*r+n[9]*s+n[13])/o,i[2]=(n[2]*e+n[6]*r+n[10]*s+n[14])/o,this},n.scaleRotateMatrix4=function(t){var i,n,e,r,s,o;return (i=this)[0]=((n=t)[0]*(e=this[0])+n[4]*(r=this[1])+n[8]*(s=this[2]))/(o=(o=n[3]*e+n[7]*r+n[11]*s+n[15])||1),i[1]=(n[1]*e+n[5]*r+n[9]*s)/o,i[2]=(n[2]*e+n[6]*r+n[10]*s)/o,this},n.applyQuaternion=function(t){return function(t,i,n){var e=i[0],r=i[1],s=i[2],o=n[0],h=n[1],a=n[2],u=h*s-a*r,c=a*e-o*s,l=o*r-h*e,f=h*l-a*c,d=a*u-o*l,v=o*c-h*u,g=2*n[3];c*=g,l*=g,d*=2,v*=2,t[0]=e+(u*=g)+(f*=2),t[1]=r+c+d,t[2]=s+l+v;}(this,this,t),this},n.angle=function(t){return K(this,t)},n.lerp=function(t,i){return function(t,i,n,e){var r=i[0],s=i[1],o=i[2];t[0]=r+e*(n[0]-r),t[1]=s+e*(n[1]-s),t[2]=o+e*(n[2]-o);}(this,this,t,i),this},n.clone=function(){return new i(this[0],this[1],this[2])},n.fromArray=function(t,i){return void 0===i&&(i=0),this[0]=t[i],this[1]=t[i+1],this[2]=t[i+2],this},n.toArray=function(t,i){return void 0===t&&(t=[]),void 0===i&&(i=0),t[i]=this[0],t[i+1]=this[1],t[i+2]=this[2],t},n.transformDirection=function(t){var i=this[0],n=this[1],e=this[2];return this[0]=t[0]*i+t[4]*n+t[8]*e,this[1]=t[1]*i+t[5]*n+t[9]*e,this[2]=t[2]*i+t[6]*n+t[10]*e,this.normalize()},r(i,[{key:"x",get:function(){return this[0]},set:function(t){this[0]=t;}},{key:"y",get:function(){return this[1]},set:function(t){this[1]=t;}},{key:"z",get:function(){return this[2]},set:function(t){this[2]=t;}}]),i}(c(Array)),Q=(new J,1);function st(t,i,n){var e=i[0],r=i[1],s=i[2],o=i[3],h=i[4],a=i[5],u=i[6],c=i[7],l=i[8],f=i[9],d=i[10],v=i[11],g=i[12],p=i[13],m=i[14],y=i[15],w=n[0],x=n[1],E=n[2],b=n[3];return t[0]=w*e+x*h+E*l+b*g,t[1]=w*r+x*a+E*f+b*p,t[2]=w*s+x*u+E*d+b*m,t[3]=w*o+x*c+E*v+b*y,t[4]=(w=n[4])*e+(x=n[5])*h+(E=n[6])*l+(b=n[7])*g,t[5]=w*r+x*a+E*f+b*p,t[6]=w*s+x*u+E*d+b*m,t[7]=w*o+x*c+E*v+b*y,t[8]=(w=n[8])*e+(x=n[9])*h+(E=n[10])*l+(b=n[11])*g,t[9]=w*r+x*a+E*f+b*p,t[10]=w*s+x*u+E*d+b*m,t[11]=w*o+x*c+E*v+b*y,t[12]=(w=n[12])*e+(x=n[13])*h+(E=n[14])*l+(b=n[15])*g,t[13]=w*r+x*a+E*f+b*p,t[14]=w*s+x*u+E*d+b*m,t[15]=w*o+x*c+E*v+b*y,t}function ot(t,i){var n=i[4],e=i[5],r=i[6],s=i[8],o=i[9],h=i[10];return t[0]=Math.hypot(i[0],i[1],i[2]),t[1]=Math.hypot(n,e,r),t[2]=Math.hypot(s,o,h),t}new J;var ht,at=(ht=[0,0,0],function(t,i){var n=ht;ot(n,i);var e=1/n[0],r=1/n[1],s=1/n[2],o=i[0]*e,h=i[1]*r,a=i[2]*s,u=i[4]*e,c=i[5]*r,l=i[6]*s,f=i[8]*e,d=i[9]*r,v=i[10]*s,g=o+c+v,p=0;return g>0?(p=2*Math.sqrt(g+1),t[3]=.25*p,t[0]=(l-d)/p,t[1]=(f-a)/p,t[2]=(h-u)/p):o>c&&o>v?(p=2*Math.sqrt(1+o-c-v),t[3]=(l-d)/p,t[0]=.25*p,t[1]=(h+u)/p,t[2]=(f+a)/p):c>v?(p=2*Math.sqrt(1+c-o-v),t[3]=(f-a)/p,t[0]=(h+u)/p,t[1]=.25*p,t[2]=(l+d)/p):(p=2*Math.sqrt(1+v-o-c),t[3]=(h-u)/p,t[0]=(f+a)/p,t[1]=(l+d)/p,t[2]=.25*p),t}),ut=function(t){function i(i,n,e,r,s,o,h,a,u,c,f,d,v,g,p,m){var y;return void 0===i&&(i=1),void 0===n&&(n=0),void 0===e&&(e=0),void 0===r&&(r=0),void 0===s&&(s=0),void 0===o&&(o=1),void 0===h&&(h=0),void 0===a&&(a=0),void 0===u&&(u=0),void 0===c&&(c=0),void 0===f&&(f=1),void 0===d&&(d=0),void 0===v&&(v=0),void 0===g&&(g=0),void 0===p&&(p=0),void 0===m&&(m=1),l(y=t.call(this,i,n,e,r,s,o,h,a,u,c,f,d,v,g,p,m)||this)||l(y)}s(i,t);var n=i.prototype;return n.set=function(t,i,n,e,r,s,o,h,a,u,c,l,f,d,v,g){return t.length?this.copy(t):(function(t,i,n,e,r,s,o,h,a,u,c,l,f,d,v,g,p){t[0]=i,t[1]=n,t[2]=e,t[3]=r,t[4]=s,t[5]=o,t[6]=h,t[7]=a,t[8]=u,t[9]=c,t[10]=l,t[11]=f,t[12]=d,t[13]=v,t[14]=g,t[15]=p;}(this,t,i,n,e,r,s,o,h,a,u,c,l,f,d,v,g),this)},n.translate=function(t,i){return void 0===i&&(i=this),function(t,i,n){var e,r,s,o,h,a,u,c,l,f,d,v,g=n[0],p=n[1],m=n[2];i===t?(t[12]=i[0]*g+i[4]*p+i[8]*m+i[12],t[13]=i[1]*g+i[5]*p+i[9]*m+i[13],t[14]=i[2]*g+i[6]*p+i[10]*m+i[14],t[15]=i[3]*g+i[7]*p+i[11]*m+i[15]):(r=i[1],s=i[2],o=i[3],h=i[4],a=i[5],u=i[6],c=i[7],l=i[8],f=i[9],d=i[10],v=i[11],t[0]=e=i[0],t[1]=r,t[2]=s,t[3]=o,t[4]=h,t[5]=a,t[6]=u,t[7]=c,t[8]=l,t[9]=f,t[10]=d,t[11]=v,t[12]=e*g+h*p+l*m+i[12],t[13]=r*g+a*p+f*m+i[13],t[14]=s*g+u*p+d*m+i[14],t[15]=o*g+c*p+v*m+i[15]);}(this,i,t),this},n.rotate=function(t,i,n){return void 0===n&&(n=this),function(t,i,n,e){var r,s,o,h,a,u,c,l,f,d,v,g,p,m,y,w,x,E,b,A,T,M,S,_,F=e[0],P=e[1],R=e[2],L=Math.hypot(F,P,R);Math.abs(L)<1e-6||(F*=L=1/L,P*=L,R*=L,r=Math.sin(n),s=Math.cos(n),a=i[1],u=i[2],c=i[3],f=i[5],d=i[6],v=i[7],p=i[9],m=i[10],y=i[11],b=F*P*(o=1-s)-R*r,A=P*P*o+s,T=R*P*o+F*r,M=F*R*o+P*r,S=P*R*o-F*r,_=R*R*o+s,t[0]=(h=i[0])*(w=F*F*o+s)+(l=i[4])*(x=P*F*o+R*r)+(g=i[8])*(E=R*F*o-P*r),t[1]=a*w+f*x+p*E,t[2]=u*w+d*x+m*E,t[3]=c*w+v*x+y*E,t[4]=h*b+l*A+g*T,t[5]=a*b+f*A+p*T,t[6]=u*b+d*A+m*T,t[7]=c*b+v*A+y*T,t[8]=h*M+l*S+g*_,t[9]=a*M+f*S+p*_,t[10]=u*M+d*S+m*_,t[11]=c*M+v*S+y*_,i!==t&&(t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15]));}(this,n,t,i),this},n.scale=function(t,i){return void 0===i&&(i=this),function(t,i,n){var e=n[0],r=n[1],s=n[2];t[0]=i[0]*e,t[1]=i[1]*e,t[2]=i[2]*e,t[3]=i[3]*e,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=i[7]*r,t[8]=i[8]*s,t[9]=i[9]*s,t[10]=i[10]*s,t[11]=i[11]*s,t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15];}(this,i,"number"==typeof t?[t,t,t]:t),this},n.multiply=function(t,i){return i?st(this,t,i):st(this,this,t),this},n.identity=function(){var t;return (t=this)[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this},n.copy=function(t){var i,n;return (i=this)[0]=(n=t)[0],i[1]=n[1],i[2]=n[2],i[3]=n[3],i[4]=n[4],i[5]=n[5],i[6]=n[6],i[7]=n[7],i[8]=n[8],i[9]=n[9],i[10]=n[10],i[11]=n[11],i[12]=n[12],i[13]=n[13],i[14]=n[14],i[15]=n[15],this},n.fromPerspective=function(t){var i,n,e,r,s,o,h=void 0===t?{}:t;return i=this,n=h.aspect,e=h.near,r=h.far,s=1/Math.tan(h.fov/2),o=1/(e-r),i[0]=s/n,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=s,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[10]=(r+e)*o,i[11]=-1,i[12]=0,i[13]=0,i[14]=2*r*e*o,i[15]=0,this},n.fromOrthogonal=function(t){return u=1/((r=t.bottom)-(s=t.top)),c=1/((o=t.near)-(h=t.far)),(i=this)[0]=-2*(a=1/((n=t.left)-(e=t.right))),i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=-2*u,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[10]=2*c,i[11]=0,i[12]=(n+e)*a,i[13]=(s+r)*u,i[14]=(h+o)*c,i[15]=1,this;var i,n,e,r,s,o,h,a,u,c;},n.fromQuaternion=function(t){return function(t,i){var n=i[0],e=i[1],r=i[2],s=i[3],o=n+n,h=e+e,a=r+r,u=n*o,c=e*o,l=e*h,f=r*o,d=r*h,v=r*a,g=s*o,p=s*h,m=s*a;t[0]=1-l-v,t[1]=c+m,t[2]=f-p,t[3]=0,t[4]=c-m,t[5]=1-u-v,t[6]=d+g,t[7]=0,t[8]=f+p,t[9]=d-g,t[10]=1-u-l,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1;}(this,t),this},n.setPosition=function(t){return this.x=t[0],this.y=t[1],this.z=t[2],this},n.inverse=function(t){var i,n,e,r,s,o,h,a,u,c,l,f,d,v,g,p,m,y,w,x,E,b,A,T,M,S,_,F,P,R,L;return void 0===t&&(t=this),i=this,(L=(w=(e=(n=t)[0])*(a=n[5])-(r=n[1])*(h=n[4]))*(R=(d=n[10])*(y=n[15])-(v=n[11])*(m=n[14]))-(x=e*(u=n[6])-(s=n[2])*h)*(P=(f=n[9])*y-v*(p=n[13]))+(E=e*(c=n[7])-(o=n[3])*h)*(F=f*m-d*p)+(b=r*u-s*a)*(_=(l=n[8])*y-v*(g=n[12]))-(A=r*c-o*a)*(S=l*m-d*g)+(T=s*c-o*u)*(M=l*p-f*g))&&(i[0]=(a*R-u*P+c*F)*(L=1/L),i[1]=(s*P-r*R-o*F)*L,i[2]=(p*T-m*A+y*b)*L,i[3]=(d*A-f*T-v*b)*L,i[4]=(u*_-h*R-c*S)*L,i[5]=(e*R-s*_+o*S)*L,i[6]=(m*E-g*T-y*x)*L,i[7]=(l*T-d*E+v*x)*L,i[8]=(h*P-a*_+c*M)*L,i[9]=(r*_-e*P-o*M)*L,i[10]=(g*A-p*E+y*w)*L,i[11]=(f*E-l*A-v*w)*L,i[12]=(a*S-h*F-u*M)*L,i[13]=(e*F-r*S+s*M)*L,i[14]=(p*x-g*b-m*w)*L,i[15]=(l*b-f*x+d*w)*L),this},n.compose=function(t,i,n){return function(t,i,n,e){var r=i[0],s=i[1],o=i[2],h=i[3],a=r+r,u=s+s,c=o+o,l=r*a,f=r*u,d=r*c,v=s*u,g=s*c,p=o*c,m=h*a,y=h*u,w=h*c,x=e[0],E=e[1],b=e[2];t[0]=(1-(v+p))*x,t[1]=(f+w)*x,t[2]=(d-y)*x,t[3]=0,t[4]=(f-w)*E,t[5]=(1-(l+p))*E,t[6]=(g+m)*E,t[7]=0,t[8]=(d+y)*b,t[9]=(g-m)*b,t[10]=(1-(l+v))*b,t[11]=0,t[12]=n[0],t[13]=n[1],t[14]=n[2],t[15]=1;}(this,t,i,n),this},n.getRotation=function(t){return at(t,this),this},n.getTranslation=function(t){var i;return (i=t)[0]=this[12],i[1]=this[13],i[2]=this[14],this},n.getScaling=function(t){return ot(t,this),this},n.getMaxScaleOnAxis=function(){return t=this[0],i=this[1],n=this[2],e=this[4],r=this[5],s=this[6],o=this[8],h=this[9],a=this[10],Math.sqrt(Math.max(t*t+i*i+n*n,e*e+r*r+s*s,o*o+h*h+a*a));var t,i,n,e,r,s,o,h,a;},n.lookAt=function(t,i,n){return function(t,i,n,e){var r=i[0],s=i[1],o=i[2],h=e[0],a=e[1],u=e[2],c=r-n[0],l=s-n[1],f=o-n[2],d=c*c+l*l+f*f;0===d?f=1:(c*=d=1/Math.sqrt(d),l*=d,f*=d);var v=a*f-u*l,g=u*c-h*f,p=h*l-a*c;0==(d=v*v+g*g+p*p)&&(u?h+=1e-6:a?u+=1e-6:a+=1e-6,d=(v=a*f-u*l)*v+(g=u*c-h*f)*g+(p=h*l-a*c)*p),g*=d=1/Math.sqrt(d),p*=d,t[0]=v*=d,t[1]=g,t[2]=p,t[3]=0,t[4]=l*p-f*g,t[5]=f*v-c*p,t[6]=c*g-l*v,t[7]=0,t[8]=c,t[9]=l,t[10]=f,t[11]=0,t[12]=r,t[13]=s,t[14]=o,t[15]=1;}(this,t,i,n),this},n.determinant=function(){return ((i=(t=this)[0])*(o=t[5])-(n=t[1])*(s=t[4]))*((l=t[10])*(p=t[15])-(f=t[11])*(g=t[14]))-(i*(h=t[6])-(e=t[2])*s)*((c=t[9])*p-f*(v=t[13]))+(i*(a=t[7])-(r=t[3])*s)*(c*g-l*v)+(n*h-e*o)*((u=t[8])*p-f*(d=t[12]))-(n*a-r*o)*(u*g-l*d)+(e*a-r*h)*(u*v-c*d);var t,i,n,e,r,s,o,h,a,u,c,l,f,d,v,g,p;},n.fromArray=function(t,i){return void 0===i&&(i=0),this[0]=t[i],this[1]=t[i+1],this[2]=t[i+2],this[3]=t[i+3],this[4]=t[i+4],this[5]=t[i+5],this[6]=t[i+6],this[7]=t[i+7],this[8]=t[i+8],this[9]=t[i+9],this[10]=t[i+10],this[11]=t[i+11],this[12]=t[i+12],this[13]=t[i+13],this[14]=t[i+14],this[15]=t[i+15],this},n.toArray=function(t,i){return void 0===t&&(t=[]),void 0===i&&(i=0),t[i]=this[0],t[i+1]=this[1],t[i+2]=this[2],t[i+3]=this[3],t[i+4]=this[4],t[i+5]=this[5],t[i+6]=this[6],t[i+7]=this[7],t[i+8]=this[8],t[i+9]=this[9],t[i+10]=this[10],t[i+11]=this[11],t[i+12]=this[12],t[i+13]=this[13],t[i+14]=this[14],t[i+15]=this[15],t},r(i,[{key:"x",get:function(){return this[12]},set:function(t){this[12]=t;}},{key:"y",get:function(){return this[13]},set:function(t){this[13]=t;}},{key:"z",get:function(){return this[14]},set:function(t){this[14]=t;}},{key:"w",get:function(){return this[15]},set:function(t){this[15]=t;}}]),i}(c(Array));function ct(t,i,n){var e=i[0],r=i[1],s=i[2],o=i[3],h=n[0],a=n[1],u=n[2],c=n[3];return t[0]=e*c+o*h+r*u-s*a,t[1]=r*c+o*a+s*h-e*u,t[2]=s*c+o*u+e*a-r*h,t[3]=o*c-e*h-r*a-s*u,t}var lt=function(t){function i(i,n,e,r){var s;return void 0===i&&(i=0),void 0===n&&(n=0),void 0===e&&(e=0),void 0===r&&(r=1),(s=t.call(this,i,n,e,r)||this).onChange=void 0,s.onChange=function(){},l(s)||l(s)}s(i,t);var n=i.prototype;return n.identity=function(){var t;return (t=this)[0]=0,t[1]=0,t[2]=0,t[3]=1,this.onChange(),this},n.set=function(t,i,n,e){return t.length?this.copy(t):(function(t,i,n,e,r){t[0]=i,t[1]=n,t[2]=e,t[3]=r;}(this,t,i,n,e),this.onChange(),this)},n.rotateX=function(t){return function(t,i,n){n*=.5;var e=i[0],r=i[1],s=i[2],o=i[3],h=Math.sin(n),a=Math.cos(n);t[0]=e*a+o*h,t[1]=r*a+s*h,t[2]=s*a-r*h,t[3]=o*a-e*h;}(this,this,t),this.onChange(),this},n.rotateY=function(t){return function(t,i,n){n*=.5;var e=i[0],r=i[1],s=i[2],o=i[3],h=Math.sin(n),a=Math.cos(n);t[0]=e*a-s*h,t[1]=r*a+o*h,t[2]=s*a+e*h,t[3]=o*a-r*h;}(this,this,t),this.onChange(),this},n.rotateZ=function(t){return function(t,i,n){n*=.5;var e=i[0],r=i[1],s=i[2],o=i[3],h=Math.sin(n),a=Math.cos(n);t[0]=e*a+r*h,t[1]=r*a-e*h,t[2]=s*a+o*h,t[3]=o*a-s*h;}(this,this,t),this.onChange(),this},n.inverse=function(t){var i,n,e,r,s,o,h,a;return void 0===t&&(t=this),(i=this)[0]=-(e=(n=t)[0])*(a=(h=e*e+(r=n[1])*r+(s=n[2])*s+(o=n[3])*o)?1/h:0),i[1]=-r*a,i[2]=-s*a,i[3]=o*a,this.onChange(),this},n.conjugate=function(t){var i,n;return void 0===t&&(t=this),(i=this)[0]=-(n=t)[0],i[1]=-n[1],i[2]=-n[2],i[3]=n[3],this.onChange(),this},n.copy=function(t){return (i=this)[0]=(n=t)[0],i[1]=n[1],i[2]=n[2],i[3]=n[3],this.onChange(),this;var i,n;},n.normalize=function(t){return void 0===t&&(t=this),(o=(n=(i=t)[0])*n+(e=i[1])*e+(r=i[2])*r+(s=i[3])*s)>0&&(o=1/Math.sqrt(o)),this[0]=n*o,this[1]=e*o,this[2]=r*o,this[3]=s*o,this.onChange(),this;var i,n,e,r,s,o;},n.multiply=function(t,i){return i?ct(this,t,i):ct(this,this,t),this.onChange(),this},n.dot=function(t){return (i=this)[0]*(n=t)[0]+i[1]*n[1]+i[2]*n[2]+i[3]*n[3];var i,n;},n.fromMatrix3=function(t){return function(t,i){var n,e=i[0]+i[4]+i[8];if(e>0)n=Math.sqrt(e+1),t[3]=.5*n,t[0]=(i[5]-i[7])*(n=.5/n),t[1]=(i[6]-i[2])*n,t[2]=(i[1]-i[3])*n;else {var r=0;i[4]>i[0]&&(r=1),i[8]>i[3*r+r]&&(r=2);var s=(r+1)%3,o=(r+2)%3;n=Math.sqrt(i[3*r+r]-i[3*s+s]-i[3*o+o]+1),t[r]=.5*n,t[3]=(i[3*s+o]-i[3*o+s])*(n=.5/n),t[s]=(i[3*s+r]+i[3*r+s])*n,t[o]=(i[3*o+r]+i[3*r+o])*n;}}(this,t),this.onChange(),this},n.fromEuler=function(t){return function(t,i,n){void 0===n&&(n="YXZ");var e=Math.sin(.5*i[0]),r=Math.cos(.5*i[0]),s=Math.sin(.5*i[1]),o=Math.cos(.5*i[1]),h=Math.sin(.5*i[2]),a=Math.cos(.5*i[2]);"XYZ"===n?(t[0]=e*o*a+r*s*h,t[1]=r*s*a-e*o*h,t[2]=r*o*h+e*s*a,t[3]=r*o*a-e*s*h):"YXZ"===n?(t[0]=e*o*a+r*s*h,t[1]=r*s*a-e*o*h,t[2]=r*o*h-e*s*a,t[3]=r*o*a+e*s*h):"ZXY"===n?(t[0]=e*o*a-r*s*h,t[1]=r*s*a+e*o*h,t[2]=r*o*h+e*s*a,t[3]=r*o*a-e*s*h):"ZYX"===n?(t[0]=e*o*a-r*s*h,t[1]=r*s*a+e*o*h,t[2]=r*o*h-e*s*a,t[3]=r*o*a+e*s*h):"YZX"===n?(t[0]=e*o*a+r*s*h,t[1]=r*s*a+e*o*h,t[2]=r*o*h-e*s*a,t[3]=r*o*a-e*s*h):"XZY"===n&&(t[0]=e*o*a-r*s*h,t[1]=r*s*a-e*o*h,t[2]=r*o*h+e*s*a,t[3]=r*o*a+e*s*h);}(this,t,t.order),this},n.fromAxisAngle=function(t,i){return function(t,i,n){n*=.5;var e=Math.sin(n);t[0]=e*i[0],t[1]=e*i[1],t[2]=e*i[2],t[3]=Math.cos(n);}(this,t,i),this},n.slerp=function(t,i){return function(t,i,n,e){var r,s,o,h,a,u=i[0],c=i[1],l=i[2],f=i[3],d=n[0],v=n[1],g=n[2],p=n[3];(s=u*d+c*v+l*g+f*p)<0&&(s=-s,d=-d,v=-v,g=-g,p=-p),1-s>1e-6?(r=Math.acos(s),o=Math.sin(r),h=Math.sin((1-e)*r)/o,a=Math.sin(e*r)/o):(h=1-e,a=e),t[0]=h*u+a*d,t[1]=h*c+a*v,t[2]=h*l+a*g,t[3]=h*f+a*p;}(this,this,t,i),this},n.fromArray=function(t,i){return void 0===i&&(i=0),this[0]=t[i],this[1]=t[i+1],this[2]=t[i+2],this[3]=t[i+3],this},n.toArray=function(t,i){return void 0===t&&(t=[]),void 0===i&&(i=0),t[i]=this[0],t[i+1]=this[1],t[i+2]=this[2],t[i+3]=this[3],t},r(i,[{key:"x",get:function(){return this[0]},set:function(t){this[0]=t,this.onChange();}},{key:"y",get:function(){return this[1]},set:function(t){this[1]=t,this.onChange();}},{key:"z",get:function(){return this[2]},set:function(t){this[2]=t,this.onChange();}},{key:"w",get:function(){return this[3]},set:function(t){this[3]=t,this.onChange();}}]),i}(c(Array)),ft=(new ut,new ut,new J,new J,new Uint8Array(4));function pt(t,i,n){return t[0]=i[0]+n[0],t[1]=i[1]+n[1],t}function mt(t,i,n){return t[0]=i[0]-n[0],t[1]=i[1]-n[1],t}function yt(t,i,n){return t[0]=i[0]*n,t[1]=i[1]*n,t}function wt(t){var i=t[0],n=t[1];return Math.sqrt(i*i+n*n)}function xt(t,i){return t[0]*i[1]-t[1]*i[0]}var Et=function(t){function i(i,n){var e;return void 0===i&&(i=0),void 0===n&&(n=i),l(e=t.call(this,i,n)||this)||l(e)}s(i,t);var n=i.prototype;return n.set=function(t,i){return void 0===i&&(i=t),t.length?this.copy(t):(function(t,i,n){t[0]=i,t[1]=n;}(this,t,i),this)},n.copy=function(t){var i,n;return (i=this)[0]=(n=t)[0],i[1]=n[1],this},n.add=function(t,i){return i?pt(this,t,i):pt(this,this,t),this},n.sub=function(t,i){return i?mt(this,t,i):mt(this,this,t),this},n.multiply=function(t){var i,n;return t.length?((i=this)[0]=this[0]*(n=t)[0],i[1]=this[1]*n[1]):yt(this,this,t),this},n.divide=function(t){var i,n;return t.length?((i=this)[0]=this[0]/(n=t)[0],i[1]=this[1]/n[1]):yt(this,this,1/t),this},n.inverse=function(t){var i,n;return void 0===t&&(t=this),(i=this)[0]=1/(n=t)[0],i[1]=1/n[1],this},n.len=function(){return wt(this)},n.distance=function(t){return t?(n=(i=t)[0]-this[0],e=i[1]-this[1],Math.sqrt(n*n+e*e)):wt(this);var i,n,e;},n.squaredLen=function(){return this.squaredDistance()},n.squaredDistance=function(t){return t?(n=(i=t)[0]-this[0])*n+(e=i[1]-this[1])*e:function(t){var i=t[0],n=t[1];return i*i+n*n}(this);var i,n,e;},n.negate=function(t){var i,n;return void 0===t&&(t=this),(i=this)[0]=-(n=t)[0],i[1]=-n[1],this},n.cross=function(t,i){return i?xt(t,i):xt(this,t)},n.scale=function(t){return yt(this,this,t),this},n.normalize=function(){var t,i,n,e;return (e=(i=(t=this)[0])*i+(n=t[1])*n)>0&&(e=1/Math.sqrt(e)),this[0]=t[0]*e,this[1]=t[1]*e,this},n.dot=function(t){return this[0]*(i=t)[0]+this[1]*i[1];var i;},n.equals=function(t){return this[0]===(i=t)[0]&&this[1]===i[1];var i;},n.applyMatrix3=function(t){var i,n,e,r;return (i=this)[0]=(n=t)[0]*(e=this[0])+n[3]*(r=this[1])+n[6],i[1]=n[1]*e+n[4]*r+n[7],this},n.applyMatrix4=function(t){var i,n,e,r;return (i=this)[0]=(n=t)[0]*(e=this[0])+n[4]*(r=this[1])+n[12],i[1]=n[1]*e+n[5]*r+n[13],this},n.lerp=function(t,i){!function(t,i,n,e){var r=i[0],s=i[1];t[0]=r+e*(n[0]-r),t[1]=s+e*(n[1]-s);}(this,this,t,i);},n.clone=function(){return new i(this[0],this[1])},n.fromArray=function(t,i){return void 0===i&&(i=0),this[0]=t[i],this[1]=t[i+1],this},n.toArray=function(t,i){return void 0===t&&(t=[]),void 0===i&&(i=0),t[i]=this[0],t[i+1]=this[1],t},r(i,[{key:"x",get:function(){return this[0]},set:function(t){this[0]=t;}},{key:"y",get:function(){return this[1]},set:function(t){this[1]=t;}}]),i}(c(Array)),bt=(new J,new Et,new Et,new Et,new Et,new Et,new J,new J,new J,new J,new J,new J,new J,new J,new J,new J,new J,new ut,new J,new J,new J,new J,new J,new lt,new J,new J,new lt,new J,new ut,new J,new J,new J,new J,new J,new lt,new lt,new lt,new lt,new ut,new ut,{});

/* src/InputCurve.svelte generated by Svelte v3.24.1 */

const { window: window_1 } = globals;
const file$3 = "src/InputCurve.svelte";

function create_fragment$3(ctx) {
	let div;
	let canvas_1;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			canvas_1 = element("canvas");
			this.c = noop;
			attr_dev(canvas_1, "width", /*cWidth*/ ctx[3]);
			attr_dev(canvas_1, "height", /*cHeight*/ ctx[4]);
			add_location(canvas_1, file$3, 171, 2, 3827);
			attr_dev(div, "id", "main");
			add_location(div, file$3, 159, 0, 3622);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, canvas_1);
			/*canvas_1_binding*/ ctx[10](canvas_1);

			if (!mounted) {
				dispose = [
					listen_dev(window_1, "mouseup", /*mouseup_handler*/ ctx[9], false, false, false),
					listen_dev(div, "mouseover", /*mouseover_handler*/ ctx[11], false, false, false),
					listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[12], false, false, false),
					listen_dev(div, "mousemove", /*handleMouseMove*/ ctx[5], false, false, false),
					listen_dev(div, "mousedown", /*handleMouseDown*/ ctx[6], false, false, false)
				];

				mounted = true;
			}
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
			/*canvas_1_binding*/ ctx[10](null);
			mounted = false;
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

		q.drawCurve(ctx, absPoints);

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

	$$self.$capture_state = () => ({
		onMount,
		Vec2,
		curve: q,
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

/* src/InputShape.svelte generated by Svelte v3.24.1 */

const { window: window_1$1 } = globals;
const file$4 = "src/InputShape.svelte";

function create_fragment$4(ctx) {
	let div;
	let canvas_1;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			canvas_1 = element("canvas");
			this.c = noop;
			attr_dev(canvas_1, "width", /*cWidth*/ ctx[3]);
			attr_dev(canvas_1, "height", /*cHeight*/ ctx[4]);
			add_location(canvas_1, file$4, 255, 2, 5544);
			attr_dev(div, "id", "main");
			add_location(div, file$4, 243, 0, 5339);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, canvas_1);
			/*canvas_1_binding*/ ctx[10](canvas_1);

			if (!mounted) {
				dispose = [
					listen_dev(window_1$1, "mouseup", /*mouseup_handler*/ ctx[9], false, false, false),
					listen_dev(div, "mouseover", /*mouseover_handler*/ ctx[11], false, false, false),
					listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[12], false, false, false),
					listen_dev(div, "mousemove", /*handleMouseMove*/ ctx[5], false, false, false),
					listen_dev(div, "mousedown", /*handleMouseDown*/ ctx[6], false, false, false)
				];

				mounted = true;
			}
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
			/*canvas_1_binding*/ ctx[10](null);
			mounted = false;
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

	$$self.$capture_state = () => ({
		onMount,
		Vec2,
		curve: q,
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
function stateToElement(target, template, value = 0) {
    if (Array.isArray(template.values)) {
        const element = new InputSelect({ target });
        element.setItems(template.values);
        element.setValue(+value || value || template.values[0]);
        return element;
    }
    if (template.inputType === 'slider' || template.step) {
        const element = new InputSlider({ target });
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
        const element = new InputCurve({ target });
        if ('points' in template)
            element.setAttribute('points', template.points);
        return element;
    }
    if (template.inputType === 'shape') {
        const element = new InputShape({ target });
        if ('points' in template)
            element.setAttribute('points', template.points);
        return element;
    }
    if (template.type === 'number' || typeof template.value === 'number') {
        const element = new InputNumber({ target });
        if ('max' in template)
            element.setAttribute('max', template.max);
        if ('min' in template)
            element.setAttribute('min', template.min);
        if ('step' in template)
            element.setAttribute('step', template.step);
        element.setAttribute('value', value);
        return element;
    }
}

export { InputCurve, InputNumber, InputSelect, InputShape, InputSlider, stateToElement };
//# sourceMappingURL=index.js.map
