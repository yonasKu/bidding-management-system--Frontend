import { apiFetch } from '@/lib/api'

export type Profile = {
  id: string
  email: string
  role?: 'admin' | 'vendor'
  name?: string
  businessLicenseNumber?: string | null
  tinNumber?: string | null
  licenseFilePath?: string | null
}

export async function getProfile(): Promise<Profile> {
  return apiFetch('/auth/me')
}

export async function updateProfile(payload: { name?: string; businessLicenseNumber?: string | null; tinNumber?: string | null; licenseFilePath?: string | null }): Promise<Profile> {
  return apiFetch('/auth/profile', { method: 'PATCH', body: JSON.stringify(payload) })
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }): Promise<{ success: boolean }> {
  return apiFetch('/auth/change-password', { method: 'POST', body: JSON.stringify(payload) })
}

export async function uploadLicense(file: File): Promise<{ success: boolean; path: string }> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/profile/license`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}
