// src/components/common/LoginForm.jsx
// Reusable controlled form for credentials.
// Receives onSubmit(username, password); parent owns the auth call.
// Purely presentational — no useAuth import here.

import { useState } from 'react'

export default function LoginForm({ onSubmit, isPending, error }) {
  const [username, setUsername] = useState('emilys')
  const [password, setPassword] = useState('emilyspass')

  const inputClass =
    'w-full mb-3 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50'

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(username, password)
      }}
      className="bg-indigo-50 border border-indigo-100 rounded-xl p-6"
    >
      <h2 className="text-lg font-semibold mb-1 mt-0">Sign in</h2>
      <p className="text-xs text-slate-500 mb-4">Demo credentials pre-filled. Try a wrong password to see error handling.</p>
      <input
        className={inputClass}
        placeholder="Username"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={isPending}
      />
      <input
        type="password"
        className={inputClass}
        placeholder="Password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isPending}
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold text-sm disabled:opacity-50 cursor-pointer transition-colors"
      >
        {isPending ? '⏳ Signing in…' : '🔑 Sign in'}
      </button>
      {error && <p className="mt-3 text-sm text-rose-600">❌ {error}</p>}
    </form>
  )
}
