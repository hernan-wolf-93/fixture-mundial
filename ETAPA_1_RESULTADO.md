# Etapa 1 — Resultado: Fundamentos del Proyecto

> **Proyecto:** World Cup 2022 — Fixture Manager  
> **Archivo de arquitectura:** `ARQUITECTURA.md` (en el directorio raíz del TFI)  
> **Fecha:** 30 de Mayo de 2026

---

## 1. Resumen de la etapa realizada

Se completó la **Etapa 1 (Sprint 1)** definida en `ARQUITECTURA.md`. El objetivo fue establecer todos los fundamentos del proyecto: scaffolding, tipado completo, estado global, persistencia, layout base y navegación entre páginas.

**Logros principales:**

- Proyecto Vite + React + TypeScript + TailwindCSS v4 funcional y compilando sin errores
- 5 tipos TypeScript definidos (`team.ts`, `match.ts`, `standing.ts`, `playoff.ts`, `stats.ts`) más el archivo `index.ts` que unifica todos los tipos
- Estado global con `Context + useReducer` con persistencia automática en `localStorage`
- 32 equipos reales del Mundial Qatar 2022 precargados
- 64 partidos con fixture completo (48 fase de grupos + 16 eliminatorias)
- Layout responsivo con navegación entre 5 páginas (Teams, Groups, Fixture, Playoffs, Stats)
- Componentes UI reutilizables: `FlagIcon`, `Badge`, `Modal`
- Lógica de cálculo de tabla de posiciones con criterios FIFA (puntos → DG → GF → head-to-head)

---

## 2. Archivos creados

### 2.1 Archivos del proyecto base (generados por Vite)

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Entry point HTML (modificado: lang a español, title cambiado) |
| `package.json` | Dependencias y scripts del proyecto |
| `tsconfig.json` | Configuración TypeScript raíz (referencia a tsconfig.app.json y tsconfig.node.json) |
| `tsconfig.app.json` | Configuración TS para la app (ES2023, JSX react-jsx, strict) |
| `tsconfig.node.json` | Configuración TS para Vite/config |
| `vite.config.ts` | Configuración de Vite con plugins React + TailwindCSS |
| `eslint.config.js` | Configuración de linter |
| `public/favicon.svg` | Favicon del proyecto |

### 2.2 Tipos TypeScript (`src/types/`)

| Archivo | Contenido |
|---------|-----------|
| `team.ts` | `Team`, `GroupLetter` |
| `match.ts` | `Match`, `MatchResult`, `GoalEvent`, `MatchStage`, `MatchStatus` |
| `standing.ts` | `Standing`, `GroupStandings` |
| `playoff.ts` | `BracketMatch`, `BracketRound`, `BracketRoundName` |
| `stats.ts` | `ScorerEntry`, `AssisterEntry` |
| `index.ts` | Re-export de todos los tipos + interfaz `AppState` |

### 2.3 Datos (`src/data/`)

| Archivo | Contenido |
|---------|-----------|
| `teams.ts` | Array con 32 equipos del Mundial 2022 (id, nombre, código de bandera ISO, grupo) |
| `matches.ts` | Array con 64 partidos: 48 de fase de grupos y 16 de eliminatorias. Incluye helpers `getTeamById`, `getTeamsByGroup`, `getMatchesByStage`, `getMatchesByGroup` |
| `initialData.ts` | Estado inicial `AppState` con standings vacíos calculados a partir de los equipos |

### 2.4 Estado global (`src/state/`)

| Archivo | Contenido |
|---------|-----------|
| `actions.ts` | Tipo `AppAction` con 4 acciones: `SET_MATCH_RESULT`, `RESET_MATCH_RESULT`, `RESET_ALL`, `SET_TOURNAMENT_STAGE` |
| `appReducer.ts` | Reducer puro que maneja las acciones. Incluye `recalculateStandings()` con lógica completa de puntuación (3/1/0), cálculo de diferencia de goles, y `sortStandings()` con criterios FIFA: puntos → DG → GF → head-to-head |
| `AppContext.tsx` | Provider que envuelve la app con Context + useReducer. Carga estado desde localStorage al iniciar y persiste automáticamente en cada cambio |
| `localStorage.ts` | Funciones `saveState()`, `loadState()`, `clearState()` con manejo de errores |

