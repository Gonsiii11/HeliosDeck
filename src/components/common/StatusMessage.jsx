// src/components/common/StatusMessage.jsx
// Reusable UI primitives for loading and error states.
// Used across auth and data fetching components.

export function Loading({ text = 'Loading…' }) {
  return <p className="text-slate-400 py-4">⏳ {text}</p>
}

export function ErrorMsg({ message }) {
  return (
    <p className="text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm">
      ❌ {message}
    </p>
  )
}
