import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  login,
  signup,
  getUser,
  handleAuthCallback,
  requestPasswordRecovery,
  updateUser,
  acceptInvite,
} from '@netlify/identity'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { ContentPage } from '@/components/content-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { pageHead } from '@/lib/site'
export const Route = createFileRoute('/login')({
  head: () => ({
    ...pageHead({
      title: 'Sign in to your workspace',
      description:
        'Save your business profile and editable documents with a free FreeBizKit account.',
      path: '/login',
    }),
    meta: [
      ...pageHead({
        title: 'Sign in',
        description: 'Your FreeBizKit workspace.',
        path: '/login',
      }).meta,
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: Page,
})
function Page() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset' | 'invite'>('login')
  const [token, setToken] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => {
    let active = true
    void (async () => {
      try {
        const result = await handleAuthCallback()
        if (!active) return
        if (result?.type === 'recovery') {
          setMode('reset')
          return
        }
        if (result?.type === 'invite') {
          setToken(result.token ?? '')
          setMode('invite')
          return
        }
        if (await getUser()) window.location.href = '/dashboard'
      } catch {
        if (active) setError('This account link is invalid or has expired. Request a new link.')
      }
    })()
    return () => {
      active = false
    }
  }, [])
  const heading =
    mode === 'signup'
      ? 'A home for your hard work.'
      : mode === 'forgot'
        ? 'Let’s get you back in.'
        : mode === 'reset' || mode === 'invite'
          ? 'Choose a new password.'
          : 'Good to see you again.'
  return (
    <ContentPage
      eyebrow="YOUR FREE WORKSPACE"
      title={heading}
      intro="Your documents and business details, ready when you are. Public tools are always available without an account."
    >
      <div className="grid max-w-4xl gap-12 md:grid-cols-2">
        <form
          className="space-y-5 rounded-xl border bg-card p-7"
          onSubmit={async (e) => {
            e.preventDefault()
            setPending(true)
            setError('')
            setMessage('')
            const data = new FormData(e.currentTarget)
            const email = String(data.get('email') ?? '')
            const password = String(data.get('password') ?? '')
            try {
              if (mode === 'forgot') {
                await requestPasswordRecovery(email)
                setMessage('If an account exists, you’ll receive a password reset link.')
              } else if (mode === 'reset') {
                await updateUser({ password })
                window.location.href = '/dashboard'
              } else if (mode === 'invite') {
                await acceptInvite(token, password)
                window.location.href = '/dashboard'
              } else if (mode === 'signup') {
                const user = await signup(email, password, {
                  full_name: String(data.get('name')),
                })
                if (user.confirmedAt) window.location.href = '/dashboard'
                else setMessage('Check your email to confirm your account, then sign in.')
              } else {
                await login(email, password)
                window.location.href = '/dashboard'
              }
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Unable to continue. Please try again.')
            } finally {
              setPending(false)
            }
          }}
        >
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="auth-name">Your name</Label>
              <Input id="auth-name" name="name" autoComplete="name" required maxLength={100} />
            </div>
          )}
          {mode !== 'reset' && mode !== 'invite' && (
            <div className="space-y-2">
              <Label htmlFor="auth-email">Email</Label>
              <Input id="auth-email" name="email" type="email" autoComplete="email" required />
            </div>
          )}
          {mode !== 'forgot' && (
            <div className="space-y-2">
              <Label htmlFor="auth-password">Password</Label>
              <Input
                id="auth-password"
                name="password"
                type="password"
                minLength={mode === 'login' ? 1 : 10}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />
              {mode !== 'login' && (
                <p className="text-xs text-muted-foreground">Use at least 10 characters.</p>
              )}
            </div>
          )}
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm text-primary" role="status">
              {message}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending
              ? 'Please wait…'
              : mode === 'signup'
                ? 'Create free account'
                : mode === 'forgot'
                  ? 'Send reset link'
                  : mode === 'reset' || mode === 'invite'
                    ? 'Save password'
                    : 'Sign in'}
            <ArrowRight size={16} />
          </Button>
          <div className="flex flex-wrap justify-between gap-3 text-xs">
            {mode === 'login' ? (
              <>
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => {
                    setMode('signup')
                    setError('')
                    setMessage('')
                  }}
                >
                  Create an account
                </button>
                <button
                  type="button"
                  className="text-muted-foreground underline"
                  onClick={() => {
                    setMode('forgot')
                    setError('')
                    setMessage('')
                  }}
                >
                  Forgot password?
                </button>
              </>
            ) : (
              <button
                type="button"
                className="text-primary underline"
                onClick={() => {
                  setMode('login')
                  setError('')
                  setMessage('')
                }}
              >
                Back to sign in
              </button>
            )}
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
        <aside className="space-y-5 pt-5">
          <ShieldCheck size={30} className="text-primary" />
          <h2 className="font-display text-2xl font-semibold">Less typing next time.</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Save your business profile, keep up to 100 editable documents, and reuse your logo. No
            payment details required.
          </p>
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            Just here for the tools? <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </ContentPage>
  )
}
