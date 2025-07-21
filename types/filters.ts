export interface FilterState {
  especialidades: string[]
  habilidades: string[]
  tipoProyecto: string[]
  industria: string[]
  sortBy?: SortOption
}

export interface FilterOptions {
  especialidades: Array<{ id: string; name: string }>
  habilidades: Array<{ id: string; name: string }>
  tipoProyecto: Array<{ id: string; name: string }>
  industria: Array<{ id: string; name: string }>
}

export type SortOption = 'recent' | 'oldest'