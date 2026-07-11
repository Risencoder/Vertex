import { createAuthClient } from 'better-auth/react'

import { API_BASE_URL } from '@/shared/config/api'

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  fetchOptions: {
    credentials: 'include',
  },
})
