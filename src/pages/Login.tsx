import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { ErrorBanner, Field, PrimaryButton, inputClassName } from '../components/ui'

/** One login for the whole shop: username + password. No sign-up. */
export function Login() {
  const { signIn } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const { error: signInError } = await signIn(username, password)
      if (signInError) setError(signInError)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-onaccent">
            AL
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AutoLeap</h1>
            <p className="text-xs text-slate-400">
              Independent Mechanic Portal &amp; DVI Command Center
            </p>
          </div>
        </div>

        <h2 className="mb-1 text-lg font-semibold text-white">Sign in to continue</h2>
        <p className="mb-4 text-xs text-slate-400">One login for the whole shop.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label="Username">
            <input
              type="text"
              required
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClassName}
              placeholder="••••••••"
            />
          </Field>
          <ErrorBanner message={error} />
          <PrimaryButton type="submit" disabled={busy} className="w-full">
            {busy ? 'Please wait…' : 'Sign in'}
          </PrimaryButton>
        </form>
      </div>
    </div>
  )
}
