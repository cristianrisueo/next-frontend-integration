"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, Calendar, Clock, Euro, Users, ChevronDown, MessageCircle, Bell } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import MobileNav from "./mobile-nav"

interface ProjectDetailProps {
  projectId: number
  onBack: () => void
}

export default function ProjectDetail({ projectId, onBack }: ProjectDetailProps) {
  const [hasApplied, setHasApplied] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(2)

  const faqs = [
    "¿Es posible utilizar nuestra plataforma para formar un equipo completo desde el inicio?",
    "¿Es posible utilizar nuestra plataforma para formar un equipo completo desde el inicio?",
    "¿Qué sucede si necesito reemplazar a un freelance durante el desarrollo del proyecto?",
    "¿Cómo se gestionará la facturación del proyecto?",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="w-[95%] mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MobileNav />
              <div className="hidden md:flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-900">Buscar Proyectos</h1>
                <span className="text-gray-400">Buscar Proyectos</span>
              </div>
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

      <div className="w-[95%] mx-auto px-4 py-4 md:py-6">
        {/* Success Message */}
        {hasApplied && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-green-800 font-medium">Aplicación enviada con éxito</span>
          </div>
        )}

        {/* Breadcrumb - Hide on mobile */}
        <div className="hidden md:flex items-center gap-2 mb-6 text-sm text-gray-600">
          <button onClick={onBack} className="flex items-center gap-1 hover:text-gray-900">
            <ChevronLeft className="w-4 h-4" />
            Atrás
          </button>
          <span>/</span>
          <span>Buscar Proyectos</span>
          <span>/</span>
          <span>Diseña una app móvil para un SaaS de contabilidad</span>
        </div>

        {/* Mobile Back Button */}
        <div className="md:hidden mb-4">
          <button onClick={onBack} className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" />
            <span>Atrás</span>
          </button>
        </div>

        {/* Project Header */}
        <div className="bg-green-800 text-white rounded-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-2">Crea un CRM personalizado para pymes</h1>
              <p className="text-green-100 mb-4">UX/UI Specialist</p>

              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs md:text-sm">Inicio: 24/07/2022</span>
                </div>
                <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs md:text-sm">80 horas</span>
                </div>
                <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded">
                  <Euro className="w-4 h-4" />
                  <span className="text-xs md:text-sm">2.400 € (Estimado)</span>
                </div>
                <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded">
                  <Users className="w-4 h-4" />
                  <span className="text-xs md:text-sm">2 Talentos</span>
                </div>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="mt-4 md:mt-0">
              Diseño
            </Button>
          </div>
        </div>

        {/* Project Description */}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Descripción del Proyecto</h2>
          <p className="text-sm md:text-base text-gray-700 mb-6">
            Pymex, uno de nuestros clientes más innovadores, busca tu colaboración y la de tu equipo para desarrollar un
            CRM personalizado que se ajuste a las necesidades específicas de pequeñas y medianas empresas. Este proyecto
            ha sido detalladamente especificado en un documento por el cliente y su gerente de proyecto. Para más
            información, visita su sitio web a continuación.
          </p>

          <h3 className="font-semibold mb-3">¿Cuáles son los objetivos y tareas a realizar?</h3>
          <p className="text-sm md:text-base text-gray-700">
            Pymex, uno de nuestros clientes más innovadores, busca tu colaboración y la de tu equipo para desarrollar un
            CRM personalizado que se ajuste a las necesidades específicas de pequeñas y medianas empresas. Este proyecto
            ha sido detalladamente especificado en un documento por el cliente y su gerente de proyecto. Para más
            información, visita su sitio web a continuación.
          </p>
        </div>

        {/* FAQ Section with Green Background for Selected */}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Preguntas Frecuentes</h2>
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border-b border-gray-200 transition-colors ${
                  expandedFaq === index ? "bg-green-50" : "bg-white hover:bg-gray-50"
                }`}
              >
                <button
                  className="flex items-center justify-between w-full text-left p-4"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="text-sm text-gray-700 pr-4">{faq}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 text-sm text-gray-600">
                    Aquí se incluirá información adicional sobre el proyecto y sus características. También se puede
                    modificar para incluir contenido relevante en otros contextos.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-6 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
          {/* Responsable Section - Now on left, 1/3 width on desktop */}
          <div className="bg-white rounded-lg p-4 md:p-6 md:col-span-1">
            <h3 className="font-semibold mb-4">Responsable</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-black rounded text-white flex items-center justify-center text-sm font-bold">
                uber
              </div>
              <span className="font-medium">Uber</span>
            </div>
            <div className="space-y-3">
              <Image
                src="/images/martina-garcia.png"
                alt="Martina Garcia"
                width={128}
                height={160}
                className="object-cover rounded-lg w-full max-w-[128px]"
              />
              <div>
                <h4 className="font-semibold text-gray-900">Martina Garcia</h4>
                <p className="text-sm text-gray-600">Project Owner</p>
              </div>
            </div>
          </div>

          {/* Equipo Section - Now on right, 2/3 width on desktop */}
          <div className="bg-white rounded-lg p-4 md:p-6 md:col-span-2">
            <h3 className="font-semibold mb-4">Equipo</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Mobile Developer</h4>
                <p className="text-sm text-gray-600 mb-4">Angular, Bitbucket, Express.js y Sketch</p>
              </div>

              {hasApplied ? (
                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                  onClick={() => setHasApplied(false)}
                >
                  Retirar Candidatura
                </Button>
              ) : (
                <Button
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                  onClick={() => setHasApplied(true)}
                >
                  Aplicar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
