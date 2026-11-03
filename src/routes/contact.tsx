import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Send, CheckCircle2, MessageSquare } from 'lucide-react'
import { ContentPage } from '@/components/content-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { pageHead } from '@/lib/site'
export const Route = createFileRoute('/contact')({
  head: () =>
    pageHead({
      title: 'Contact & suggest a tool',
      description:
        'Share feedback, report an issue, or suggest a free business tool for FreeBizKit.',
      path: '/contact',
    }),
  component: Page,
})
function Page() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  return (
    <ContentPage
      eyebrow="WE’RE LISTENING"
      title="What’s on your mind?"
      intro="A question, a rough edge, or a tool you wish existed. We’d love to hear it."
    >
      <div className="grid max-w-4xl gap-10 md:grid-cols-[1.5fr_1fr]">
        {status === 'success' ? (
          <div role="status" className="rounded-xl border bg-card p-10">
            <CheckCircle2 className="mb-5 text-primary" size={35} />
            <h2 className="font-display text-2xl font-semibold">Message received.</h2>
            <p className="my-4 text-muted-foreground">
              Thanks for helping us build a more useful toolkit.
            </p>
            <Button variant="outline" onClick={() => setStatus('idle')}>
              Send another message
            </Button>
          </div>
        ) : (
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            className="space-y-5 rounded-xl border bg-card p-7"
            onSubmit={async (e) => {
              e.preventDefault()
              const form = e.currentTarget
              setStatus('pending')
              try {
                const data = new URLSearchParams()
                new FormData(form).forEach((v, k) => data.set(k, String(v)))
                const res = await fetch('/__forms.html', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: data.toString(),
                })
                if (!res.ok) throw new Error()
                setStatus('success')
              } catch {
                setStatus('error')
              }
            }}
          >
            <input type="hidden" name="form-name" value="contact" />
            <div hidden>
              <label>
                Leave empty
                <input name="bot-field" />
              </label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-name">Your name</Label>
              <Input id="contact-name" name="name" required maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" name="email" type="email" required maxLength={254} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-category">I’m here to…</Label>
              <select
                id="contact-category"
                name="category"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option>Share feedback</option>
                <option>Suggest a tool</option>
                <option>Report a problem</option>
                <option>Request account deletion</option>
                <option>Ask a question</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Your message</Label>
              <Textarea
                id="contact-message"
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={5}
              />
            </div>
            {status === 'error' && (
              <p role="alert" className="text-sm text-destructive">
                Your message couldn’t be sent. Please try again in a moment.
              </p>
            )}
            <p className="text-xs leading-5 text-muted-foreground">
              Please leave out sensitive financial details. Your message is processed to respond to
              your request.
            </p>
            <Button type="submit" disabled={status === 'pending'}>
              {status === 'pending' ? 'Sending…' : 'Send message'}
              <Send size={16} />
            </Button>
          </form>
        )}
        <aside className="pt-3">
          <MessageSquare className="mb-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">Built with your input</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            The best tools solve real, everyday problems. If there’s a small task taking up too much
            of your day, tell us about it.
          </p>
          <p className="mt-6 text-xs leading-6 text-muted-foreground">
            Looking for help with an invoice? Add your business details, list your items, and choose
            Download PDF. In the print window, select Save as PDF.
          </p>
        </aside>
      </div>
    </ContentPage>
  )
}
