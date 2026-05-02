import React from 'react'

const downloadJson = (data, fileName) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const ExportButton = ({ data, fileName = 'export.json', label = 'Export JSON' }) => (
  <button
    type="button"
    onClick={() => downloadJson(data, fileName)}
    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-on-surface-variant transition hover:border-white/30"
  >
    {label}
  </button>
)

export default ExportButton
