import { apiClient } from './client'
import { Specialty, Skill, Industry, Category, Subcategory } from '@/types/api'

/**
 * Servicio para obtener datos del catálogo de la aplicación
 * Maneja la obtención de especialidades, habilidades, industrias y categorías
 */
export const catalogService = {
  /**
   * Obtiene todas las especialidades disponibles
   */
  async getSpecialties(): Promise<Specialty[]> {
    return apiClient.get<Specialty[]>('/specialties')
  },

  /**
   * Obtiene todas las habilidades disponibles
   */
  async getSkills(): Promise<Skill[]> {
    return apiClient.get<Skill[]>('/skills')
  },

  /**
   * Obtiene todas las industrias disponibles
   */
  async getIndustries(): Promise<Industry[]> {
    return apiClient.get<Industry[]>('/industries')
  },

  /**
   * Obtiene todas las categorías de proyecto disponibles
   */
  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories')
  },

  /**
   * Obtiene todas las subcategorías disponibles
   */
  async getSubcategories(): Promise<Subcategory[]> {
    return apiClient.get<Subcategory[]>('/subcategories')
  },

}