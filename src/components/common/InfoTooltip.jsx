import React from 'react'

const InfoTooltip = ({ label, description, unit }) => (
  <span className="group relative inline-flex items-center gap-1 text-xs uppercase tracking-widest text-on-surface-variant">
    <span>{label}</span>
    <span className="material-symbols-outlined text-[14px] text-primary">info</span>
    <span className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-56 rounded-lg border border-white/10 bg-slate-900/90 p-3 text-[11px] font-normal text-on-surface-variant opacity-0 transition group-hover:opacity-100">
      <span className="block text-on-surface">{description}</span>
      {unit ? <span className="mt-2 block text-on-surface-variant">Unidad: {unit}</span> : null}
    </span>
  </span>
)

export default InfoTooltip
