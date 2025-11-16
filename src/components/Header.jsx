import React from 'react'

function Header() {
  return (
    <header className="w-full py-6">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
          Rifa Horaria $1000
        </h1>
        <nav className="text-sm text-gray-500 space-x-4">
          <a href="/test" className="hover:text-gray-700">Diagnóstico</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-700">Términos</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
