const { VITE_API_URL = 'http://localhost:3000' } = import.meta.env;
import { getBrowser } from './helper';
import { userStore } from './user-store';

function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

const browser = getBrowser();

export const store: { token: string } = (() => {
  let token = browser && localStorage.getItem('token');

  function setUserStore() {
    if (!token || token.length < 10) {
      userStore.set({});
      return;
    }
    const parsed = parseJwt(token);
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
  isJSON?: boolean;
}

export async function send({ method, path, data, isJSON = true }: SendOptions) {
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

  if (response.ok) {
    if (isJSON) {
      try {
        return await response.json();
      }catch(err){
        console.error("Response from "+path+" failed to parse");
        console.error(err);
      }
    }
    return response.text();
  }

  const json = await response.json();

  console.error(json);
  return json;

}

export function get(path: string,options:Partial<SendOptions> = {}) {
  return send({ method: 'GET', path,...options });
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
