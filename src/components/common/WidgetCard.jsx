import React from 'react'

const WidgetCard = ({ title, subtitle, children }) => (
  <div className="panel-sheen rounded-2xl border border-white/10 bg-white/5 p-5">
    <div className="mb-4">
      <p className="text-xs uppercase tracking-[0.3em] text-nebula/60">{subtitle}</p>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
    </div>
    {children}
  </div>
)

export default WidgetCard
