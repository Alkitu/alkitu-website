'use client';

import { useState } from 'react';
import { StripeSettings } from '@/app/components/admin/billing/StripeSettings';
import { StripeEventsList } from '@/app/components/admin/billing/StripeEventsList';

type Tab = 'settings' | 'events';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('settings');

  return (
    <section id="billing-payments" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Pagos con Stripe</h2>
        <p className="text-muted-foreground">Configuracion de Stripe y registro de eventos webhook</p>
      </div>

      <div className="flex gap-2 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'settings'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Configuracion
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'events'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('events')}
        >
          Eventos
        </button>
      </div>

      {activeTab === 'settings' && <StripeSettings />}
      {activeTab === 'events' && <StripeEventsList />}
    </section>
  );
}
