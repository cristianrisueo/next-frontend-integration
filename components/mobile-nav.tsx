"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <div className="flex items-center gap-3">
        <button onClick={() => setIsOpen(!isOpen)} className="p-1">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <div className="bg-yellow-300 p-1 rounded">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13 10V3L4 14H11V21L20 10H13Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 p-4">
          <div className="flex justify-end">
            <button onClick={() => setIsOpen(false)} className="p-1">
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          <div className="mt-8 space-y-4">
            <a href="#" className="block py-2 text-lg font-medium">
              Inicio
            </a>
            <a href="#" className="block py-2 text-lg font-medium">
              Mis Proyectos
            </a>
            <a href="#" className="block py-2 text-lg font-medium">
              Mensajes
            </a>
            <a href="#" className="block py-2 text-lg font-medium">
              Notificaciones
            </a>
            <a href="#" className="block py-2 text-lg font-medium">
              Perfil
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
