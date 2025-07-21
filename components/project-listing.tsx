"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, ChevronRight, MessageCircle, Bell, X, Euro, ChevronDown, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import FilterModal from "./filter-modal"
import ProjectDetail from "./project-detail"
import Image from "next/image"
import MobileNav from "./mobile-nav"

export default function ProjectListing() {
  const [showFilter, setShowFilter] = useState(false)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [appliedFilters, setAppliedFilters] = useState({
    especialidades: [],
    habilidades: [],
    tipoProyecto: [],
    industria: [],
  })
  const [showAppliedFilters, setShowAppliedFilters] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  const projects = [
    {
      id: 1,
      title: "Diseña una app móvil para un SaaS de contabilidad",
      description: "Desarrollo de apps | Educación",
      price: "25 - 35 €/h",
      hours: "160 h/mes",
      skills: ["React", "Gitlab", "Next.js", "Figma", "Project Management"],
      icon: "J",
      bgColor: "bg-purple-500",
      company: "JapyBrand",
    },
    {
      id: 2,
      title: "Desarrolla una plataforma de e-learning",
      description: "Desarrollo web",
      price: "30 - 40 €/h",
      hours: "160 h/mes",
      skills: ["Vue.js", "GitHub", "Node.js", "Adobe XD", "Project Management"],
      icon: "S",
      bgColor: "bg-blue-600",
      company: "TechSolutions",
    },
    {
      id: 3,
      title: "Crea un CRM personalizado para pymes",
      description: "Negocios",
      price: "20 - 30 €/h",
      hours: "160 h/mes",
      skills: ["Angular", "Bitbucket", "Express.js", "Sketch", "Project Management"],
      icon: "uber",
      bgColor: "bg-black",
      company: "Uber",
    },
    {
      id: 4,
      title: "Desarrollar una estrategia de marketing digital",
      description: "Marketing | Estrategia",
      price: "25 - 35 €/h",
      hours: "160 h/mes",
      skills: ["Google Ads", "Trello", "SEO", "Adobe Illustrator", "Project Management"],
      icon: "B",
      bgColor: "bg-black",
      company: "Brand",
    },
  ]

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  const removeFilter = (category: string, filter: string) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((f) => f !== filter),
    }))
  }

  const hasAppliedFilters = () => {
    return Object.values(appliedFilters).some((filters) => filters.length > 0)
  }

  if (selectedProject) {
    return <ProjectDetail projectId={selectedProject} onBack={() => setSelectedProject(null)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="w-[95%] mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MobileNav />
              <h1 className="text-lg md:text-xl font-semibold text-gray-900 hidden md:block">Buscar Proyectos</h1>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
              <Image
                src="/images/martina-garcia.png"
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full object-cover cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[95%] mx-auto px-4 py-4 md:py-6">
        {/* Search and Filters */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-end mb-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1 h-auto border-none shadow-none bg-transparent text-green-600 hover:text-green-700"
              onClick={() => setShowFilter(true)}
            >
              <Filter className="w-4 h-4 mr-1 text-green-600" />
              Filtrar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1 h-auto border rounded-md bg-transparent text-green-600 hover:text-green-700"
            >
              <ChevronDown className="w-4 h-4 mr-1 text-green-600" />
              publicación
            </Button>
          </div>

          {/* Applied Filters Section - Only show if there are filters */}
          {hasAppliedFilters() && (
            <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-green-800">Filtros aplicados</h3>
                <button onClick={() => setShowAppliedFilters(!showAppliedFilters)}>
                  <ChevronRight
                    className={`w-4 h-4 text-green-600 transition-transform ${showAppliedFilters ? "rotate-90" : ""}`}
                  />
                </button>
              </div>

              {showAppliedFilters && (
                <div className="space-y-3">
                  {appliedFilters.especialidades.length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">Especialidades:</span>
                      <div className="flex flex-wrap gap-2">
                        {appliedFilters.especialidades.map((filter, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-100 border border-gray-200 text-gray-700 gap-2 px-3 py-1"
                          >
                            {filter}
                            <button
                              onClick={() => removeFilter("especialidades", filter)}
                              className="hover:bg-gray-200 rounded"
                            >
                              <X className="w-3 h-3 text-gray-500" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {appliedFilters.habilidades.length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">Habilidades:</span>
                      <div className="flex flex-wrap gap-2">
                        {appliedFilters.habilidades.map((filter, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-100 border border-gray-200 text-gray-700 gap-2 px-3 py-1"
                          >
                            {filter}
                            <span className="text-gray-400">y</span>
                            <button
                              onClick={() => removeFilter("habilidades", filter)}
                              className="hover:bg-gray-200 rounded"
                            >
                              <X className="w-3 h-3 text-gray-500" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {appliedFilters.tipoProyecto.length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">Tipo de proyecto:</span>
                      <div className="flex flex-wrap gap-2">
                        {appliedFilters.tipoProyecto.map((filter, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-100 border border-gray-200 text-gray-700 gap-2 px-3 py-1"
                          >
                            {filter}
                            <button
                              onClick={() => removeFilter("tipoProyecto", filter)}
                              className="hover:bg-gray-200 rounded"
                            >
                              <X className="w-3 h-3 text-gray-500" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Animated Content Container */}
        <div
          className="transition-all duration-[3000ms] ease-out"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? "translateX(0)" : "translateX(-100vw)",
            animation: isLoaded ? "slideInBounce 3s ease-out forwards" : "none",
          }}
        >
          {/* Promotional Banner - Now appears only once */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <Euro className="w-4 h-4 text-green-600" />
              <span className="font-medium">¡Gana 1500€ por referir!</span>
            </div>
          </div>

          {/* Project List */}
          <div className="space-y-4">
            {projects.map((project, index) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 shadow-sm"
                onClick={() => setSelectedProject(project.id)}
                style={{
                  transitionDelay: `${index * 200}ms`,
                  animation: isLoaded ? `fadeIn 0.5s ease-out ${index * 200 + 1000}ms both` : "none",
                }}
              >
                <CardContent className="p-0">
                  <div className="flex h-full">
                    {/* Left Section - 95% width containing all project information */}
                    <div className="w-[95%] p-4 md:p-6">
                      <div className="flex items-start gap-4">
                        {/* Project Icon */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-14 h-14 ${
                              project.bgColor
                            } rounded-md flex items-center justify-center text-white font-bold text-xl`}
                          >
                            {project.icon === "uber" ? (
                              <span className="text-sm font-bold">uber</span>
                            ) : project.icon === "🍃" ? (
                              <span className="text-2xl">🍃</span>
                            ) : (
                              project.icon
                            )}
                          </div>
                          <span className="text-xs text-gray-500 font-medium mt-1 block text-center">
                            {project.company}
                          </span>
                        </div>

                        {/* Project Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">{project.title}</h3>
                          <p className="text-xs text-green-600 mb-2">
                            {project.description} | <Euro className="w-3 h-3 inline" /> {project.price}
                          </p>
                          <p className="text-xs text-green-600 mb-3 flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-green-600" /> {project.hours}
                          </p>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            {project.skills.slice(0, 4).map((skill, skillIndex) => (
                              <Badge
                                key={skillIndex}
                                variant="secondary"
                                className="text-[10px] md:text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-2 py-0.5"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {project.skills.length > 4 && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] md:text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-2 py-0.5"
                              >
                                +{project.skills.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - 5% width containing only the arrow icon */}
                    <div className="w-[5%] border-l border-gray-200 flex items-center justify-center min-h-[120px] hidden sm:flex">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-900"
                      >
                        <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilter && <FilterModal onClose={() => setShowFilter(false)} />}
    </div>
  )
}
