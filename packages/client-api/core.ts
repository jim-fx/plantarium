import store from "./store";
const { VITE_API_URL = 'http://localhost:8081' } = import.meta.env;

interface SendOptions {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
  isJSON?: boolean;
  mode?: RequestMode;
}

type Response<T = unknown> = { ok: false, statusCode: number, message: string } | { ok: true, data: T, statusCode: number };

export async function send<T>({ method = "GET", path, data, isJSON = true, mode }: SendOptions): Promise<Response<T>> {
  const opts: { method: string; headers: Record<string, string>; body?: string, mode?: RequestMode } = {
    method,
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (mode) {
    opts.mode = mode;
  }

  if (data) {
    opts.body = JSON.stringify(data);
  }

  if (store.token) {
    opts.headers['access-token'] = `Bearer ${store.token}`;
  }

  const url = path.startsWith("http") ? path : `${VITE_API_URL}/${path}`

  const response = await fetch(url, opts);

  if (response.ok) {
    if (isJSON) {
      try {
        const json = await response.json();
        return {
          ok: true,
          data: json,
          statusCode: response.status
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

export function get<T = unknown>(path: string, options: Partial<SendOptions> = {}) {
  return send<T>({ method: 'GET', path, ...options });
}

export function del<T>(path: string) {
  return send<T>({ method: 'DELETE', path });
}

export function post<T = unknown>(path: string, data: unknown) {
  return send<T>({ method: 'POST', path, data });
}

export function put<T>(path: string, data: unknown) {
  return send<T>({ method: 'PUT', path, data });
}
