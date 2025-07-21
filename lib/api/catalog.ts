import { apiClient } from './client'
import { Specialty, Skill, Industry, Category, Subcategory } from '@/types/api'

export const catalogService = {
  async getSpecialties(): Promise<Specialty[]> {
    return apiClient.get<Specialty[]>('/specialties')
  },

  async getSkills(): Promise<Skill[]> {
    return apiClient.get<Skill[]>('/skills')
  },

  async getIndustries(): Promise<Industry[]> {
    return apiClient.get<Industry[]>('/industries')
  },

  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories')
  },

  async getSubcategories(): Promise<Subcategory[]> {
    return apiClient.get<Subcategory[]>('/subcategories')
  },

}