### 2.5 Hooks (`src/hooks/`)

| Archivo | Contenido |
|---------|-----------|
| `useAppContext.ts` | Hook personalizado que expone `{ state, dispatch }` con validación de contexto |

### 2.6 Componentes de layout (`src/components/layout/`)

| Archivo | Contenido |
|---------|-----------|
| `Header.tsx` | Barra superior con logo, título "World Cup 2022" y subtítulo "Fixture Manager". Fondo gradient azul |
| `Navbar.tsx` | Barra de navegación con 5 links: Teams, Groups, Fixture, Playoffs, Stats. Usa `NavLink` de React Router con estilo active |
| `Layout.tsx` | Layout shell que combina Header + Navbar + `<Outlet />` para el contenido de cada ruta |

### 2.7 Componentes UI (`src/components/ui/`)

| Archivo | Contenido |
|---------|-----------|
| `FlagIcon.tsx` | Componente que renderiza banderas vía CDN flagcdn.com con 3 tamaños (sm/md/lg) |
| `Badge.tsx` | Etiqueta con 4 variantes de color (default/success/warning/danger) |
| `Modal.tsx` | Modal genérico con overlay, botón de cierre y tecla Escape |

### 2.8 Páginas (`src/pages/`)

| Archivo | Contenido |
|---------|-----------|
| `HomePage.tsx` | Página principal con lista de equipos agrupados por grupo. Muestra bandera, nombre, código y badge con cantidad |
| `GroupsPage.tsx` | Tablas de posiciones completas con columnas #, Equipo, PJ, PG, PE, PP, GF, GC, DG, PTS. Resalta top 2 con badge "Q" y fondo verde |
| `FixturePage.tsx` | Fixture interactivo con tabs por grupo, organizado por rondas. Muestra fecha, hora, equipos y resultado si está cargado |
| `PlayoffsPage.tsx` | Placeholder para fase eliminatoria. Muestra mensaje informativo hasta que se completen los grupos |
| `StatsPage.tsx` | Placeholder para estadísticas. Muestra secciones de goleadores y asistidores con mensajes informativos |

### 2.9 Punto de entrada

| Archivo | Contenido |
|---------|-----------|
| `App.tsx` | Configura `BrowserRouter` + `AppProvider` + 5 rutas anidadas bajo `<Layout />` |
| `main.tsx` | Renderiza `<App />` dentro de `<StrictMode>` |
| `index.css` | Importa TailwindCSS v4 con `@import "tailwindcss"` y estilos base mínimos |

---

## 3. Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `index.html` | `lang="es"`, título cambiado a "World Cup 2022 — Fixture Manager" |
| `vite.config.ts` | Agregado plugin `@tailwindcss/vite` |
| `src/index.css` | Reemplazado completamente: ahora solo importa TailwindCSS v4 |
| `src/main.tsx` | Limpiado (eliminados imports de assets que ya no existen) |
| `src/App.tsx` | Reemplazado completamente con routing |
| `package.json` | Agregadas dependencias `tailwindcss`, `@tailwindcss/vite`, `react-router-dom` |
| Eliminado `src/App.css` | No necesario con TailwindCSS |
| Eliminado `src/assets/` | Contenido del scaffolding default |
| Eliminado `public/icons.svg` | No utilizado |

---

## 4. Dependencias instaladas

### 4.1 Dependencias de producción

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `react` | ^19.x | Biblioteca UI |
| `react-dom` | ^19.x | Renderizado DOM |
| `react-router-dom` | ^7.x | Routing SPA |

### 4.2 Dependencias de desarrollo

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `typescript` | ^5.x | Tipado estático |
| `vite` | ^8.x | Build tool |
| `@vitejs/plugin-react` | ^4.x | Plugin Vite para React |
| `tailwindcss` | ^4.x | Framework CSS utility-first |
| `@tailwindcss/vite` | ^4.x | Plugin Vite para TailwindCSS v4 |

