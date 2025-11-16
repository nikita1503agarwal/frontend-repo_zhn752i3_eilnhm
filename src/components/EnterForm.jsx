import React, { useState } from 'react'

export default function EnterForm({ onSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setMessage(null)
    if (!name || !email) {
      setMessage({ type: 'error', text: 'Ingresa tu nombre y correo.' })
      return
    }
    try {
      setLoading(true)
      const res = await fetch(`${backend}/api/enter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Error al entrar al sorteo')
      setMessage({ type: 'success', text: data.message })
      setName('')
      setEmail('')
      onSuccess && onSuccess()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Nombre</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Correo</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="tunombre@email.com"
        />
      </div>
      {message && (
        <p className={`${message.type === 'error' ? 'text-red-600' : 'text-green-600'} text-sm`}>{message.text}</p>
      )}
      <button
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2 rounded transition-colors"
      >
        {loading ? 'Enviando...' : 'Participar ahora'}
      </button>
    </form>
  )
}
