import { useEffect } from 'react'

/** Email links may return to the site root; keep all auth callbacks on the login page. */
export function AuthCallback() {
  useEffect(() => {
    if (
      window.location.pathname !== '/login' &&
      /(?:confirmation_token|recovery_token|invite_token|access_token|email_change_token)=/.test(
        window.location.hash,
      )
    ) {
      window.location.replace(`/login${window.location.hash}`)
    }
  }, [])
  return null
}
