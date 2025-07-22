# Shakers Frontend Application

Aplicación frontend para prueba técnica de Shakers, desarrollada con Next.js 14 siguiendo las mejores prácticas de React y diseño responsivo. Plataforma de búsqueda de proyectos freelance con sistema completo de filtrado, aplicaciones y gestión de candidatos.

## 🛠️ Tecnologías

- **Next.js 14** - Framework de React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utilitario
- **shadcn/ui** - Componentes UI primitivos de Radix UI
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Lucide React** - Iconografía
- **next-themes** - Gestión de temas oscuro/claro
- **date-fns** - Manipulación de fechas
- **Recharts** - Gráficos y visualizaciones

## 🏗️ Arquitectura

El proyecto implementa **Component-Driven Architecture** con separación clara de responsabilidades:

```
app/
├── globals.css                # Estilos globales con variables CSS
├── layout.tsx                 # Layout principal con proveedores
└── page.tsx                   # Página principal

components/
├── ui/                        # Componentes shadcn/ui
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   └── ...
├── project-listing.tsx        # Listado principal de proyectos
├── project-detail.tsx         # Vista detallada de proyecto
├── filter-modal.tsx           # Modal de filtros avanzados
├── mobile-nav.tsx             # Navegación móvil
├── footer.tsx                 # Pie de página
├── floating-notification.tsx  # Notificaciones del sistema
└── theme-provider.tsx         # Proveedor de temas

lib/
├── api/                       # Capa de integración con API
│   ├── client.ts              # Cliente HTTP centralizado
│   ├── projects.ts            # Servicios de proyectos
│   ├── catalog.ts             # Servicios de catálogos
│   └── applications.ts        # Servicios de aplicaciones
├── hooks/                     # Hooks personalizados para estado
│   ├── useProjects.ts         # Gestión de proyectos
│   ├── useCatalog.ts          # Gestión de catálogos
│   └── useApplications.ts     # Gestión de aplicaciones
├── utils/                     # Utilidades
│   └── debug.ts               # Herramientas de debugging
└── utils.ts                   # Funciones utilitarias generales

hooks/
└── use-mobile.tsx             # Hook para detección de dispositivos móviles

types/
├── api.ts                     # Interfaces para respuestas de API
└── filters.ts                 # Tipos para sistema de filtros
```

### Dominios de la Aplicación

1. **Proyectos**: Listado, búsqueda y visualización detallada de proyectos freelance
2. **Aplicaciones**: Sistema de postulación y gestión de candidaturas
3. **Catálogos**: Especialidades, habilidades, industrias y categorías para filtrado
4. **Usuarios**: Gestión de perfil y estado de aplicaciones

## ⚡ Comandos Principales

### Desarrollo

```bash
npm dev                   # Servidor de desarrollo con hot reload
npm build                 # Compilar para producción
npm start                 # Servidor de producción
```

### Calidad de Código

```bash
npm lint                  # ESLint con auto-fix
npm type-check            # Verificación de tipos TypeScript
```

### Gestión de Dependencias

```bash
npm install               # Instalar dependencias
npm add <paquete>         # Añadir nueva dependencia
npm add -D <paquete>      # Añadir dependencia de desarrollo
```

## 🚀 Instalación y Configuración

1. **Clonar repositorio**

```bash
git clone <url-repositorio>
cd next-frontend
```

2. **Instalar dependencias**

```bash
npm install
```

2. **Verificar configuración del backend**

Asegúrate de que el backend esté ejecutándose en `http://localhost:3001`

5. **Ejecutar en desarrollo**

```bash
npm run dev
```

6. **Acceder a la aplicación**

Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## 🌐 Integración con API

### Endpoints Integrados

**Catálogos:**

- `GET /specialties` - Especialidades técnicas
- `GET /skills` - Habilidades específicas
- `GET /industries` - Sectores industriales
- `GET /categories` - Categorías de proyectos
- `GET /subcategories` - Subcategorías

**Proyectos:**

- `GET /projects` - Listado con filtros y paginación
- `GET /projects/:id` - Proyecto específico
- `GET /projects/search` - Búsqueda avanzada

**Aplicaciones:**

- `POST /projects/:id/apply` - Aplicar a proyecto
- `DELETE /projects/:id/apply` - Retirar aplicación
- `GET /applications/my` - Mis aplicaciones

### Cliente HTTP

El proyecto utiliza un cliente HTTP centralizado (`lib/api/client.ts`) que proporciona:

- **Manejo de errores** automático con retry
- **Interceptores** para request/response
- **Timeout** configurable
- **Base URL** centralizada
- **Headers** consistentes

## 🎨 Sistema de Diseño

### Componentes shadcn/ui

- **Accordion** - Paneles colapsables
- **Alert Dialog** - Diálogos de confirmación
- **Badge** - Etiquetas y estados
- **Button** - Botones con variantes
- **Card** - Contenedores de contenido
- **Dialog** - Modales y overlays
- **Dropdown Menu** - Menús contextuales
- **Input** - Campos de entrada
- **Label** - Etiquetas de formulario
- **Select** - Selectores dropdown
- **Tabs** - Navegación por pestañas
- **Toast** - Notificaciones temporales

