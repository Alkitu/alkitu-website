/**
 * Script temporal para crear usuarios admin en Supabase
 * Ejecutar con: npx tsx scripts/create-admin-users.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Cargar variables de entorno manualmente desde .env.local
const envPath = join(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envVars: Record<string, string> = {}

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) {
    const key = match[1].trim()
    const value = match[2].trim()
    envVars[key] = value
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function createAdminUsers() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const users = [
    {
      email: 'luiseum95@gmail.com',
      password: 'Luis-123',
      full_name: 'Luis Urdaneta'
    },
    {
      email: 'leoperez108@gmail.com',
      password: 'Leonel-123',
      full_name: 'Leonel Perez'
    }
  ]

  console.log('Creando usuarios admin...\n')

  for (const user of users) {
    // Intentar crear el usuario
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        emailRedirectTo: undefined, // Evitar correo de confirmación
        data: {
          full_name: user.full_name
        }
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`✓ Usuario ${user.email} ya existe`)

        // Intentar obtener el ID del usuario existente mediante login
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: user.password
        })

        if (signInData?.user) {
          // Insertar en admin_users si no existe
          const { error: insertError } = await supabase
            .from('admin_users')
            .upsert({
              id: signInData.user.id,
              email: user.email,
              full_name: user.full_name
            }, {
              onConflict: 'id'
            })

          if (insertError) {
            console.error(`  Error insertando en admin_users: ${insertError.message}`)
          } else {
            console.log(`  ✓ Agregado a tabla admin_users`)
          }

          // Cerrar sesión
          await supabase.auth.signOut()
        }
      } else {
        console.error(`✗ Error creando ${user.email}: ${authError.message}`)
      }
      continue
    }

    if (authData.user) {
      console.log(`✓ Usuario creado: ${user.email}`)
      console.log(`  ID: ${authData.user.id}`)

      // Insertar en tabla admin_users
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: authData.user.id,
          email: user.email,
          full_name: user.full_name
        })

      if (insertError) {
        console.error(`  Error insertando en admin_users: ${insertError.message}`)
      } else {
        console.log(`  ✓ Agregado a tabla admin_users`)
      }
    }
  }

  console.log('\n¡Proceso completado!')
  console.log('\nNOTA: Si recibes errores de confirmación de email, ve al dashboard de Supabase:')
  console.log('Authentication > Users > y confirma manualmente los usuarios.')
}

createAdminUsers().catch(console.error)
