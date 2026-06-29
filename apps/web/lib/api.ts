export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export function authHeaders(email?: string | null): HeadersInit {
    return email ? { 'x-user-email': email } : {}
}