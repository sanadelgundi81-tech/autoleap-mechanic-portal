import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

/**
 * One login for the whole shop. The login screen asks for a username;
 * only `admin` is accepted, and it maps to the shop's single Supabase Auth
 * account. The email below is a fixed internal identifier, not a secret.
 * The password is never stored anywhere in the app or the repo — it lives
 * only in Supabase Auth. There is no way to create an account from the app.
 */
export const ADMIN_USERNAME = 'admin'
export const ADMIN_EMAIL = 'admin@autoleap.local'

/** The same message for a wrong username and a wrong password. */
export const LOGIN_FAILED_MESSAGE = 'Wrong username or password.'

/**
 * Signs in as the shop admin. A wrong username is rejected without calling
 * Supabase, with the same message as a wrong password. Other failures
 * (e.g. network) say that sign-in failed, without naming a field.
 */
export async function signInAsAdmin(
  username: string,
  password: string,
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is not configured.' }
  if (username !== ADMIN_USERNAME) return { error: LOGIN_FAILED_MESSAGE }
  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password })
  if (!error) return { error: null }
  const code = (error as { code?: string }).code
  if (code === 'invalid_credentials' || /invalid login credentials/i.test(error.message)) {
    return { error: LOGIN_FAILED_MESSAGE }
  }
  return { error: `Couldn't sign in: ${error.message}` }
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function signIn(username: string, password: string) {
    return signInAsAdmin(username, password)
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
