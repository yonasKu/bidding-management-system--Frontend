export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';
if (typeof window !== 'undefined') {
  console.log('API_BASE', API_BASE)
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = `${API_BASE}${path}`
  console.log('apiFetch request', { url, method: init.method ?? 'GET' })
  let res: Response
  try {
    res = await fetch(url, {
      ...init,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    })
  } catch (error) {
    console.error('apiFetch network error', { url, error })
    throw error
  }
  if (!res.ok) {
    let err: any;
    try {
      err = await res.json();
    } catch {
      err = { message: res.statusText } as any;
    }
    console.error('apiFetch HTTP error', { url, status: res.status, body: err })
    throw err;
  }
  return res.json();
}

export async function apiUpload(path: string, formData: FormData, init: RequestInit = {}) {
  const url = `${API_BASE}${path}`
  console.log('apiUpload request', { url, method: init.method ?? 'POST' })
  let res: Response
  try {
    res = await fetch(url, {
      ...init,
      method: init.method ?? 'POST',
      credentials: 'include',
      body: formData,
    })
  } catch (error) {
    console.error('apiUpload network error', { url, error })
    throw error
  }
  if (!res.ok) {
    let err: any;
    try {
      err = await res.json();
    } catch {
      err = { message: res.statusText } as any;
    }
    console.error('apiUpload HTTP error', { url, status: res.status, body: err })
    throw err;
  }
  return res.json();
}
