<script lang="ts" context="module">
	export type ThemeSpec = Record<string, StyleSpec>;
	export type StyleSpec = {
		[propOrSelector: string]: string | number | StyleSpec | null;
	};
</script>

<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { EditorView, keymap } from '@codemirror/view';
	import { EditorState, type Extension } from '@codemirror/state';
	import { indentWithTab } from '@codemirror/commands';
	import { indentUnit } from '@codemirror/language';
	import { javascript } from '@codemirror/lang-javascript';
	import { basicSetup } from 'codemirror';

	export let value: string | null | undefined = '';

	export let tabSize = 2;

	export let editable = true;
	export let readonly = false;

	const is_browser = typeof window !== 'undefined';
	const dispatch = createEventDispatcher<{ change: string }>();

	let element: HTMLDivElement;
	let view: EditorView;

	let update_from_prop = false;
	let update_from_state = false;
	let first_update = true;

	$: state_extensions = [
		basicSetup,
		indentUnit.of(' '.repeat(tabSize)),
		EditorView.editable.of(editable),
		EditorState.readOnly.of(readonly),
		keymap.of([indentWithTab]),
		javascript({ typescript: true })
	];

	$: view && update(value);

	onDestroy(() => view?.destroy());

	onMount(() => {
		const on_change = handle_change;

		view = new EditorView({
			parent: element,
			state: create_editor_state(value),
			dispatch(transaction) {
				view.update([transaction]);

				if (!update_from_prop && transaction.docChanged) {
					on_change();
				}
			}
		});
	});

	function update(value: string | null | undefined): void {
		if (first_update) {
			first_update = false;
			return;
		}

		if (update_from_state) {
			update_from_state = false;
			return;
		}

		update_from_prop = true;

		view.setState(create_editor_state(value));

		update_from_prop = false;
	}

	function handle_change(): void {
		const new_value = view.state.doc.toString();
		if (new_value === value) return;

		update_from_state = true;

		value = new_value;
		dispatch('change', value);
	}

	function create_editor_state(value: string | null | undefined): EditorState {
		return EditorState.create({
			doc: value ?? undefined,
			extensions: state_extensions
		});
	}

	function get_theme(
		theme: Extension | null | undefined,
		styles: ThemeSpec | null | undefined
	): Extension[] {
		const extensions: Extension[] = [];
		if (styles) extensions.push(EditorView.theme(styles));
		if (theme) extensions.push(theme);
		return extensions;
	}
</script>

{#if is_browser}
	<div class="codemirror-wrapper" bind:this={element} />
{:else}
	<div class="scm-waiting">
		<div class="scm-waiting__loading scm-loading">
			<div class="scm-loading__spinner" />
			<p class="scm-loading__text">Loading editor...</p>
		</div>

		<pre class="scm-pre cm-editor">{value}</pre>
	</div>
{/if}

<style>
	.codemirror-wrapper :global(.cm-focused) {
		outline: none;
	}

	.scm-waiting {
		position: relative;
	}
	.scm-waiting__loading {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(255, 255, 255, 0.5);
	}

	.scm-loading {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.scm-loading__spinner {
		width: 1rem;
		height: 1rem;
		border-radius: 100%;
		border: solid 2px #000;
		border-top-color: transparent;
		margin-right: 0.75rem;
		animation: spin 1s linear infinite;
	}
	.scm-loading__text {
		font-family: sans-serif;
	}
	.scm-pre {
		font-size: 0.85rem;
		font-family: monospace;
		tab-size: 2;
		-moz-tab-size: 2;
		resize: none;
		pointer-events: none;
		user-select: none;
		overflow: auto;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
