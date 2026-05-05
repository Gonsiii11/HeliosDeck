// src/components/common/AuthBadge.jsx
// Live auth indicator for the nav bar. Reads from useAuth — no props.
// Demonstrates the payoff of context: this component updates instantly when
// login/logout happens anywhere in the tree.

import { useAuth } from '../../contexts/AuthContext'

export default function AuthBadge() {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) return <span className="text-xs text-slate-400">checking…</span>
  if (!user) return <span className="text-xs text-slate-400">anonymous</span>

  return (
    <span className="flex items-center gap-2 text-xs text-slate-600">
      {user.image && <img src={user.image} alt="" className="w-5 h-5 rounded-full" />}
      <span>{user.firstName}</span>
      {user.role && <code className="bg-slate-100 px-1 rounded text-[10px]">{user.role}</code>}
      <button
        onClick={logout}
        className="text-slate-400 hover:text-rose-600 underline cursor-pointer bg-transparent border-none"
      >
        logout
      </button>
    </span>
  )
}
