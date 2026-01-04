import { NewsletterSubscribersList } from '@/app/components/organisms/newsletter-subscribers-list/NewsletterSubscribersList';

/**
 * Newsletter Subscribers Admin Page
 *
 * Displays list of all newsletter subscribers with:
 * - Filtering by status and locale
 * - Search by email
 * - Pagination
 * - CSV export
 * - Delete functionality
 */
export default function NewsletterSubscribersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
        <p className="text-muted-foreground">
          Manage your newsletter subscribers
        </p>
      </div>
      <NewsletterSubscribersList />
    </div>
  );
}
