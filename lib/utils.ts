import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utilidad para combinar clases CSS de manera eficiente
 * Combina clsx para condiciones y tailwind-merge para resolver conflictos de Tailwind
 * 
 * @param inputs - Array de valores de clase (strings, objetos condicionales, etc.)
 * @returns String con las clases CSS combinadas y optimizadas
 * 
 * @example
 * cn('px-2 py-1', 'bg-red-500', { 'text-white': isActive })
 * cn('p-4', 'p-2') // Resultado: 'p-2' (tailwind-merge resuelve el conflicto)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
