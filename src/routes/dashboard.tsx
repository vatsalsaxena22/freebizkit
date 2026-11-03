import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { getUser, logout, type User } from '@netlify/identity'
import { FileText, Plus, Trash2, ArrowUpRight, Save, LogOut, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { ContentPage } from '@/components/content-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { workspaceRequest } from '@/lib/workspace'
import { pageHead } from '@/lib/site'
import { CURRENCIES, formatMoney } from '@/lib/format'
import type { Party } from '@/generators/document'
export const Route = createFileRoute('/dashboard')({
  head: () => ({
    ...pageHead({
      title: 'My workspace',
      description: 'Your saved business documents and profile.',
      path: '/dashboard',
    }),
    meta: [{ title: 'My workspace | FreeBizKit' }, { name: 'robots', content: 'noindex' }],
  }),
  component: Page,
})
type Saved = {
  id: string
  kind: string
  number: string
  customer_name: string
  currency: string
  total: string
  updated_at: string
}
type Profile = { from: Party; currency: string; accent: string }
type Workspace = { documents: Saved[]; profile: Profile | null }
const empty: Profile = {
  from: { name: '', email: '', phone: '', address: '', taxId: '' },
  currency: 'USD',
  accent: '#1f7a5a',
}
function Page() {
  const [user, setUser] = useState<User | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const [documents, setDocuments] = useState<Saved[]>([])
  const [profile, setProfile] = useState<Profile>(empty)
  const [busy, setBusy] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  async function load() {
    try {
      const current = await getUser()
      setError('')
      setUser(current)
      if (current) {
        const data = await workspaceRequest<Workspace>()
        setDocuments(data.documents)
        setProfile(data.profile ?? empty)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load your workspace.')
    } finally {
      setLoaded(true)
    }
  }
  useEffect(() => {
    const task = window.setTimeout(() => {
      void load()
    }, 0)
    return () => window.clearTimeout(task)
  }, [])
  return (
    <ContentPage
      eyebrow="YOUR FREE WORKSPACE"
      title={
        user
          ? `Welcome${user.name ? `, ${user.name.split(' ')[0]}` : ''}.`
          : 'A home for your business.'
      }
      intro="Keep your details handy and pick up where you left off."
    >
      {!loaded ? (
        <div className="space-y-4" aria-label="Loading workspace">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : !user ? (
        <div className="max-w-xl rounded-xl border bg-card p-8">
          <FileText className="mb-5 text-primary" size={32} />
          <h2 className="font-display text-2xl font-semibold">Your next invoice starts here.</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Create a free account to save your business details and up to 100 editable documents.
            Your public toolkit is available right now.
          </p>
          <div className="mt-6 flex gap-3">
            <Button asChild>
              <Link to="/login">
                Sign in / Create account <ArrowUpRight />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/tools">Browse tools</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/tools/$slug" params={{ slug: 'invoice-generator' }}>
                  <Plus />
                  New invoice
                </Link>
              </Button>
              <Button
                variant="outline"
                disabled={busy}
                onClick={async () => {
                  try {
                    await logout()
                    window.location.href = '/'
                  } catch {
                    toast.error('Couldn’t sign out. Please try again.')
                  }
                }}
              >
                <LogOut />
                Sign out
              </Button>
            </div>
          </div>
          {error && (
            <div
              role="alert"
              className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm"
            >
              <p>{error}</p>
              <Button size="sm" variant="outline" onClick={() => void load()}>
                <RefreshCw />
                Try again
              </Button>
            </div>
          )}
          <div className="grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
            <section className="rounded-xl border bg-card">
              <div className="border-b p-6">
                <h2 className="font-display text-2xl font-semibold">
                  Saved documents{' '}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {documents.length} / 100
                  </span>
                </h2>
              </div>
              {documents.length === 0 ? (
                <div className="p-10 text-center">
                  <FileText className="mx-auto text-primary" size={30} />
                  <h3 className="mt-4 font-semibold">Your first document is waiting.</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Create an invoice, quote or receipt, then choose Save to workspace.
                  </p>
                  <Button asChild variant="outline" className="mt-5">
                    <Link to="/tools">
                      Create a document <ArrowUpRight />
                    </Link>
                  </Button>
                </div>
              ) : (
                <ul className="divide-y">
                  {documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex flex-wrap items-center justify-between gap-4 p-5"
                    >
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                          {doc.kind}
                        </span>
                        <h3 className="mt-1 text-sm font-semibold">
                          {doc.number} · {doc.customer_name || 'Untitled client'}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatMoney(Number(doc.total), doc.currency)} · Updated{' '}
                          {new Date(doc.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                          <a href={`/tools/${doc.kind}-generator?document=${doc.id}`}>
                            Open <ArrowUpRight size={15} />
                          </a>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Delete ${doc.number}`}
                          onClick={() => setDeleting(doc.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <form
              className="space-y-4 rounded-xl border bg-card p-6"
              onSubmit={async (e) => {
                e.preventDefault()
                setBusy(true)
                try {
                  await workspaceRequest('POST', { action: 'profile', data: profile })
                  toast.success('Business profile saved')
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : 'Couldn’t save profile')
                } finally {
                  setBusy(false)
                }
              }}
            >
              <h2 className="font-display text-xl font-semibold">Your business profile</h2>
              <p className="text-xs leading-6 text-muted-foreground">
                Used as a starting point for new documents.
              </p>
              {(['name', 'email', 'phone', 'taxId'] as const).map((key) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`profile-${key}`}>
                    {
                      {
                        name: 'Business name',
                        email: 'Business email',
                        phone: 'Phone',
                        taxId: 'Tax ID / GSTIN',
                      }[key]
                    }
                  </Label>
                  <Input
                    id={`profile-${key}`}
                    type={key === 'email' ? 'email' : 'text'}
                    maxLength={2000}
                    value={profile.from[key]}
                    onChange={(e) =>
                      setProfile({ ...profile, from: { ...profile.from, [key]: e.target.value } })
                    }
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <Label htmlFor="profile-address">Address</Label>
                <Textarea
                  id="profile-address"
                  maxLength={2000}
                  value={profile.from.address}
                  onChange={(e) =>
                    setProfile({ ...profile, from: { ...profile.from, address: e.target.value } })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-currency">Default currency</Label>
                <select
                  id="profile-currency"
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={profile.currency}
                  onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="profile-accent">Brand color</Label>
                <input
                  id="profile-accent"
                  type="color"
                  value={profile.accent}
                  onChange={(e) => setProfile({ ...profile, accent: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={busy} className="w-full">
                <Save size={16} />
                {busy ? 'Saving…' : 'Save profile'}
              </Button>
              <p className="text-xs leading-5 text-muted-foreground">
                Add your logo in any document generator. Save it to your account to reuse it later.
              </p>
            </form>
          </div>
          <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-lg border p-5">
            <div>
              <h2 className="text-sm font-semibold">Your data, your control</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Clear saved documents, profile and cloud logo. This cannot be undone.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setDeleting('all')}>
              Clear cloud workspace
            </Button>
          </section>
          <p className="mt-4 text-xs text-muted-foreground">
            To close your account,{' '}
            <Link to="/contact" className="underline">
              request account deletion
            </Link>{' '}
            using your account email.
          </p>
          <Dialog
            open={deleting !== null}
            onOpenChange={(open) => {
              if (!open && !busy) setDeleting(null)
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {deleting === 'all' ? 'Clear your cloud workspace?' : 'Delete this document?'}
                </DialogTitle>
                <DialogDescription>
                  {deleting === 'all'
                    ? 'All your saved documents, business profile and cloud logo will be permanently removed. Your sign-in account remains active.'
                    : 'This saved document will be permanently removed. Export a PDF first if you need a copy.'}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" disabled={busy} onClick={() => setDeleting(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true)
                    try {
                      await workspaceRequest(
                        'DELETE',
                        deleting === 'all' ? { all: true } : { id: deleting },
                      )
                      setDeleting(null)
                      await load()
                      toast.success('Deleted')
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : 'Couldn’t delete document')
                    } finally {
                      setBusy(false)
                    }
                  }}
                >
                  {busy ? 'Deleting…' : 'Delete permanently'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </ContentPage>
  )
}
