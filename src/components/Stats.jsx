import React, { useEffect, useState } from 'react'

export default function Stats() {
  const [status, setStatus] = useState(null)
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    try {
      const res = await fetch(`${backend}/api/status`)
      const data = await res.json()
      setStatus(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { load(); const t = setInterval(load, 10000); return () => clearInterval(t) }, [])

  if (!status) return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 rounded bg-white/60 animate-pulse h-16" />
      <div className="p-4 rounded bg-white/60 animate-pulse h-16" />
    </div>
  )

  const current = status.current
  const winner = status.last_winner

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-4 rounded-lg bg-white shadow">
        <p className="text-sm text-gray-500">Participantes actuales</p>
        <p className="text-3xl font-bold">{current.entries_count}</p>
      </div>
      <div className="p-4 rounded-lg bg-white shadow">
        <p className="text-sm text-gray-500">Último ganador</p>
        {winner ? (
          <p className="text-lg font-semibold">{winner.winner_name || 'Sin ganador'} <span className="text-gray-500 text-sm">{winner.winner_email || ''}</span></p>
        ) : (
          <p className="text-lg font-semibold">Sin historial aún</p>
        )}
      </div>
    </div>
  )
}
