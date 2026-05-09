import { supabaseAnonKey, supabaseUrl } from './env'

export const storageKeys = {
  accessToken: 'jutjanops-access-token',
  storeId: 'jutjanops-store-id',
}

export function getAccessToken() {
  return globalThis.localStorage.getItem(storageKeys.accessToken) ?? ''
}

export function setAccessToken(token: string) {
  globalThis.localStorage.setItem(storageKeys.accessToken, token)
}

export function syncAccessToken(token?: string) {
  if (token) {
    setAccessToken(token)
  } else {
    globalThis.localStorage.removeItem(storageKeys.accessToken)
  }
}

export function getStoreId() {
  return globalThis.localStorage.getItem(storageKeys.storeId) ?? ''
}

export function setStoreId(storeId: string) {
  globalThis.localStorage.setItem(storageKeys.storeId, storeId)
  globalThis.dispatchEvent(new Event('jutjanops-store'))
}

function getBaseUrl() {
  if (!supabaseUrl) {
    throw new Error('Missing VITE_SUPABASE_URL')
  }
  return `${supabaseUrl.replace(/\/$/, '')}/rest/v1`
}

function buildHeaders() {
  if (!supabaseAnonKey) {
    throw new Error('Missing VITE_SUPABASE_ANON_KEY')
  }
  const headers: Record<string, string> = {
    apikey: supabaseAnonKey,
    'Content-Type': 'application/json',
  }
  const token = getAccessToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export async function supabaseGet<T>(path: string, params?: Record<string, string>) {
  const url = new URL(`${getBaseUrl()}${path}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
  }
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: buildHeaders(),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  const text = await response.text()
  if (!text) {
    return [] as T
  }
  return JSON.parse(text) as T
}

export async function supabasePost<T>(path: string, payload: unknown) {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  const text = await response.text()
  if (!text) {
    return [] as T
  }
  return JSON.parse(text) as T
}

export async function supabaseRpc<T>(fn: string, payload?: Record<string, unknown>) {
  return supabasePost<T>(`/rpc/${fn}`, payload ?? {})
}

export async function supabasePatch<T>(path: string, payload: unknown, customHeaders?: Record<string, string>) {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: 'PATCH',
    headers: { ...buildHeaders(), ...customHeaders },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  const text = await response.text()
  if (!text) {
    return [] as T
  }
  return JSON.parse(text) as T
}

export async function supabaseDelete<T>(path: string) {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  const text = await response.text()
  if (!text) {
    return [] as T
  }
  return JSON.parse(text) as T
}
