import { useOutletContext } from 'react-router'

import { authClient } from '@/shared/api/auth-client'

type LayoutSession = ReturnType<typeof authClient.useSession>

export type RootLayoutContext = {
  session: LayoutSession
}

export function useRootLayout() {
  return useOutletContext<RootLayoutContext>()
}
