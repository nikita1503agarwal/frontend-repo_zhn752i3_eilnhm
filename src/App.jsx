import { useState } from 'react'
import Header from './components/Header'
import Countdown from './components/Countdown'
import EnterForm from './components/EnterForm'
import Stats from './components/Stats'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 pb-16">
        <section className="mt-8 grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow border border-white/60">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Gana $1000 cada hora</h2>
            <p className="text-gray-600 mb-6">Participa gratis. El sorteo se cierra al inicio de cada hora y se elige un ganador al azar.</p>

            <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-indigo-600 font-semibold">Próximo cierre</p>
                <Countdown key={refreshKey} />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Premio</p>
                <p className="text-3xl font-black text-indigo-700">$1000</p>
              </div>
            </div>

            <EnterForm onSuccess={() => setRefreshKey((k) => k + 1)} />
          </div>

          <div className="space-y-6">
            <Stats key={refreshKey} />
            <div className="p-4 rounded-xl bg-white/80 border border-white/60 shadow">
              <h3 className="font-semibold mb-2">Cómo funciona</h3>
              <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
                <li>Ingresa tu nombre y correo para participar en la hora actual.</li>
                <li>Solo una participación por correo por hora.</li>
                <li>Al llegar la hora en punto, se elige un ganador al azar.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center text-xs text-gray-500 py-8">© {new Date().getFullYear()} Rifa Horaria. Todos los derechos reservados.</footer>
    </div>
  )
}

export default App
