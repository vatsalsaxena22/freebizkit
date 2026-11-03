import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/content-page'
import { pageHead } from '@/lib/site'
export const Route = createFileRoute('/privacy')({
  head: () =>
    pageHead({
      title: 'Privacy Policy',
      description:
        'Last updated November 3, 2026. This policy explains what FreeBizKit processes when you use our tools.',
      path: '/privacy',
    }),
  component: Page,
})
function Page() {
  return (
    <ContentPage
      eyebrow="FREEBIZKIT / PRIVACY"
      title="Privacy, in plain language."
      intro="Last updated November 3, 2026. This policy explains what FreeBizKit processes when you use our tools."
    >
      <div className="max-w-reading space-y-9">
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">Browser tools</h2>
          <p className="leading-7 text-muted-foreground">
            Calculator inputs and document editing run in your browser. We do not automatically
            upload your document content or calculator inputs. Unsaved edits disappear when you
            leave or refresh. Print and PDF export use your browser’s print dialog.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">Optional accounts and saving</h2>
          <p className="leading-7 text-muted-foreground">
            If you create an account, Netlify Identity processes your email, credentials and
            authentication session. We never store plaintext passwords in the application database.
            When you explicitly save, we store your document data, business profile and any uploaded
            logo using Netlify Database and Netlify Blobs. Authentication uses necessary cookies and
            browser session storage.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">Contact and feedback</h2>
          <p className="leading-7 text-muted-foreground">
            Messages you submit include the name, email, category and message you provide. Netlify
            Forms processes these submissions with spam filtering. Do not submit confidential client
            or financial information through a feedback form.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">
            Access, retention and deletion
          </h2>
          <p className="leading-7 text-muted-foreground">
            Saved documents remain until you delete them. You can delete documents and your cloud
            workspace from the dashboard. To request account deletion or access to your stored
            information, use the contact form with the email associated with your account. Hosting
            logs and backups may persist according to the provider’s retention policies.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">
            Service providers and changes
          </h2>
          <p className="leading-7 text-muted-foreground">
            Netlify provides hosting, authentication, database, file storage and form processing.
            Fonts load from Google Fonts, which may receive your IP address and browser information
            when serving font files. We do not sell your personal information. This release does not
            include advertising trackers or optional analytics. We may update this policy as
            features change. Contact us through the contact page for privacy questions.
          </p>
        </section>
      </div>
    </ContentPage>
  )
}
