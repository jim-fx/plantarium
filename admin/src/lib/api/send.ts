const { VITE_API_URL = 'http://localhost:3000' } = import.meta.env;
import userStore from '../userStore';
import { browser } from '$app/env';

function parseJwt(token: string) {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload = decodeURIComponent(
		atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);

	return JSON.parse(jsonPayload);
}

export const store: { token: string } = (() => {
	let token = browser && localStorage.getItem('token');

	function setUserStore() {
		if (!token || token.length < 10) {
			userStore.set(undefined);
			return;
		}
		const parsed = parseJwt(token);
		console.log('Parsed', parsed);
		userStore.set({ username: parsed.username, id: parsed.sub });
	}

	setUserStore();

	return {
		set token(v) {
			token = v;
			browser && localStorage.setItem('token', v);
			setUserStore();
		},
		get token() {
			return token;
		}
	};
})();

interface SendOptions {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	data?: any;
}
export async function send({ method, path, data }: SendOptions) {
	const opts: { method: string; headers: Record<string, string>; body?: string } = {
		method,
		headers: {}
	};

	if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	if (store.token) {
		opts.headers['access-token'] = `Bearer ${store.token}`;
	}

	const response = await fetch(`${VITE_API_URL}/${path}`, opts);

  if(response.ok){
    return response.json();
  }

  const json = await response.json();

  console.error(json);
  return json;

}

