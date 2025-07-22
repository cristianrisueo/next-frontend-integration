"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronDown, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useCatalog } from "@/lib/hooks/useCatalog"
import { FilterState, SortOption } from "@/types/filters"

interface FilterModalProps {
  onClose: () => void
  onApplyFilters: (filters: FilterState) => void
  currentFilters: FilterState
}

/**
 * Modal de filtros para proyectos freelance
 * Permite filtrar por especialidades, habilidades, tipo de proyecto, industria y ordenación
 * Responsive: diseño móvil y desktop diferenciados
 */
export default function FilterModal({ onClose, onApplyFilters, currentFilters }: FilterModalProps) {
  // Carga datos del catálogo
  const { data: catalogData, loading: catalogLoading } = useCatalog()
  
  // Estado local para selecciones de filtros
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters)
  const [sortBy, setSortBy] = useState<SortOption>(currentFilters.sortBy || "recent")
  const [isMobile, setIsMobile] = useState(false)
  
  // Estados para campos de búsqueda en dropdowns
  const [specialtiesInput, setSpecialtiesInput] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [projectTypeInput, setProjectTypeInput] = useState('')
  const [industryInput, setIndustryInput] = useState('')

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

  // Filter management functions
  const addFilter = (category: keyof FilterState, value: string) => {
    if (!localFilters[category].includes(value)) {
      setLocalFilters(prev => ({
        ...prev,
        [category]: [...prev[category], value]
      }))
    }
  }

  const removeFilter = (category: keyof FilterState, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: prev[category].filter(f => f !== value)
    }))
  }
  
  const clearAllFilters = () => {
    setLocalFilters({
      especialidades: [],
      habilidades: [],
      tipoProyecto: [],
      industria: [],
    })
    setSortBy("recent") // Reset to default sort
  }
  
  const applyFilters = () => {
    onApplyFilters({
      ...localFilters,
      sortBy
    })
    onClose()
  }
  
  // Filter suggestion functions
  const getFilteredSpecialties = () => {
    if (!specialtiesInput.trim()) return catalogData.specialties
    return catalogData.specialties.filter(specialty => 
      specialty.name.toLowerCase().includes(specialtiesInput.toLowerCase())
    ).slice(0, 10)
  }
  
  const getFilteredSkills = () => {
    if (!skillsInput.trim()) return catalogData.skills
    return catalogData.skills.filter(skill => 
      skill.name.toLowerCase().includes(skillsInput.toLowerCase())
    ).slice(0, 10)
  }
  
  const getFilteredIndustries = () => {
    if (!industryInput.trim()) return catalogData.industries
    return catalogData.industries.filter(industry => 
      industry.name.toLowerCase().includes(industryInput.toLowerCase())
    ).slice(0, 10)
  }
  
  const getFilteredCategories = () => {
    if (!projectTypeInput.trim()) return catalogData.categories
    return catalogData.categories.filter(category => 
      category.name.toLowerCase().includes(projectTypeInput.toLowerCase())
    ).slice(0, 10)
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

          {/* Estado de carga */}
          {catalogLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Cargando opciones...</span>
            </div>
          )}
          
          {!catalogLoading && (
            <>
              {/* Especialidades */}
              <div className="mb-6">
                <h3 className="text-base font-medium mb-3">Especialidades</h3>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                    {localFilters.especialidades.length > 0 ? (
                      localFilters.especialidades.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="bg-gray-100 text-gray-800 gap-2 px-3 py-1">
                          {specialty}
                          <button onClick={() => removeFilter('especialidades', specialty)} className="hover:bg-gray-200 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Selecciona especialidades</span>
                    )}
                  </div>
                </div>
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Buscar especialidades..."
                    value={specialtiesInput}
                    onChange={(e) => setSpecialtiesInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700"
                  />
                </div>
                <div className="max-h-32 overflow-y-auto border rounded-md">
                  {getFilteredSpecialties().map((specialty) => (
                    <button
                      key={specialty.id}
                      onClick={() => addFilter('especialidades', specialty.name)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                      disabled={localFilters.especialidades.includes(specialty.name)}
                    >
                      <span className={localFilters.especialidades.includes(specialty.name) ? 'text-gray-400' : 'text-gray-700'}>
                        {specialty.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {!catalogLoading && (
            <>
              {/* Habilidades */}
              <div className="mb-6">
                <h3 className="text-base font-medium mb-3">Habilidades</h3>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                    {localFilters.habilidades.length > 0 ? (
                      localFilters.habilidades.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-800 gap-2 px-3 py-1">
                          {skill}
                          <button onClick={() => removeFilter('habilidades', skill)} className="hover:bg-gray-200 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Selecciona habilidades</span>
                    )}
                  </div>
                </div>
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Buscar habilidades..."
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700"
                  />
                </div>
                <div className="max-h-32 overflow-y-auto border rounded-md">
                  {getFilteredSkills().map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => addFilter('habilidades', skill.name)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                      disabled={localFilters.habilidades.includes(skill.name)}
                    >
                      <span className={localFilters.habilidades.includes(skill.name) ? 'text-gray-400' : 'text-gray-700'}>
                        {skill.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {!catalogLoading && (
            <>
              {/* Tipo de proyecto */}
              <div className="mb-6">
                <h3 className="text-base font-medium mb-3">Tipo de proyecto</h3>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                    {localFilters.tipoProyecto.length > 0 ? (
                      localFilters.tipoProyecto.map((type) => (
                        <Badge key={type} variant="secondary" className="bg-gray-100 text-gray-800 gap-2 px-3 py-1">
                          {type}
                          <button onClick={() => removeFilter('tipoProyecto', type)} className="hover:bg-gray-200 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Selecciona tipos de proyecto</span>
                    )}
                  </div>
                </div>
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Buscar tipos de proyecto..."
                    value={projectTypeInput}
                    onChange={(e) => setProjectTypeInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700"
                  />
                </div>
                <div className="max-h-32 overflow-y-auto border rounded-md">
                  {getFilteredCategories().map((category) => (
                    <button
                      key={category.id}
                      onClick={() => addFilter('tipoProyecto', category.name)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                      disabled={localFilters.tipoProyecto.includes(category.name)}
                    >
                      <span className={localFilters.tipoProyecto.includes(category.name) ? 'text-gray-400' : 'text-gray-700'}>
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {!catalogLoading && (
            <>
              {/* Industria */}
              <div className="mb-6">
                <h3 className="text-base font-medium mb-3">Industria</h3>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                    {localFilters.industria.length > 0 ? (
                      localFilters.industria.map((industry) => (
                        <Badge key={industry} variant="secondary" className="bg-gray-100 text-gray-800 gap-2 px-3 py-1">
                          {industry}
                          <button onClick={() => removeFilter('industria', industry)} className="hover:bg-gray-200 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Selecciona industrias</span>
                    )}
                  </div>
                </div>
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Buscar industrias..."
                    value={industryInput}
                    onChange={(e) => setIndustryInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700"
                  />
                </div>
                <div className="max-h-32 overflow-y-auto border rounded-md">
                  {getFilteredIndustries().map((industry) => (
                    <button
                      key={industry.id}
                      onClick={() => addFilter('industria', industry.name)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                      disabled={localFilters.industria.includes(industry.name)}
                    >
                      <span className={localFilters.industria.includes(industry.name) ? 'text-gray-400' : 'text-gray-700'}>
                        {industry.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

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
              onClick={applyFilters}
            >
              Filtrar
            </Button>
            <Button
              variant="ghost"
              className="w-full text-orange-500 hover:text-orange-600 hover:bg-orange-50 text-base font-medium"
              onClick={clearAllFilters}
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
          {/* Estado de carga */}
          {catalogLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Cargando opciones...</span>
            </div>
          )}
          
          {!catalogLoading && (
            <>
              {/* Especialidades */}
              <div>
                <h3 className="text-base font-medium mb-3 text-gray-900">Especialidades</h3>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                    {localFilters.especialidades.length > 0 ? (
                      localFilters.especialidades.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="bg-gray-100 text-gray-800 gap-2 px-3 py-1">
                          {specialty}
                          <button onClick={() => removeFilter('especialidades', specialty)} className="hover:bg-gray-200 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Selecciona especialidades</span>
                    )}
                  </div>
                </div>
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Buscar especialidades..."
                    value={specialtiesInput}
                    onChange={(e) => setSpecialtiesInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm"
                  />
                </div>
                <div className="max-h-32 overflow-y-auto border rounded-md">
                  {getFilteredSpecialties().map((specialty) => (
                    <button
                      key={specialty.id}
                      onClick={() => addFilter('especialidades', specialty.name)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                      disabled={localFilters.especialidades.includes(specialty.name)}
                    >
                      <span className={localFilters.especialidades.includes(specialty.name) ? 'text-gray-400' : 'text-gray-700'}>
                        {specialty.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Habilidades */}
              <div>
                <h3 className="text-base font-medium mb-3 text-gray-900">Habilidades</h3>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                    {localFilters.habilidades.length > 0 ? (
                      localFilters.habilidades.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-800 gap-2 px-3 py-1">
                          {skill}
                          <button onClick={() => removeFilter('habilidades', skill)} className="hover:bg-gray-200 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Selecciona habilidades</span>
                    )}
                  </div>
                </div>
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Buscar habilidades..."
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm"
                  />
                </div>
                <div className="max-h-32 overflow-y-auto border rounded-md">
                  {getFilteredSkills().map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => addFilter('habilidades', skill.name)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                      disabled={localFilters.habilidades.includes(skill.name)}
                    >
                      <span className={localFilters.habilidades.includes(skill.name) ? 'text-gray-400' : 'text-gray-700'}>
                        {skill.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de proyecto */}
              <div>
                <h3 className="text-base font-medium mb-3 text-gray-900">Tipo de proyecto</h3>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                    {localFilters.tipoProyecto.length > 0 ? (
                      localFilters.tipoProyecto.map((type) => (
                        <Badge key={type} variant="secondary" className="bg-gray-100 text-gray-800 gap-2 px-3 py-1">
                          {type}
                          <button onClick={() => removeFilter('tipoProyecto', type)} className="hover:bg-gray-200 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Selecciona tipos de proyecto</span>
                    )}
                  </div>
                </div>
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Buscar tipos de proyecto..."
                    value={projectTypeInput}
                    onChange={(e) => setProjectTypeInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm"
                  />
                </div>
                <div className="max-h-32 overflow-y-auto border rounded-md">
                  {getFilteredCategories().map((category) => (
                    <button
                      key={category.id}
                      onClick={() => addFilter('tipoProyecto', category.name)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                      disabled={localFilters.tipoProyecto.includes(category.name)}
                    >
                      <span className={localFilters.tipoProyecto.includes(category.name) ? 'text-gray-400' : 'text-gray-700'}>
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Industria */}
              <div>
                <h3 className="text-base font-medium mb-3 text-gray-900">Industria</h3>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                    {localFilters.industria.length > 0 ? (
                      localFilters.industria.map((industry) => (
                        <Badge key={industry} variant="secondary" className="bg-gray-100 text-gray-800 gap-2 px-3 py-1">
                          {industry}
                          <button onClick={() => removeFilter('industria', industry)} className="hover:bg-gray-200 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Selecciona industrias</span>
                    )}
                  </div>
                </div>
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Buscar industrias..."
                    value={industryInput}
                    onChange={(e) => setIndustryInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm"
                  />
                </div>
                <div className="max-h-32 overflow-y-auto border rounded-md">
                  {getFilteredIndustries().map((industry) => (
                    <button
                      key={industry.id}
                      onClick={() => addFilter('industria', industry.name)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                      disabled={localFilters.industria.includes(industry.name)}
                    >
                      <span className={localFilters.industria.includes(industry.name) ? 'text-gray-400' : 'text-gray-700'}>
                        {industry.name}
                      </span>
                    </button>
                  ))}
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
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
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
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="w-4 h-4 text-green-800"
                    />
                    <span className="text-sm text-gray-700">Fecha de publicación (Más antiguo primero)</span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <Button
            variant="ghost"
            className="flex-1 text-orange-500 hover:text-orange-600 hover:bg-orange-50 font-medium"
            onClick={clearAllFilters}
          >
            Eliminar Filtros
          </Button>
          <Button 
            className="flex-1 bg-green-800 hover:bg-green-900 text-white font-medium" 
            onClick={applyFilters}
          >
            Filtrar
          </Button>
        </div>
      </div>
    </div>
  )
}