---

## 5. Configuraciones realizadas

### 5.1 Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

TailwindCSS v4 se integra como plugin de Vite, sin necesidad de archivo `tailwind.config.js` ni `postcss.config.js`.

### 5.2 TypeScript (`tsconfig.app.json`)

- `target`: ES2023
- `moduleResolution`: bundler
- `jsx`: react-jsx
- `strict`: habilitado via strict mode de Vite template
- `verbatimModuleSyntax`: true (requiere `import type` para imports de solo tipos)
- `noUnusedLocals` / `noUnusedParameters`: true

### 5.3 TailwindCSS (`src/index.css`)

```css
@import "tailwindcss";
```

TailwindCSS v4 usa el enfoque de "CSS-first configuration". No se necesita archivo de configuración separado.

### 5.4 Routing (`App.tsx`)

- `BrowserRouter` como router raíz
- 5 rutas anidadas bajo `<Layout />` que provee Header + Navbar + Outlet
- `AppProvider` envuelve todas las rutas para acceso global al estado

---

## 6. Decisiones técnicas tomadas

### 6.1 TailwindCSS v4 en lugar de v3

TailwindCSS v4 elimina la necesidad de archivos de configuración (`tailwind.config.js`, `postcss.config.js`) y se integra directamente como plugin de Vite. La sintaxis cambió de directivas `@tailwind` a `@import "tailwindcss"`. Esto reduce la configuración y acelera el build.

### 6.2 FlagCDN.com para banderas

Las banderas se obtienen desde `https://flagcdn.com` en lugar de incluir SVG locales. Ventajas:
- Sin assets pesados en el repositorio
- 2x resolución automática con `srcSet`
- Sin dependencias de librerías de iconos

### 6.3 Estados vacíos en páginas Playoffs y Stats

Se optó por mostrar mensajes informativos en lugar de páginas vacías o errores. Esto guía al usuario sobre qué acción tomar para desbloquear esas secciones (completar fase de grupos para playoffs, cargar goles para estadísticas).

### 6.4 Persistencia automática en localStorage

Se implementó `useEffect` en `AppContext.tsx` que guarda el estado automáticamente cada vez que cambia. Esto asegura que:
- No se pierden datos al recargar la página (requisito no opcional de la evaluación)
- La serialización es JSON directa del `AppState`
- Se manejan errores de `localStorage` (cuota excedida, deshabilitado)

### 6.5 Separación estricta lógica/presentación

El reducer (`appReducer.ts`) contiene toda la lógica de negocio: cálculo de puntos, ordenamiento, head-to-head. Los componentes solo leen el estado y muestran datos. Esto cumple con el requisito de "separación de responsabilidades" del punto 4.2 de las instrucciones.

### 6.6 Cálculo de head-to-head correcto

El criterio 4 de desempate FIFA (resultado del enfrentamiento directo) se implementó buscando el partido entre los dos equipos empatados y determinando quién ganó ese encuentro. Solo se aplica si el partido existe y tiene resultado.

### 6.7 Uso de `GroupStandings` como `Record<GroupLetter, Standing[]>`

En lugar de un array plano, se usó un Record indexado por letra de grupo. Esto permite acceso O(1) a las posiciones de cualquier grupo y evita filtrados repetitivos.

---

## 7. Problemas encontrados y soluciones

### 7.1 Timeout en `npm install` inicial

**Problema:** El primer `npm install` del scaffolding tardó más de 2 minutos y superó el timeout de 120s.
**Solución:** Se retry con timeout de 300s, que fue suficiente.

### 7.2 `mkdir -p` no funciona en PowerShell

**Problema:** El comando `mkdir -p src/types src/data ...` falló porque PowerShell no acepta múltiples argumentos con `-p`.
**Solución:** Se usó `New-Item -ItemType Directory` con un pipeline sobre un array de rutas.

### 7.3`verbatimModuleSyntax` requiere `import type`

