"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"

interface FilterModalProps {
  onClose: () => void
}

export default function FilterModal({ onClose }: FilterModalProps) {
  const [selectedSpecialties, setSelectedSpecialties] = useState(["Front End Developer", "Back End Developer"])
  const [sortBy, setSortBy] = useState("recent")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("resize", checkMobile)
      document.body.style.overflow = "unset"
    }
  }, [])

  // Handle click outside modal (desktop only)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isMobile) {
      onClose()
    }
  }

  const removeSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) => prev.filter((s) => s !== specialty))
  }

  // Mobile layout (existing behavior)
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="p-4 pb-16 md:p-6 max-w-sm md:max-w-lg w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Filtrar Proyectos</h2>
            <button onClick={onClose} className="p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Especialidades */}
          <div className="mb-6">
            <h3 className="text-base font-medium mb-3">Especialidades</h3>
            <div className="flex items-center gap-3">
              <div className="flex flex-wrap gap-2 flex-1">
                {selectedSpecialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="bg-gray-100 text-gray-800 gap-2 px-3 py-1">
                    {specialty}
                    <button onClick={() => removeSpecialty(specialty)} className="hover:bg-gray-200 rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-1 bg-gray-50 border rounded px-3 py-2">
                <span className="text-lg font-medium">0</span>
                <div className="flex flex-col">
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                  <ChevronDown className="w-4 h-4 text-gray-400 -mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Habilidades */}
          <div className="mb-6">
            <h3 className="text-base font-medium mb-3">Habilidades</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Busca y añade"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-500"
                />
                <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex items-center gap-1 bg-gray-50 border rounded px-3 py-2">
                <span className="text-lg font-medium">0</span>
                <div className="flex flex-col">
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                  <ChevronDown className="w-4 h-4 text-gray-400 -mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Tipo de proyecto */}
          <div className="mb-6">
            <h3 className="text-base font-medium mb-3">Tipo de proyecto</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Busca y añade"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-500"
                />
                <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex items-center gap-1 bg-gray-50 border rounded px-3 py-2">
                <span className="text-lg font-medium">0</span>
                <div className="flex flex-col">
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                  <ChevronDown className="w-4 h-4 text-gray-400 -mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Industria */}
          <div className="mb-6">
            <h3 className="text-base font-medium mb-3">Industria</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Busca y añade"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-500"
                />
                <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex items-center gap-1 bg-gray-50 border rounded px-3 py-2">
                <span className="text-lg font-medium">0</span>
                <div className="flex flex-col">
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                  <ChevronDown className="w-4 h-4 text-gray-400 -mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Ordenar por */}
          <div className="mb-8">
            <h3 className="text-base font-medium mb-3">Ordenar por</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value="recent"
                  checked={sortBy === "recent"}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-5 h-5 text-green-800"
                />
                <span className="text-sm">Fecha de publicación (Más reciente primero)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value="oldest"
                  checked={sortBy === "oldest"}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-5 h-5 text-green-800"
                />
                <span className="text-sm">Fecha de publicación (Más antiguo primero)</span>
              </label>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom on mobile */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <Button
              className="w-full bg-green-800 hover:bg-green-900 text-white text-base font-medium py-3 mb-3"
              onClick={onClose}
            >
              Filtrar
            </Button>
            <Button
              variant="ghost"
              className="w-full text-orange-500 hover:text-orange-600 hover:bg-orange-50 text-base font-medium"
            >
              Eliminar Filtros
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Desktop layout (new modal design)
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Filtrar Proyectos</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Especialidades */}
          <div>
            <h3 className="text-base font-medium mb-3 text-gray-900">Especialidades</h3>
            <div className="flex items-center gap-3">
              <div className="flex flex-wrap gap-2 flex-1">
                {selectedSpecialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="bg-gray-100 text-gray-800 gap-2 px-3 py-1">
                    {specialty}
                    <button onClick={() => removeSpecialty(specialty)} className="hover:bg-gray-200 rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-1 bg-gray-50 border rounded px-3 py-2">
                <span className="text-sm font-medium">0</span>
                <div className="flex flex-col">
                  <ChevronUp className="w-3 h-3 text-gray-400" />
                  <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Habilidades */}
          <div>
            <h3 className="text-base font-medium mb-3 text-gray-900">Habilidades</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Busca y añade"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500 text-sm"
                />
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex items-center gap-1 bg-gray-50 border rounded px-3 py-2">
                <span className="text-sm font-medium">0</span>
                <div className="flex flex-col">
                  <ChevronUp className="w-3 h-3 text-gray-400" />
                  <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Tipo de proyecto */}
          <div>
            <h3 className="text-base font-medium mb-3 text-gray-900">Tipo de proyecto</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Busca y añade"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500 text-sm"
                />
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex items-center gap-1 bg-gray-50 border rounded px-3 py-2">
                <span className="text-sm font-medium">0</span>
                <div className="flex flex-col">
                  <ChevronUp className="w-3 h-3 text-gray-400" />
                  <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Industria */}
          <div>
            <h3 className="text-base font-medium mb-3 text-gray-900">Industria</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Busca y añade"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500 text-sm"
                />
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex items-center gap-1 bg-gray-50 border rounded px-3 py-2">
                <span className="text-sm font-medium">0</span>
                <div className="flex flex-col">
                  <ChevronUp className="w-3 h-3 text-gray-400" />
                  <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Ordenar por */}
          <div>
            <h3 className="text-base font-medium mb-3 text-gray-900">Ordenar por</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value="recent"
                  checked={sortBy === "recent"}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-4 h-4 text-green-800"
                />
                <span className="text-sm text-gray-700">Fecha de publicación (Más reciente primero)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value="oldest"
                  checked={sortBy === "oldest"}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-4 h-4 text-green-800"
                />
                <span className="text-sm text-gray-700">Fecha de publicación (Más antiguo primero)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <Button
            variant="ghost"
            className="flex-1 text-orange-500 hover:text-orange-600 hover:bg-orange-50 font-medium"
          >
            Eliminar Filtros
          </Button>
          <Button className="flex-1 bg-green-800 hover:bg-green-900 text-white font-medium" onClick={onClose}>
            Filtrar
          </Button>
        </div>
      </div>
    </div>
  )
}
