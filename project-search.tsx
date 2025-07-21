import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, Plus, ChevronRight, User } from "lucide-react"

export default function Component() {
  const projects = [
    {
      id: 1,
      title: "Diseña una app móvil para un SaaS de contabilidad",
      description: "Desarrollo de apps | Educación",
      price: "25 - 35 €/h",
      skills: ["React", "Sketch", "Next.js", "Figma"],
      icon: "😊",
      bgColor: "bg-blue-500",
    },
    {
      id: 2,
      title: "Desarrolla una plataforma de e-learning",
      description: "Desarrollo web",
      price: "30 - 40 €/h",
      skills: ["Svelte", "GitHub", "Node.js", "Adobe XD"],
      icon: "S",
      bgColor: "bg-gray-400",
    },
    {
      id: 3,
      title: "Crea un CRM personalizado para pymes",
      description: "Negocios",
      price: "20 - 30 €/h",
      skills: ["Angular", "Bitbucket", "Figma.js", "Sketch"],
      icon: "uber",
      bgColor: "bg-black",
    },
    {
      id: 4,
      title: "Desarrollar una estrategia de marketing digital",
      description: "Marketing | Estrategias",
      price: "25 - 35 €/h",
      skills: ["Google Ads", "Twitter", "SEO", "Adobe Illustrator"],
      icon: "B",
      bgColor: "bg-black",
    },
    {
      id: 5,
      title: "Diseñar una interfaz de usuario para la nueva aplicación",
      description: "Diseño | UX/UI",
      price: "25-500€",
      skills: ["Figma", "Zira", "HTML/CSS", "Webflow"],
      icon: "?",
      bgColor: "bg-green-600",
    },
    {
      id: 6,
      title: "Implementar un sistema de gestión de contenidos",
      description: "Desarrollo | Tecnologías",
      price: "22 - 32 €/h",
      skills: ["React", "GitHub", "Node.js", "Adobe XD"],
      icon: "C",
      bgColor: "bg-pink-400",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Buscar Proyectos</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filtrar
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Plus className="w-4 h-4" />
              publicación
            </Button>
          </div>
        </div>

        {/* Project List */}
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Project Icon */}
                  <div
                    className={`w-12 h-12 ${project.bgColor} rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                  >
                    {project.icon === "uber" ? <span className="text-sm font-bold">uber</span> : project.icon}
                  </div>

                  {/* Project Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{project.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {project.description} | {project.price}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
