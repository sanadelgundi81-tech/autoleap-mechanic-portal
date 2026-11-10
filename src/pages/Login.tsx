import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { ErrorBanner, Field, PrimaryButton, inputClassName } from '../components/ui'

export function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)
    try {
      if (mode === 'signin') {
        const { error: signInError } = await signIn(email.trim(), password)
        if (signInError) setError(signInError)
      } else {
        const { error: signUpError, needsConfirmation } = await signUp(
          email.trim(),
          password,
        )
        if (signUpError) {
          setError(signUpError)
        } else if (needsConfirmation) {
          setInfo(
            'Account created. Check your email to confirm your account, then sign in.',
          )
          setMode('signin')
        }
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
            AL
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AutoLeap</h1>
            <p className="text-xs text-slate-400">
              Independent Mechanic Portal &amp; DVI Command Center
            </p>
          </div>
        </div>

        <h2 className="mb-1 text-lg font-semibold text-white">
          {mode === 'signin' ? 'Sign in to continue' : 'Create your shop account'}
        </h2>
        <p className="mb-4 text-xs text-slate-400">
          Sign in with your shop email and password. Your account is stored in
          Supabase Auth — passwords are never stored in a table.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label="Email">
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClassName}
              placeholder="you@yourshop.com"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              required
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClassName}
              placeholder="••••••••"
            />
          </Field>
          <ErrorBanner message={error} />
          {info && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              {info}
            </div>
          )}
          <PrimaryButton type="submit" disabled={busy} className="w-full">
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </PrimaryButton>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(null)
            setInfo(null)
          }}
          className="mt-4 w-full text-center text-sm text-blue-400 hover:text-blue-300"
        >
          {mode === 'signin'
            ? 'No account yet? Create one'
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
