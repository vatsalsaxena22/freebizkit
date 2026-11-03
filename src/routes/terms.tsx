import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/content-page'
import { pageHead } from '@/lib/site'
export const Route = createFileRoute('/terms')({
  head: () =>
    pageHead({
      title: 'Terms of Use',
      description: 'Last updated November 3, 2026. By using FreeBizKit, you agree to these terms.',
      path: '/terms',
    }),
  component: Page,
})
function Page() {
  return (
    <ContentPage
      eyebrow="FREEBIZKIT / TERMS"
      title="A few ground rules."
      intro="Last updated November 3, 2026. By using FreeBizKit, you agree to these terms."
    >
      <div className="max-w-reading space-y-9">
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">Using the tools</h2>
          <p className="leading-7 text-muted-foreground">
            You may use FreeBizKit to create your own business documents and calculations for lawful
            purposes. You remain responsible for the information you enter and the documents you
            send. Do not upload content you have no right to use or attempt to access another user’s
            data.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">Calculations and documents</h2>
          <p className="leading-7 text-muted-foreground">
            Results are provided for general planning and convenience. They are not tax, accounting,
            legal, financial or employment advice. Check applicable tax rates, rounding requirements
            and mandatory invoice fields with a qualified professional before relying on an output.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">Your content and account</h2>
          <p className="leading-7 text-muted-foreground">
            You keep ownership of your document content and logos. By saving them, you authorize us
            and our hosting providers to store and process them to provide the service. Keep your
            credentials secure. Export copies of important documents and avoid using the service as
            your only archive.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">Availability and limits</h2>
          <p className="leading-7 text-muted-foreground">
            The core public toolkit is free. Optional cloud accounts have fair-use limits, including
            100 saved documents and a 300 KB logo. We may change features, impose reasonable limits,
            or suspend abusive use. Service may be interrupted or unavailable; we do not guarantee
            uninterrupted access.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">Responsibility and contact</h2>
          <p className="leading-7 text-muted-foreground">
            The service is provided as available without warranties to the extent permitted by law.
            We are not responsible for losses resulting from inaccurate inputs or reliance on
            generated outputs. Nothing in these terms excludes rights or liabilities that cannot
            lawfully be excluded. Contact us through the contact page for questions or account
            deletion requests.
          </p>
        </section>
      </div>
    </ContentPage>
  )
}
