'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_login_at: string | null;
}

interface UserEditProps {
  userId: string;
}

export function UserEdit({ userId }: UserEditProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchUser();
    fetchCurrentUser();
  }, [userId]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
    }
  };

  const fetchUser = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error?.message || 'Failed to fetch user');
      }

      const result = await response.json();
      setUser(result.data);
      setFormData({
        full_name: result.data.full_name || '',
        email: result.data.email || '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Error al cargar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    if (!formData.password && !formData.confirmPassword) {
      setPasswordError(null);
      return true;
    }

    if (formData.password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return false;
    }

    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validatePassword()) {
      return;
    }

    setSaving(true);

    try {
      const updateData: any = {
        full_name: formData.full_name,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error?.message || 'Failed to update user');
      }

      setSuccess(true);
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));

      setTimeout(() => {
        router.push(`/admin/users/${userId}`);
      }, 1500);
    } catch (error: any) {
      console.error('Error updating user:', error);
      setError(error.message || 'Error al actualizar el usuario');
    } finally {
      setSaving(false);
    }
  };

  const isOwnProfile = currentUserId === userId;
  const canChangePassword = isOwnProfile;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">
            Cargando datos del usuario...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">
            Usuario no encontrado
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/admin/users/${userId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Detalles
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-600 dark:text-green-400">
            Usuario actualizado correctamente
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Editar Usuario</CardTitle>
            <CardDescription>
              Actualiza la información del usuario administrador
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* General Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Información General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nombre Completo</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Nombre completo del usuario"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="usuario@ejemplo.com"
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Seguridad</h3>
              {!canChangePassword && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Solo puedes cambiar tu propia contraseña
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nueva Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onBlur={validatePassword}
                    placeholder="Dejar vacío para no cambiar"
                    disabled={!canChangePassword}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    onBlur={validatePassword}
                    placeholder="Confirmar nueva contraseña"
                    disabled={!canChangePassword}
                  />
                </div>
              </div>

              {passwordError && (
                <p className="text-sm text-destructive mt-2">{passwordError}</p>
              )}

              {canChangePassword && (
                <p className="text-sm text-muted-foreground mt-2">
                  Dejar vacío para mantener la contraseña actual
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <span className="mr-2">Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/users/${userId}`)}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  );
}
