export interface Project {
  id: string
  title: string
  description: string
  status: 'PUBLISHED' | 'DRAFT'
  price?: string
  hours?: string
  startDate?: string
  estimatedBudget?: number
  requiredTalents?: number
  skills: Skill[]
  specialty?: Specialty
  industry?: Industry
  category?: Category
  subcategory?: Subcategory
  createdAt: string
  updatedAt: string
  company?: {
    id: string
    name: string
    logo?: string
  }
}

export interface Specialty {
  id: string
  name: string
}

export interface Skill {
  id: string
  name: string
}

export interface Industry {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
}

export interface Subcategory {
  id: string
  name: string
  categoryId: string
}

export interface Application {
  id: string
  userId: string
  projectId: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'APPLIED' | 'WITHDRAWN'
  createdAt: string
  updatedAt: string
  project?: Project
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ProjectsResponse extends PaginatedResponse<Project> {}

export interface ProjectFilters {
  status?: 'PUBLISHED' | 'DRAFT'
  specialties?: string[]
  skills?: string[]
  industry?: string
  category?: string
  subcategory?: string
  q?: string
  page?: number
  limit?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

export interface ApiError {
  message: string
  statusCode?: number
  code?: string
}