import { useState, useEffect } from 'react'
import { catalogService } from '@/lib/api/catalog'
import { Specialty, Skill, Industry, Category, Subcategory, ApiError } from '@/types/api'

interface CatalogData {
  specialties: Specialty[]
  skills: Skill[]
  industries: Industry[]
  categories: Category[]
  subcategories: Subcategory[]
}

interface UseCatalogReturn {
  data: CatalogData
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCatalog(): UseCatalogReturn {
  const [data, setData] = useState<CatalogData>({
    specialties: [],
    skills: [],
    industries: [],
    categories: [],
    subcategories: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCatalogData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [specialties, skills, industries, categories, subcategories] = await Promise.all([
        catalogService.getSpecialties(),
        catalogService.getSkills(),
        catalogService.getIndustries(),
        catalogService.getCategories(),
        catalogService.getSubcategories(),
      ])

      setData({
        specialties,
        skills,
        industries,
        categories,
        subcategories,
      })
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error loading catalog data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCatalogData()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchCatalogData,
  }
}

export function useSubcategoriesByCategory(categoryId?: string) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!categoryId) {
      setSubcategories([])
      return
    }

    const fetchSubcategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await catalogService.getSubcategoriesByCategory(categoryId)
        setSubcategories(data)
      } catch (err) {
        const apiError = err as ApiError
        setError(apiError.message || 'Error loading subcategories')
        setSubcategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchSubcategories()
  }, [categoryId])

  return { subcategories, loading, error }
}