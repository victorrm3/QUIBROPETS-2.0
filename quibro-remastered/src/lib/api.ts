const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000/api";

type LoginPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

type ApiErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

export async function loginRequest(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as AuthResponse &
    ApiErrorBody;

  if (!response.ok) {
    const firstError = data.errors
      ? Object.values(data.errors)[0]?.[0]
      : undefined;

    throw new Error(firstError || data.message || "No se pudo iniciar sesión.");
  }

  return data;
}

export async function logoutRequest(token: string): Promise<void> {
  await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export type CreateClientPayload = {
  nombre: string;
  email: string;
  password: string;
  serie: number;
  numero_cliente: number;
  poblacion: string;
  is_admin: boolean;
  descuentoQ: number | null;
  descuentoF: number | null;
};

type CreateClientResponse = {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

export async function createClientRequest(
  token: string,
  payload: CreateClientPayload,
): Promise<CreateClientResponse> {
  const response = await fetch(`${API_URL}/clients`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as CreateClientResponse &
    ApiErrorBody;

  if (!response.ok) {
    const firstError = data.errors
      ? Object.values(data.errors)[0]?.[0]
      : undefined;

    throw new Error(firstError || data.message || "No se pudo crear el cliente.");
  }

  return data;
}
