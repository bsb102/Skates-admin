import { fetchAuthSession } from "aws-amplify/auth";
import { config } from "./config";

export interface Skate {
  id: number;
  modelo: string;
  marca: string;
  medida: number;
  stock: number;
}

export interface NuevoSkate {
  modelo: string;
  marca: string;
  medida: number;
  stock: number;
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  return fetch(`${config.apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function agregarSkate(datos: NuevoSkate): Promise<Skate> {
  const res = await apiFetch("/api/skate", {
    method: "POST",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const cuerpo = await res.json().catch(() => null);
    throw new Error(cuerpo?.mensaje ?? `El backend respondió ${res.status} al agregar el Skate`);
  }
  return res.json();
}