<style global>
	:root {
		--dark-gray: #303030;
		--medium-gray: #4b4b4b;
		--light-gray: #cccccc;
		--border-radius: 2px;

		--yellow: #fffd7b;

		--red-light: #e26565;
		--red-dark: #b74141;

		--green-light: #65e2a0;
		--green-dark: #469c6e;
		--green-gradient: linear-gradient(45deg, var(--green-light), var(--green-dark));
	}

	:global(.theme-dark) {
		--background-color: #141516;
		--midground-color: #242729;
		--accent: var(--green-dark);
		--accent-dark: var(--green-light);
		--error: var(--red-dark);
		--foreground-color: #33373a;
		--outline-color: #212121;
		--text-color: #ffffff;
		--text-color-invert: #303030;
		--shadow: 0px 0px 2px rgba(0, 0, 0, 0.7);
	}

	:global(.theme-light) {
		--background-color: #d0d0d0;
		--midground-color: white;
		--accent: var(--green-light);
		--accent-dark: var(--green-dark);
		--error: var(--red-light);
		--foreground-color: #e8e8e8;
		--outline-color: #b9b9b9;
		--text-color: #484848;
		--text-color-invert: white;
		--shadow: 0px 0px 5px rgba(0, 0, 0, 0.144);
	}

	:global(.theme-pinky) {
		--background-color: #d0d0d0;
		--foreground-color: pink;
		--outline-color: #b9b9b9;
		--text-color: #484848;
		--shadow: 0px 0px 5px rgba(0, 0, 0, 0.144);
	}
</style>
