const { VITE_API_URL = 'http://localhost:3000' } = import.meta.env;
import userStore from './userStore';
import { browser } from '$app/env';

function parseJwt(token: string) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	var jsonPayload = decodeURIComponent(
		atob(base64)
			.split('')
			.map(function(c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);

	return JSON.parse(jsonPayload);
}

export const store: { token: string } = (() => {
	let token = browser && localStorage.getItem('token');

	function setUserStore() {
		if (!token || token.length < 10) return;
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
async function send({ method, path, data }: SendOptions) {
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

	return fetch(`${VITE_API_URL}/${path}`, opts).then((r) => r.json());
}

export async function login(username: string, password: string) {
	const res = await post('api/auth/login', { username, password });
	store.token = res.access_token;
}

export function logout() { }

export function get(path: string) {
	return send({ method: 'GET', path });
}

export function del(path: string) {
	return send({ method: 'DELETE', path });
}

export function post(path: string, data: any) {
	return send({ method: 'POST', path, data });
}

export function put(path: string, data: any) {
	return send({ method: 'PUT', path, data });
}
