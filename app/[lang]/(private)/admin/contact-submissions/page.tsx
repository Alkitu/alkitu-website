import { ContactSubmissionsList } from '@/app/components/admin';

export default function ContactSubmissionsPage() {
  return (
    <>
      <section id="contact-submissions" className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Mensajes de Contacto
          </h2>
          <ContactSubmissionsList />
        </div>
      </section>
    </>
  );
}
