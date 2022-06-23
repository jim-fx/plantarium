import store from "./store";
const { VITE_API_URL = 'http://localhost:8081' } = import.meta.env;

interface SendOptions {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  isJSON?: boolean;
  mode?: RequestMode;
}

type Response<T = any> = { ok: false, statusCode: number, message: string } | { ok: true, data: T };

export async function send<T>({ method = "GET", path, data, isJSON = true, mode }: SendOptions): Promise<Response<T>> {
  const opts: { method: string; headers: Record<string, string>; body?: string, mode?: RequestMode } = {
    method,
    headers: {}
  };

  if (mode) {
    opts.mode = mode;
  }

  if (data) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(data);
  }

  if (store.token) {
    opts.headers['access-token'] = `Bearer ${store.token}`;
  }

  let url = path.startsWith("http") ? path : `${VITE_API_URL}/${path}`


  const response = await fetch(url, opts);

  if (response.ok) {
    if (isJSON) {
      try {
        const json = await response.json();
        return {
          ok: true,
          data: json
        };
      } catch (err) {
        console.error("Response from " + path + " failed to parse");
        console.error(err);
        return {
          statusCode: 400,
          ok: false,
          message: "Response from " + path + " failed to parse",
        };
      }
    }
  } else {
    if (response.headers.get("Content-Type")?.startsWith("application/json")) {
      const res = await response.json()
      return {
        statusCode: response.status,
        ok: false,
        message: res.message,
      };
    } else {
      const res = await response.text()
      return {
        statusCode: response.status,
        ok: false,
        message: res
      }
    }
  }

}

export function get<T = any>(path: string, options: Partial<SendOptions> = {}) {
  return send<T>({ method: 'GET', path, ...options });
}

export function del<T>(path: string) {
  return send<T>({ method: 'DELETE', path });
}

export function post<T = any>(path: string, data: any) {
  return send<T>({ method: 'POST', path, data });
}

export function put<T>(path: string, data: any) {
  return send<T>({ method: 'PUT', path, data });
}
