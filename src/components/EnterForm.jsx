import React, { useEffect, useMemo, useState } from 'react'

export default function EnterForm({ onSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [payments, setPayments] = useState({ enabled: false, amount: 1000, currency: 'usd', price: 10.0 })

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  // Read payment status and amount from backend status
  const loadStatus = async () => {
    try {
      const res = await fetch(`${backend}/api/status`)
      const data = await res.json()
      if (data && data.payments) setPayments(data.payments)
    } catch (e) {
      // ignore
    }
  }

  // If returned from Stripe, confirm the session
  const confirmPaymentIfNeeded = async () => {
    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')
    const sessionId = params.get('session_id')
    if (success && sessionId) {
      try {
        setLoading(true)
        const res = await fetch(`${backend}/api/pay/confirm?session_id=${encodeURIComponent(sessionId)}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || 'No se pudo confirmar el pago')
        setMessage({ type: 'success', text: data.message || 'Pago confirmado y participación registrada.' })
        onSuccess && onSuccess()
        // Clean query params
        const url = new URL(window.location.href)
        url.search = ''
        window.history.replaceState({}, document.title, url.toString())
      } catch (err) {
        setMessage({ type: 'error', text: err.message })
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    loadStatus()
    confirmPaymentIfNeeded()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submitFree = async (e) => {
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

  const startPayment = async (e) => {
    e.preventDefault()
    setMessage(null)
    if (!name || !email) {
      setMessage({ type: 'error', text: 'Ingresa tu nombre y correo.' })
      return
    }
    try {
      setLoading(true)
      const res = await fetch(`${backend}/api/pay/checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'No se pudo iniciar el pago')
      if (data.url) {
        window.location.href = data.url
      } else {
        setMessage({ type: 'error', text: 'No se recibió la URL de pago' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const priceLabel = useMemo(() => {
    const dollars = (payments.amount ?? 1000) / 100
    return `$${dollars.toFixed(2)}`
  }, [payments])

  const isPaymentsEnabled = !!payments.enabled

  return (
    <form onSubmit={isPaymentsEnabled ? startPayment : submitFree} className="space-y-3">
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

      {isPaymentsEnabled ? (
        <button
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2 rounded transition-colors"
        >
          {loading ? 'Redirigiendo…' : `Pagar ${priceLabel} y participar`}
        </button>
      ) : (
        <button
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2 rounded transition-colors"
        >
          {loading ? 'Enviando...' : 'Participar ahora'}
        </button>
      )}

      {isPaymentsEnabled && (
        <p className="text-xs text-gray-500">Serás redirigido a una página segura de pago. Al confirmar, tu participación se registrará automáticamente.</p>
      )}
    </form>
  )
}
