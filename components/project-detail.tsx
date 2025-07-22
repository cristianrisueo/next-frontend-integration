"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Euro,
  Users,
  ChevronDown,
  MessageCircle,
  Bell,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import MobileNav from "./mobile-nav";
import { useProject } from "@/lib/hooks/useProjects";
import { useApplications } from "@/lib/hooks/useApplications";
import { Badge } from "@/components/ui/badge";
import FloatingNotification from "./floating-notification";

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

/**
 * Componente de vista detallada de un proyecto
 * Muestra información completa del proyecto y permite aplicar/retirar aplicaciones
 */
export default function ProjectDetail({
  projectId,
  onBack,
}: ProjectDetailProps) {
  // Utiliza hooks para obtener datos del proyecto y gestionar aplicaciones
  const { project, loading, error } = useProject(projectId);
  const {
    applyToProject,
    withdrawApplication,
    isAppliedToProject,
    isProcessing,
  } = useApplications();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(2);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Función de limpieza para timeouts
  useEffect(() => {
    return () => {
      setNotification(null);
    };
  }, []);

  // Check if user has applied to this project - use useMemo for reactivity
  const hasApplied = useMemo(() => {
    return project ? isAppliedToProject(project.id) : false;
  }, [project, isAppliedToProject]);

  // Handle application/withdrawal
  const handleApplicationToggle = async () => {
    if (!project) return;

    // Clear any previous notifications
    setNotification(null);

    if (hasApplied) {
      const success = await withdrawApplication(project.id);
      if (success) {
        setNotification({
          message: "Candidatura retirada con éxito",
          type: "success",
        });
      } else {
        setNotification({
          message: "Error al retirar la candidatura. Inténtalo de nuevo.",
          type: "error",
        });
      }
    } else {
      const success = await applyToProject(project.id);
      if (success) {
        setNotification({
          message: "¡Aplicación enviada con éxito!",
          type: "success",
        });
      } else {
        setNotification({
          message: "Error al enviar la aplicación. Inténtalo de nuevo.",
          type: "error",
        });
      }
    }
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No especificado";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Helper function to format budget
  const formatBudget = (budget?: number) => {
    if (!budget) return "No especificado";
    return `${budget.toLocaleString("es-ES")} €`;
  };

  const faqs = [
    "¿Es posible utilizar nuestra plataforma para formar un equipo completo desde el inicio?",
    "¿Es posible utilizar nuestra plataforma para formar un equipo completo desde el inicio?",
    "¿Qué sucede si necesito reemplazar a un freelance durante el desarrollo del proyecto?",
    "¿Cómo se gestionará la facturación del proyecto?",
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Cargando proyecto...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-600 mb-4">
            <ChevronLeft className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar el proyecto
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "Proyecto no encontrado"}
          </p>
          <Button onClick={onBack}>Volver atrás</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="w-[95%] mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MobileNav />
              <div className="hidden md:flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Buscar Proyectos
                </h1>
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
        {/* Breadcrumb - Hide on mobile */}
        <div className="hidden md:flex items-center gap-2 mb-6 text-sm text-gray-600">
          <button
            onClick={onBack}
            className="flex items-center gap-1 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            Atrás
          </button>
          <span>/</span>
          <span>Buscar Proyectos</span>
          <span>/</span>
          <span>{project.title}</span>
        </div>

        {/* Mobile Back Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Atrás</span>
          </button>
        </div>

        {/* Project Header */}
        <div className="bg-green-800 text-white rounded-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-2">
                {project.title}
              </h1>
              <p className="text-green-100 mb-4">
                {project.specialty?.name || "Especialidad"}
              </p>

              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs md:text-sm">
                    Inicio: {formatDate(project.startDate)}
                  </span>
                </div>
                {project.hours && (
                  <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs md:text-sm">{project.hours}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded">
                  <Euro className="w-4 h-4" />
                  <span className="text-xs md:text-sm">
                    {formatBudget(project.estimatedBudget)} (Estimado)
                  </span>
                </div>
                {project.requiredTalents && (
                  <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded">
                    <Users className="w-4 h-4" />
                    <span className="text-xs md:text-sm">
                      {project.requiredTalents} Talentos
                    </span>
                  </div>
                )}
              </div>
            </div>
            {project.category && (
              <Button variant="secondary" size="sm" className="mt-4 md:mt-0">
                {project.category.name}
              </Button>
            )}
          </div>
        </div>

        {/* Project Description */}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Descripción del Proyecto
          </h2>
          <div className="text-sm md:text-base text-gray-700 mb-6">
            {project.description ||
              "No hay descripción disponible para este proyecto."}
          </div>

          {/* Skills Required */}
          {project.skills.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-3">Habilidades requeridas</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <Badge key={skill.id} variant="outline" className="text-sm">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Industry and Category */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {project.industry && (
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Industria</h4>
                <p className="text-gray-600">{project.industry.name}</p>
              </div>
            )}
            {project.category && (
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Categoría</h4>
                <p className="text-gray-600">{project.category.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section with Green Background for Selected */}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Preguntas Frecuentes</h2>
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border-b border-gray-200 transition-colors ${
                  expandedFaq === index
                    ? "bg-green-50"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <button
                  className="flex items-center justify-between w-full text-left p-4"
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
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
                    Aquí se incluirá información adicional sobre el proyecto y
                    sus características. También se puede modificar para incluir
                    contenido relevante en otros contextos.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-6 md:flex md:gap-6 md:space-y-0 md:items-start">
          {/* Equipo Section - Shows first on mobile, second on desktop */}
          <div className="bg-white rounded-lg p-4 md:p-6 md:flex-shrink-0 md:w-auto order-1 md:order-2">
            <h3 className="font-semibold mb-4">Equipo</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {project.specialty?.name || "Desarrollador"}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {project.skills
                    .slice(0, 4)
                    .map((skill) => skill.name)
                    .join(", ")}
                  {project.skills.length > 4 &&
                    ` y ${project.skills.length - 4} más`}
                </p>
              </div>

              {hasApplied ? (
                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                  onClick={handleApplicationToggle}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Retirar Candidatura"
                  )}
                </Button>
              ) : (
                <Button
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                  onClick={handleApplicationToggle}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Aplicando...
                    </>
                  ) : (
                    "Aplicar"
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Responsable Section - Shows second on mobile, first on desktop */}
          <div className="bg-white rounded-lg p-4 md:p-6 md:flex-shrink-0 md:w-1/1 order-2 md:order-1">
            <h3 className="font-semibold mb-4">Responsable</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-600 rounded text-white flex items-center justify-center text-sm font-bold">
                {project.company?.name?.charAt(0).toUpperCase() || "C"}
              </div>
              <span className="font-medium">
                {project.company?.name || "Empresa"}
              </span>
            </div>
            <div className="space-y-3 md:text-left">
              <Image
                src="/images/martina-garcia.png"
                alt="Martina Garcia"
                width={128}
                height={160}
                className="object-cover rounded-lg w-full max-w-[160px] md:max-w-[200px] mx-auto md:mx-0"
              />
              <div>
                <h4 className="font-semibold text-gray-900">Martina Garcia</h4>
                <p className="text-sm text-gray-600">Project Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      <FloatingNotification
        message={notification?.message || null}
        type={notification?.type || "success"}
        duration={notification?.type === "error" ? 5000 : 4000}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}
