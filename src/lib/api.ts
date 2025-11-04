export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3000';

export async function apiFetch(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  if (!res.ok) {
    let err: any;
    try {
      err = await res.json();
    } catch {
      err = { message: res.statusText } as any;
    }
    throw err;
  }
  return res.json();
}

export async function apiUpload(path: string, formData: FormData, init: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    method: init.method ?? 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) {
    let err: any;
    try {
      err = await res.json();
    } catch {
      err = { message: res.statusText } as any;
    }
    throw err;
  }
  return res.json();
}