### Temas

- **Variables CSS** para colores consistentes
- **Responsive design** con breakpoints Tailwind
- **Animaciones** suaves con `tailwindcss-animate`

## 📱 Características Principales

### Sistema de Filtrado Avanzado

- **Filtros múltiples**: Especialidades, habilidades, industrias, categorías
- **Búsqueda en tiempo real** dentro de cada categoría
- **Persistencia de filtros** aplicados
- **Aplicación automática** al seleccionar filtros
- **Indicadores visuales** de filtros activos

### Gestión de Proyectos

- **Listado responsivo** con cards de proyecto
- **Paginación** con "Cargar más"
- **Estados de carga** con skeletons
- **Vista detallada** modal con información completa
- **Sistema de aplicaciones** integrado

### Experiencia de Usuario

- **Loading states** para todas las operaciones asíncronas
- **Error handling** con mensajes amigables
- **Optimistic updates** para aplicaciones
- **Feedback visual** para acciones del usuario
- **Responsive design** mobile-first

### Navegación

- **Navegación móvil** colapsable
- **Header responsivo** con logo y controles
- **Footer informativo** con enlaces relevantes
- **Breadcrumbs** en vistas detalladas

## 🔧 Hooks Personalizados

### useProjects

```typescript
const { projects, loading, error, hasMore, loadMore, refresh, applyFilters } =
  useProjects(initialFilters);
```

### useCatalog

```typescript
const { specialties, skills, industries, categories, loading, error } =
  useCatalog();
```

### useApplications

```typescript
const { applications, apply, withdraw, isApplying, hasApplied } =
  useApplications(userId);
```

## 🧪 Testing y Calidad

### Verificación de Tipos

```bash
npm type-check
```

### Linting

```bash
npm lint              # Verificar código
npm lint --fix        # Corregir automáticamente
```

### Testing Manual

1. **Verificar conexión con backend**:

   ```bash
   curl http://localhost:3001/projects
   ```

2. **Probar funcionalidades**:
   - [ ] Carga de proyectos desde API
   - [ ] Sistema de filtrado funcional
   - [ ] Aplicación/retiro de candidaturas
   - [ ] Estados de carga y error
   - [ ] Responsividad en móvil y desktop
   - [ ] Tema oscuro/claro

## 🏗️ Estructura de Tipos

### Interfaces Principales

```typescript
// types/api.ts
interface Project {
  id: string;
  title: string;
  description: string;
  budget: ProjectBudget;
  organization: string;
  skills: Skill[];
  specialty: Specialty;
  // ...
}

interface Application {
  id: string;
  projectId: string;
  userId: string;
  status: ApplicationStatus;
  appliedAt: string;
}
```

### Sistema de Filtros

```typescript
// types/filters.ts
interface ProjectFilters {
  specialties: string[];
  skills: string[];
  industries: string[];
  categories: string[];
  search?: string;
}
```

## 🔄 Flujo de Desarrollo

1. **Modificar componentes UI** en `components/`
2. **Actualizar tipos** en `types/` si es necesario
3. **Implementar hooks** para lógica de estado
4. **Integrar con API** usando servicios en `lib/api/`
5. **Verificar tipos y linting**:

```bash
npm type-check && npm lint
```

6. **Probar en desarrollo**:

```bash
npm dev
```

## 📋 Configuración

### Next.js

- **App Router** habilitado
- **TypeScript** en modo estricto
- **SWC** para minificación
- **React Strict Mode** activado
- **Imágenes** no optimizadas (para export estático)

### Tailwind CSS

- **Dark mode** con strategy "class"
- **Variables CSS** para temas
- **Configuración shadcn/ui** integrada
- **Plugins** de animación incluidos

### shadcn/ui

- **Configuración RSC** habilitada
- **TypeScript** por defecto
- **Lucide icons** como librería de iconos
- **Path aliases** configurados

## 🚀 Producción

### Build de Producción

```bash
npm build
```

### Verificación Pre-deploy

1. Build exitoso sin errores de TypeScript
2. Linting sin warnings críticos
3. Pruebas manuales de funcionalidades core
4. Verificación de responsive design
5. Testing de integración con API

### Variables de Entorno

```bash
# Producción
NEXT_PUBLIC_API_URL=https://api.shakers.com
NEXT_PUBLIC_APP_NAME=Shakers
NEXT_PUBLIC_APP_DESCRIPTION=Plataforma de búsqueda de proyectos freelance
```

## 📝 Notas de Implementación

- **Component Composition**: Uso extensivo de composición sobre herencia
- **Type Safety**: TypeScript estricto para prevenir errores runtime
- **Performance**: Lazy loading y optimización de re-renders
- **Accessibility**: Componentes accesibles con Radix UI
- **SEO**: Meta tags configurados en layout principal
- **Estado Global**: Gestión de estado local con hooks personalizados
- **Error Boundaries**: Manejo graceful de errores en componentes
- **Code Splitting**: Optimización automática con Next.js

## 🔗 Recursos Adicionales

- [Documentación Next.js 14](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
