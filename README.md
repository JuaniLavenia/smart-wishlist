# Smart Wishlist

<img src="https://img.shields.io/badge/React-19-blue?style=flat&logo=react" alt="React 19"> <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript" alt="TypeScript 5"> <img src="https://img.shields.io/badge/Vite-8-purple?style=flat&logo=vite" alt="Vite 8"> <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat&logo=tailwind-css" alt="Tailwind 4">

## Descripción

**Smart Wishlist** es una aplicación web para comparar precios de productos en múltiples tiendas argentinas. Agregá productos a tu lista de deseados, buscá precios en MercadoLibre, Fravega, Cetrogar, On City, Megatone y Whirlpool, y guardá tus favoritos.

### Características

- ✅ Agregar productos a tu wishlist
- 🔍 Buscar precios en múltiples tiendas
- ❤️ Guardar favoritos con persistencia local
- 🎨 Modo claro/oscuro
- 📊 Control de uso de API (250 búsquedas/mes)
- ⚙️ Configuración de tiendas habilitadas
- 📱 Diseño responsive y elegante

## Tech Stack

| Tecnología | Propósito |
|------------|-----------|
| React 19 | UI Framework |
| TypeScript 5 | Tipado estático |
| Vite 8 | Build tool |
| TailwindCSS 4 | Estilos |
| Zustand | Estado global |
| TanStack Query | Cache de datos |
| React Router 7 | Navegación |
| MSW | Mock de API |
| SerpApi | Búsqueda de precios |

## Instalación

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Build para producción
pnpm build

# Previsualizar build
pnpm preview
```

## Configuración

### API de SerpApi

1. Obtené tu API key en [serpapi.com](https://serpapi.com)
2. Creá un archivo `.env` en la raíz:
```env
VITE_SERPAPI_API_KEY=tu_api_key_aqui
```

### Tiendas disponibles

- MercadoLibre
- Fravega
- Cetrogar
- On City
- Megatone
- Whirlpool

Podés habilitar/deshabilitar tiendas desde la página de Configuración.

## Estructura del proyecto

```
src/
├── components/       # Componentes React
│   ├── atoms/       # Bloques básicos (Button, Input, Badge)
│   ├── molecules/   # Componentes compuestos
│   └── organisms/   # Componentes complejos
├── pages/           # Páginas de la app
├── stores/          # Zustand stores
├── hooks/           # Custom hooks
├── services/        # Servicios API
├── mocks/           # MSW mocks
├── types/           # TypeScript types
└── lib/             # Utilidades
```

## Licencia

MIT