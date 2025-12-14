'use client';

import { useEffect } from 'react';

export function UpdateLastLogin() {
  useEffect(() => {
    const updateLastLogin = async () => {
      try {
        await fetch('/api/admin/update-last-login', {
          method: 'POST',
        });
      } catch (error) {
        console.error('Error updating last login:', error);
      }
    };

    updateLastLogin();
  }, []);

  return null;
}
