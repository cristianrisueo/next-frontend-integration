# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 freelance project search platform built with TypeScript, React, and Tailwind CSS. The application is configured in Spanish ("Buscar Proyectos" - Search Projects) and uses shadcn/ui components for the UI.

## Development Commands

- **Development server**: `npm run dev` or `pnpm dev`
- **Build**: `npm run build` or `pnpm build`  
- **Production server**: `npm run start` or `pnpm start`
- **Lint**: `npm run lint` or `pnpm lint`

Note: This project uses pnpm as the package manager (pnpm-lock.yaml present).

## Architecture & Key Technologies

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives via shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode support

### Project Structure
- `app/`: Next.js App Router pages and layouts
- `components/`: React components including custom components and shadcn/ui components
- `components/ui/`: shadcn/ui components (accordion, button, card, etc.)
- `hooks/`: Custom React hooks
- `lib/`: Utility functions
- `public/images/`: Static assets

### Key Components
- `ProjectListing`: Main component rendered on the home page
- `ThemeProvider`: Wraps the app for theme switching
- `FilterModal`, `MobileNav`, `ProjectDetail`: Core application components

### Configuration
- **Path aliases**: `@/*` maps to the root directory
- **shadcn/ui**: Configured with default style, RSC support, and Lucide icons
- **Build config**: ESLint and TypeScript errors ignored during builds (dev convenience)
- **Images**: Unoptimized (likely for static export compatibility)

## Development Notes

- The application is set up with React Strict Mode and SWC minification
- CSS variables are used for theming with HSL color values
- TypeScript is configured with strict mode enabled
- Dark mode support is implemented via CSS classes