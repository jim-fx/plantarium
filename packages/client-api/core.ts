import store from "./store";
const { VITE_API_URL = 'http://127.0.0.1:8081' } = import.meta.env;

interface SendOptions {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
  isJSON?: boolean;
  mode?: RequestMode;
}

export type ErrorResponse = {
  ok: false,
  statusCode: number;
  message: string;
}

export type SuccessResponse<T = unknown> = {
  ok: true,
  statusCode: number;
  data: T
}

export type Response<T = unknown> = ErrorResponse | SuccessResponse<T>;

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

  try {

    const response = await fetch(url, opts);

    if (response.ok) {
      if (isJSON) {
        try {
          const json = await response.json();
          return {
            ok: true,
            statusCode: response.status,
            data: json,
          };
        } catch (err) {
          return {
            ok: false,
            statusCode: 400,
            message: "Response from " + path + " failed to parse",
          };
        }
      }
    } else {
      if (response.headers.get("Content-Type")?.startsWith("application/json")) {
        const res = await response.json()
        return {
          ok: false,
          statusCode: response.status,
          message: res.message,
        };
      } else {
        const res = await response.text()
        return {
          ok: false,
          statusCode: response.status,
          message: res
        }
      }
    }


  } catch (error) {
    return {
      ok: false,
      statusCode: 400,
      message: "Fetch failed"
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
