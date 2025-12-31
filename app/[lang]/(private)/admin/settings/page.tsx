import { EmailSettingsForm } from '@/app/components/admin/EmailSettingsForm';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Configuración de Emails
        </h1>
        <p className="text-muted-foreground">
          Configura los emails que recibirán notificaciones del formulario de contacto
        </p>
      </div>

      <EmailSettingsForm />
    </div>
  );
}
