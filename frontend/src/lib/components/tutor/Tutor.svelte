<script lang="ts">
	import { Button, Icon, InputCheckbox } from '@plantarium/ui';
	import { projectManager } from '..';
	import store from './store';

	$: selector = $store && $store.selector;

	$: element = selector && document.querySelector(selector);
	$: elementRect = element && element.getBoundingClientRect();

	$: clickElement = $store && $store.clickSelector && document.querySelector($store.clickSelector);

	$: clickRect = clickElement && clickElement.getBoundingClientRect();

	$: if ($store && $store.clickSelector) {
		const el = document.querySelector($store.clickSelector);
		if (el && el.getAttribute('setup') !== 'true') {
			el.setAttribute('setup', 'true');
			el.addEventListener(
				'click',
				() => {
					setTimeout(() => {
						$store._isCompleted = true;
					}, 20);
				},
				{ once: true }
			);
		}
	}

	$: rect = elementRect || clickRect;

	$: isLeft = rect && rect.left + rect.width > window.innerWidth - 100;

	$: x = rect && (isLeft ? rect.left - 10 : rect.left + rect.width + 10);

	$: checks = $store && $store.checks;

	$: checks &&
		checks.forEach((c, i) => {
			if (c._isSetup) return c;
			c._isSetup = true;
			c.setup(
				() => {
					checks[i]._isCompleted = true;
					checks = checks;
				},
				{ pm: projectManager, c: $store }
			);
			return c;
		});

	$: active = !!rect;
</script>

{#if active}
	<span class:isLeft class:hasElement={!!element} class:hasClick={!!clickRect}>
		{#if clickRect}
			<div
				class="click-wrapper"
				style={`top: ${rect.top + 20}px; left: ${x - (isLeft ? 20 : -0)}px;`}
			>
				<Icon name="pointing" --fill={'#303030'} />
			</div>
		{/if}

		<div class="wrapper" style={`left: ${x}px; top: ${rect.top + 20}px;`}>
			<div class="close-wrapper">
				<Button
					icon="cross"
					--foreground-color="transparent"
					on:click={() => {
						active = false;
					}}
				/>
			</div>

			<p>{@html $store.description}</p>

			{#if checks}
				<div class="checks-wrapper">
					{#each checks as check}
						<div class="check-wrapper" class:is-completed={check._isCompleted}>
							<InputCheckbox bind:value={check._isCompleted} />
							<p>{check.description}</p>
						</div>
					{/each}
				</div>
			{/if}

			{#if !clickElement}
				<div class="next-wrapper">
					<Button
						on:click={() => ($store._isCompleted = true)}
						name="next"
						--text={'white'}
						--bg={'#303030'}
					/>
				</div>
			{/if}
		</div>

		{#if rect && element}
			<span
				class="highlighter "
				style={`width: ${rect.width}px; height: ${rect.height}px; left: ${rect.left}px; top: ${rect.top}px;`}
			/>
		{/if}
	</span>
{/if}

<style lang="scss">
	@use '~@plantarium/theme/src/themes.module.scss';

	.close-wrapper {
		width: 40px;
		position: absolute;
		right: 5px;
		top: 5px;
	}

	span {
		position: absolute;
		top: 0px;
		left: 0px;
		height: 100vh;
		width: 100vw;
		color: #303030;
	}

	@keyframes cursorAnim {
		0% {
			transform: scale(1);
			filter: drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.8));
		}
		10% {
			transform: scale(0.8);
			filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.8));
		}
		20% {
			transform: scale(1);
			filter: drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.8));
		}
		100% {
			transform: scale(1);
			filter: drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.8));
		}
	}

	.click-wrapper {
		position: absolute;
		width: 60px;
		pointer-events: none;
		transform: rotate(-50deg) translateX(-10px);
		z-index: 10000;

		:global(.icon-wrapper) {
			animation: cursorAnim 4s ease infinite;
		}
	}

	.isLeft .click-wrapper {
		transform: rotate(50deg) translateX(-10px);
	}

	.checks-wrapper {
		margin-top: 10px;
	}

	.next-wrapper {
		padding-top: 25px;
	}

	.check-wrapper {
		display: flex;
		padding-top: 10px;

		> p {
			margin-left: 10px;
		}

		&.is-completed {
			text-decoration: line-through;
			text-decoration-color: #303030;
		}
	}

	.hasClick > .wrapper {
		transform: translate(40px, 10px);
	}

	.isLeft .wrapper {
		transform: translateX(calc(-100%));
	}

	.wrapper {
		position: absolute;
		min-width: 200px;
		max-width: 250px;
		background-color: var(--accent);
		border-radius: 20px;
		z-index: 1000;
		box-sizing: border-box;

		padding: 30px;
	}

	.highlighter {
		left: 0px;
		top: 50px;
		border: solid 7px;
		box-sizing: border-box;

		border-color: var(--accent);

		z-index: 999;
		pointer-events: none;
	}
</style>
