"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Filter,
  ChevronRight,
  MessageCircle,
  Bell,
  X,
  Euro,
  ChevronDown,
  Clock,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import FilterModal from "./filter-modal";
import ProjectDetail from "./project-detail";
import Image from "next/image";
import MobileNav from "./mobile-nav";
import { useProjects } from "@/lib/hooks/useProjects";
import { useApplications } from "@/lib/hooks/useApplications";
import { useCatalog } from "@/lib/hooks/useCatalog";
import { ProjectFilters } from "@/types/api";
import { FilterState } from "@/types/filters";

export default function ProjectListing() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    especialidades: [],
    habilidades: [],
    tipoProyecto: [],
    industria: [],
    sortBy: "recent",
  });
  const [showAppliedFilters, setShowAppliedFilters] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize with default filters for published projects
  const [currentFilters, setCurrentFilters] = useState<ProjectFilters>({
    status: "PUBLISHED",
    page: 1,
    limit: 10,
    sortBy: "publishedAt",
    order: "desc", // Most recent first by default
  });

  // Use custom hooks for data management
  const {
    projects = [],
    loading,
    error,
    hasMore,
    loadMore,
    updateFilters,
  } = useProjects(currentFilters);
  const { isAppliedToProject } = useApplications();
  const { data: catalogData } = useCatalog();

  // Update filters when currentFilters change
  useEffect(() => {
    updateFilters(currentFilters);
  }, [currentFilters, updateFilters]);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Helper functions to convert filter names to IDs using catalog data
  const mapNamesToIds = {
    especialidades: (names: string[]): string[] => {
      return names.map((name) => {
        const item = catalogData.specialties.find((s) => s.name === name);
        return item?.id || name; // Fallback to name if ID not found
      });
    },
    habilidades: (names: string[]): string[] => {
      return names.map((name) => {
        const item = catalogData.skills.find((s) => s.name === name);
        return item?.id || name; // Fallback to name if ID not found
      });
    },
    tipoProyecto: (names: string[]): string[] => {
      return names.map((name) => {
        const item = catalogData.categories.find((c) => c.name === name);
        return item?.id || name; // Fallback to name if ID not found
      });
    },
    industria: (names: string[]): string => {
      if (names.length === 0) return "";
      const name = names[0]; // API expects single industry
      const item = catalogData.industries.find((i) => i.name === name);
      return item?.id || name; // Fallback to name if ID not found
    },
  };

  // Function to apply filters from the filter modal
  const applyFilters = (newFilters: FilterState) => {
    setAppliedFilters(newFilters);

    // Always create base API filters with sort
    const sortBy = newFilters.sortBy || "recent"; // Default to 'recent' if undefined
    const apiFilters: ProjectFilters = {
      status: "PUBLISHED",
      page: 1,
      limit: 10,
      sortBy: "publishedAt", // Always sort by publication date
      order: sortBy === "recent" ? "desc" : "asc", // Always include order
    };

    // Check if any other filters are actually applied
    const hasOtherFilters =
      newFilters.especialidades.length > 0 ||
      newFilters.habilidades.length > 0 ||
      newFilters.industria.length > 0 ||
      newFilters.tipoProyecto.length > 0;

    // Only add other filter parameters if they exist
    if (hasOtherFilters) {
      if (newFilters.especialidades.length > 0) {
        apiFilters.specialties = mapNamesToIds.especialidades(
          newFilters.especialidades
        );
      }

      if (newFilters.habilidades.length > 0) {
        apiFilters.skills = mapNamesToIds.habilidades(newFilters.habilidades);
      }

      if (newFilters.industria.length > 0) {
        const industryId = mapNamesToIds.industria(newFilters.industria);
        if (industryId) {
          apiFilters.industry = industryId;
        }
      }

      // Note: tipoProyecto maps to category in the API
      if (newFilters.tipoProyecto.length > 0) {
        const categoryIds = mapNamesToIds.tipoProyecto(newFilters.tipoProyecto);
        if (categoryIds.length > 0) {
          apiFilters.category = categoryIds[0]; // API expects single category
        }
      }
    }

    setCurrentFilters(apiFilters);
  };

  const removeFilter = (category: keyof FilterState, filter: string) => {
    const newFilters = { ...appliedFilters };

    if (category === "sortBy") {
      // sortBy is a string, not an array, so we can't remove individual items
      return;
    }

    // For array properties, filter out the specified item
    if (Array.isArray(newFilters[category])) {
      (newFilters[category] as string[]) = (
        appliedFilters[category] as string[]
      ).filter((f) => f !== filter);
    }

    applyFilters(newFilters);
  };

  const hasAppliedFilters = () => {
    return (
      appliedFilters.especialidades.length > 0 ||
      appliedFilters.habilidades.length > 0 ||
      appliedFilters.tipoProyecto.length > 0 ||
      appliedFilters.industria.length > 0
    );
  };

  // Helper function to generate company avatar
  const getCompanyAvatar = (project: any) => {
    if (project.company?.logo) {
      return {
        type: "image",
        src: project.company.logo,
        alt: project.company.name || "Company",
      };
    }

    // Generate initials or use default based on company name
    const companyName = project.company?.name || "Unknown";
    if (companyName.toLowerCase() === "uber") {
      return { type: "text", content: "uber", bgColor: "bg-black" };
    }

    // Generate from first letter of company name
    const firstLetter = companyName.charAt(0).toUpperCase();
    const colors = [
      "bg-purple-500",
      "bg-blue-600",
      "bg-green-600",
      "bg-red-500",
      "bg-yellow-500",
    ];
    const colorIndex = companyName.length % colors.length;

    return {
      type: "text",
      content: firstLetter,
      bgColor: colors[colorIndex],
    };
  };

  // Handle load more functionality
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadMore();
    }
  };

  if (selectedProject) {
    return (
      <ProjectDetail
        projectId={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  // Show error state if there's an error
  if (error && !loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-600 mb-4">
            <X className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar proyectos
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
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
              <h1 className="text-lg md:text-xl font-semibold text-gray-900 hidden md:block">
                Buscar Proyectos
              </h1>
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
                <h3 className="font-medium text-green-800">
                  Filtros aplicados
                </h3>
                <button
                  onClick={() => setShowAppliedFilters(!showAppliedFilters)}
                >
                  <ChevronRight
                    className={`w-4 h-4 text-green-600 transition-transform ${
                      showAppliedFilters ? "rotate-90" : ""
                    }`}
                  />
                </button>
              </div>

              {showAppliedFilters && (
                <div className="space-y-3">
                  {appliedFilters.especialidades.length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Especialidades:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {appliedFilters.especialidades.map((filter, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-100 border border-gray-200 text-gray-700 gap-2 px-3 py-1"
                          >
                            {filter}
                            <button
                              onClick={() =>
                                removeFilter("especialidades", filter)
                              }
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
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Habilidades:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {appliedFilters.habilidades.map((filter, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-100 border border-gray-200 text-gray-700 gap-2 px-3 py-1"
                          >
                            {filter}
                            <button
                              onClick={() =>
                                removeFilter("habilidades", filter)
                              }
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
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Tipo de proyecto:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {appliedFilters.tipoProyecto.map((filter, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-100 border border-gray-200 text-gray-700 gap-2 px-3 py-1"
                          >
                            {filter}
                            <button
                              onClick={() =>
                                removeFilter("tipoProyecto", filter)
                              }
                              className="hover:bg-gray-200 rounded"
                            >
                              <X className="w-3 h-3 text-gray-500" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {appliedFilters.industria.length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Industria:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {appliedFilters.industria.map((filter, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-100 border border-gray-200 text-gray-700 gap-2 px-3 py-1"
                          >
                            {filter}
                            <button
                              onClick={() => removeFilter("industria", filter)}
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
            {/* Loading state for initial load */}
            {loading && projects.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                <span className="ml-2 text-gray-600">
                  Cargando proyectos...
                </span>
              </div>
            ) : (
              <>
                {(projects || []).map((project, index) => {
                  const avatar = getCompanyAvatar(project);
                  const hasApplied = isAppliedToProject(project.id);

                  return (
                    <Card
                      key={project.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 shadow-sm"
                      onClick={() => setSelectedProject(project.id)}
                      style={{
                        transitionDelay: `${index * 200}ms`,
                        animation: isLoaded
                          ? `fadeIn 0.5s ease-out ${index * 200 + 1000}ms both`
                          : "none",
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
                                    avatar.bgColor || "bg-gray-500"
                                  } rounded-md flex items-center justify-center text-white font-bold text-xl`}
                                >
                                  {avatar.type === "image" ? (
                                    <Image
                                      src="/images/shakers-logo.png"
                                      alt={avatar.alt!}
                                      width={56}
                                      height={56}
                                      className="rounded-md"
                                    />
                                  ) : (
                                    <span
                                      className={
                                        avatar.content === "uber"
                                          ? "text-sm"
                                          : "text-xl"
                                      }
                                    >
                                      {avatar.content}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500 font-medium mt-1 block text-center">
                                  {project.company?.name || "Company"}
                                </span>
                              </div>

                              {/* Project Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 mb-1">
                                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2 flex-1">
                                    {project.title}
                                  </h3>
                                  {hasApplied && (
                                    <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5 ml-2 flex-shrink-0">
                                      Aplicado
                                    </Badge>
                                  )}
                                </div>

                                <p className="text-xs text-green-600 mb-2">
                                  {project.specialty?.name ||
                                    project.description}
                                  {project.price && (
                                    <>
                                      {" | "}
                                      <Euro className="w-3 h-3 inline" />{" "}
                                      {project.price}
                                    </>
                                  )}
                                </p>

                                {project.hours && (
                                  <p className="text-xs text-green-600 mb-3 flex items-center">
                                    <Clock className="w-3 h-3 mr-1 text-green-600" />{" "}
                                    {project.hours}
                                  </p>
                                )}

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1 md:gap-2">
                                  {(project.skills || [])
                                    .slice(0, 4)
                                    .map((skill, skillIndex) => (
                                      <Badge
                                        key={skillIndex}
                                        variant="secondary"
                                        className="text-[10px] md:text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-2 py-0.5"
                                      >
                                        {skill.name}
                                      </Badge>
                                    ))}
                                  {(project.skills || []).length > 4 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] md:text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-2 py-0.5"
                                    >
                                      +{(project.skills || []).length - 4}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Section - 5% width containing only the arrow icon */}
                          <div className="w-[5%] border-l border-gray-200 items-center justify-center min-h-[120px] hidden sm:flex">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-gray-900"
                            >
                              <path
                                d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center pt-6">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loading}
                      variant="outline"
                      className="min-w-[150px]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Cargando...
                        </>
                      ) : (
                        "Cargar más proyectos"
                      )}
                    </Button>
                  </div>
                )}

                {/* No more projects message */}
                {!hasMore && projects.length > 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No hay más proyectos para mostrar
                  </div>
                )}

                {/* No projects found */}
                {!loading && projects.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Filter className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No se encontraron proyectos
                    </h3>
                    <p className="text-gray-600">
                      Intenta ajustar tus filtros de búsqueda
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <FilterModal
          onClose={() => setShowFilter(false)}
          onApplyFilters={applyFilters}
          currentFilters={appliedFilters}
        />
      )}
    </div>
  );
}
