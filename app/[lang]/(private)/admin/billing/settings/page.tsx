import { BillingSettingsForm } from '@/app/components/admin/billing/BillingSettingsForm';

export default function BillingSettingsPage() {
  return (
    <section id="billing-settings" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Configuracion de Facturacion</h2>
        <p className="text-muted-foreground">Datos fiscales, conexion Verifacti y valores por defecto</p>
      </div>
      <BillingSettingsForm />
    </section>
  );
}
