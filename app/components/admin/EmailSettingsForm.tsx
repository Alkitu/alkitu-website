'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { EmailSettings } from '@/lib/resend';

export function EmailSettingsForm() {
  const [formData, setFormData] = useState<Partial<EmailSettings>>({
    from_email: '',
    to_emails: [],
    cc_emails: [],
    bcc_emails: [],
    email_domain: 'alkitu.com',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Temporary state for textarea inputs (arrays displayed as comma-separated)
  const [toEmailsText, setToEmailsText] = useState('');
  const [ccEmailsText, setCcEmailsText] = useState('');
  const [bccEmailsText, setBccEmailsText] = useState('');

  const supabase = createClient();

  // Fetch current settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('email_settings')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching email settings:', error);
          toast.error('Error al cargar configuración de emails');
          return;
        }

        if (data) {
          setFormData(data);
          setToEmailsText(data.to_emails?.join(', ') || '');
          setCcEmailsText(data.cc_emails?.join(', ') || '');
          setBccEmailsText(data.bcc_emails?.join(', ') || '');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('Error inesperado al cargar configuración');
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // Validate email format
  function isValidEmail(email: string): boolean {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  }

  // Validate email ends with domain
  function validateEmailDomain(email: string, domain: string): boolean {
    return email.endsWith(`@${domain}`);
  }

  // Parse comma-separated emails to array
  function parseEmailsText(text: string): string[] {
    return text
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);
  }

  // Validate form data
  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    // Validate from_email
    if (!formData.from_email) {
      newErrors.from_email = 'El email de envío es requerido';
    } else if (!isValidEmail(formData.from_email)) {
      newErrors.from_email = 'Formato de email inválido';
    } else if (!validateEmailDomain(formData.from_email, formData.email_domain || 'alkitu.com')) {
      newErrors.from_email = `El email debe terminar en @${formData.email_domain}`;
    }

    // Validate to_emails
    const toEmails = parseEmailsText(toEmailsText);
    if (toEmails.length === 0) {
      newErrors.to_emails = 'Debe haber al menos un email de destino';
    } else {
      const invalidToEmails = toEmails.filter((email) => !isValidEmail(email));
      if (invalidToEmails.length > 0) {
        newErrors.to_emails = `Emails inválidos: ${invalidToEmails.join(', ')}`;
      }
    }

    // Validate cc_emails (optional, but if provided must be valid)
    const ccEmails = parseEmailsText(ccEmailsText);
    if (ccEmails.length > 0) {
      const invalidCcEmails = ccEmails.filter((email) => !isValidEmail(email));
      if (invalidCcEmails.length > 0) {
        newErrors.cc_emails = `Emails inválidos: ${invalidCcEmails.join(', ')}`;
      }
    }

    // Validate bcc_emails (optional, but if provided must be valid)
    const bccEmails = parseEmailsText(bccEmailsText);
    if (bccEmails.length > 0) {
      const invalidBccEmails = bccEmails.filter((email) => !isValidEmail(email));
      if (invalidBccEmails.length > 0) {
        newErrors.bcc_emails = `Emails inválidos: ${invalidBccEmails.join(', ')}`;
      }
    }

    // Validate email_domain
    if (!formData.email_domain) {
      newErrors.email_domain = 'El dominio de email es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setSaving(true);

    try {
      const toEmails = parseEmailsText(toEmailsText);
      const ccEmails = parseEmailsText(ccEmailsText);
      const bccEmails = parseEmailsText(bccEmailsText);

      const { error } = await supabase
        .from('email_settings')
        .update({
          from_email: formData.from_email,
          to_emails: toEmails,
          cc_emails: ccEmails,
          bcc_emails: bccEmails,
          email_domain: formData.email_domain,
          updated_at: new Date().toISOString(),
        })
        .eq('id', '00000000-0000-0000-0000-000000000001');

      if (error) {
        console.error('Error updating email settings:', error);
        toast.error('Error al guardar configuración');
        return;
      }

      toast.success('Configuración guardada exitosamente');
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Error inesperado al guardar configuración');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Cargando configuración...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email de Envío</CardTitle>
          <CardDescription>
            Email desde el cual se enviarán las notificaciones (debe terminar en @{formData.email_domain})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from_email">
              Email de Envío <span className="text-destructive">*</span>
            </Label>
            <Input
              id="from_email"
              type="email"
              placeholder="info@alkitu.com"
              value={formData.from_email}
              onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
              className={errors.from_email ? 'border-destructive' : ''}
            />
            {errors.from_email && (
              <p className="text-sm text-destructive">{errors.from_email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email_domain">Dominio Permitido</Label>
            <Input
              id="email_domain"
              type="text"
              placeholder="alkitu.com"
              value={formData.email_domain}
              onChange={(e) => setFormData({ ...formData, email_domain: e.target.value })}
              className={errors.email_domain ? 'border-destructive' : ''}
            />
            {errors.email_domain && (
              <p className="text-sm text-destructive">{errors.email_domain}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Solo se permitirán emails que terminen en @{formData.email_domain}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Destinatarios de Notificaciones</CardTitle>
          <CardDescription>
            Emails que recibirán notificaciones cuando alguien envíe el formulario de contacto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="to_emails">
              Para (TO) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="to_emails"
              type="text"
              placeholder="info@alkitu.com, admin@alkitu.com"
              value={toEmailsText}
              onChange={(e) => setToEmailsText(e.target.value)}
              className={errors.to_emails ? 'border-destructive' : ''}
            />
            {errors.to_emails && (
              <p className="text-sm text-destructive">{errors.to_emails}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Separa múltiples emails con comas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cc_emails">Copia (CC)</Label>
            <Input
              id="cc_emails"
              type="text"
              placeholder="team@alkitu.com"
              value={ccEmailsText}
              onChange={(e) => setCcEmailsText(e.target.value)}
              className={errors.cc_emails ? 'border-destructive' : ''}
            />
            {errors.cc_emails && (
              <p className="text-sm text-destructive">{errors.cc_emails}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Opcional: Emails en copia (visibles para todos)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bcc_emails">Copia Oculta (BCC)</Label>
            <Input
              id="bcc_emails"
              type="text"
              placeholder="archive@alkitu.com"
              value={bccEmailsText}
              onChange={(e) => setBccEmailsText(e.target.value)}
              className={errors.bcc_emails ? 'border-destructive' : ''}
            />
            {errors.bcc_emails && (
              <p className="text-sm text-destructive">{errors.bcc_emails}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Opcional: Emails en copia oculta (no visibles para otros destinatarios)
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </form>
  );
}