**Problema:** El `tsconfig.app.json` del template de Vite incluye `"verbatimModuleSyntax": true`. Esto significa que los imports de solo tipos deben usar `import type { ... }`.
**Solución:** Todos los archivos usan `import type` para tipos y `import` para valores. TypeScript compila sin errores.

### 7.4 `remove-item` falló para `public/vite.svg`

**Problema:** El archivo `public/vite.svg` no existía (posiblemente el template no lo incluye).
**Solución:** El error es inofensivo, el archivo no era necesario. Continuó la ejecución.

---

## 8. Estado actual del proyecto

```
fixture-mundial/
├── index.html (modificado)
├── package.json
├── vite.config.ts (modificado)
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── ETAPA_1_RESULTADO.md (este archivo)
├── public/
│   ├── favicon.svg
│   └── flags/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   ├── index.ts
│   │   ├── team.ts
│   │   ├── match.ts
│   │   ├── standing.ts
│   │   ├── playoff.ts
│   │   └── stats.ts
│   ├── data/
│   │   ├── teams.ts
│   │   ├── matches.ts
│   │   └── initialData.ts
│   ├── logic/             (vacío para Etapa 2)
│   ├── state/
│   │   ├── actions.ts
│   │   ├── appReducer.ts
│   │   ├── AppContext.tsx
│   │   └── localStorage.ts
│   ├── hooks/
│   │   └── useAppContext.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Layout.tsx
│   │   ├── ui/
│   │   │   ├── FlagIcon.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Modal.tsx
│   │   ├── teams/         (vacío para Etapa 2)
│   │   ├── groups/        (vacío para Etapa 2)
│   │   ├── matches/       (vacío para Etapa 2)
│   │   ├── playoffs/      (vacío para Etapa 2)
│   │   └── stats/         (vacío para Etapa 2)
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── GroupsPage.tsx
│   │   ├── FixturePage.tsx
│   │   ├── PlayoffsPage.tsx
│   │   └── StatsPage.tsx
│   └── utils/             (vacío para futuras etapas)
└── dist/                  (build generado)
```

**28 archivos fuente** en total, todos compilando sin errores TypeScript y build de producción exitoso.

---

## 9. Instrucciones para ejecutar y probar

### 9.1 Requisitos previos

- Node.js >= 18
- npm >= 9

### 9.2 Instalación y ejecución

```bash
# Entrar al directorio del proyecto
cd fixture-mundial

# Instalar dependencias (si no se hizo antes)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Esto abre la app en `http://localhost:5173`.

### 9.3 Build de producción

```bash
npm run build
```

Genera la carpeta `dist/` con los archivos optimizados.

### 9.4 Preview del build

```bash
npm run preview
```

### 9.5 Prueba manual de funcionalidades

1. **Teams** (`/`): Verificar que los 32 equipos aparecen organizados en 8 grupos con banderas
2. **Groups** (`/groups`): Tablas de posiciones con 4 equipos cada una, ordenados alfabéticamente (todos 0-0-0-0 inicialmente)
3. **Fixture** (`/fixture`): Navegar entre grupos con los tabs, ver los 3 partidos por ronda
4. **Playoffs** (`/playoffs`): Debe mostrar mensaje "Playoff brackets will appear once the group stage is complete"
5. **Stats** (`/stats`): Debe mostrar mensaje "No goals registered yet"
6. **Persistencia**: Recargar la página en cualquier ruta — no debe perder la navegación ni el estado
7. **Responsive**: Reducir el ancho del navegador — las columnas deben apilarse correctamente

### 9.6 Verificación técnica

```bash
# TypeScript check
npx tsc --noEmit

# Build de producción
npx vite build
```

Ambos comandos deben terminar sin errores.

---

## 10. Próximos pasos (Etapa 2)

La Etapa 2 completará la funcionalidad de fase de grupos:

1. Mover lógica de posiciones a `src/logic/standings.ts` y `tiebreakers.ts`
2. Refinar componente `GroupStandingsTable` con animaciones
3. Agregar `MatchEngine` para procesar resultados individuales
4. Implementar `MatchForm` modal para carga de resultados con goles
5. Conectar `FixturePage` con el estado para permitir carga de resultados
