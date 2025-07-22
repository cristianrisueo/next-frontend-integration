import { useState, useEffect } from 'react'
import { catalogService } from '@/lib/api/catalog'
import { Specialty, Skill, Industry, Category, Subcategory, ApiError } from '@/types/api'

/**
 * Datos consolidados del catálogo de la aplicación
 */
interface CatalogData {
  specialties: Specialty[]
  skills: Skill[]
  industries: Industry[]
  categories: Category[]
  subcategories: Subcategory[]
}

/**
 * Interfaz del valor de retorno del hook useCatalog
 */
interface UseCatalogReturn {
  data: CatalogData
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook personalizado para gestionar datos del catálogo
 * Carga y mantiene todas las opciones disponibles para filtros
 * 
 * @returns Objeto con datos del catálogo, estado de carga y funciones de control
 */
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

  /**
   * Obtiene todos los datos del catálogo en paralelo para mejor rendimiento
   */
  const fetchCatalogData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Ejecuta todas las peticiones en paralelo para optimizar tiempo de carga
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

/**
 * Hook para obtener subcategorías filtradas por categoría
 * 
 * @param categoryId - ID de la categoría para filtrar subcategorías
 * @returns Objeto con subcategorías filtradas y estado de carga
 */
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