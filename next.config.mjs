/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilita el modo estricto de React para detectar problemas potenciales
  reactStrictMode: true,
  // Utiliza SWC para minificación mejorada del código
  swcMinify: true,
  eslint: {
    // Ignora errores de ESLint durante la construcción (configuración de desarrollo)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora errores de TypeScript durante la construcción (configuración de desarrollo)
    ignoreBuildErrors: true,
  },
  images: {
    // Desactiva la optimización de imágenes (compatible con exportación estática)
    unoptimized: true,
  },
}

export default nextConfig
