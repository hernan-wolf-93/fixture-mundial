# Documento Técnico de Arquitectura — Mundial Fútbol App

> **Proyecto:** Trabajo Final Integrador — Programación III  
> **Stack:** React + TypeScript + Vite + TailwindCSS  
> **Fecha:** Mayo 2026

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Análisis de requisitos](#2-análisis-de-requisitos)
3. [Arquitectura del sistema](#3-arquitectura-del-sistema)
4. [Estructura de carpetas](#4-estructura-de-carpetas)
5. [Modelos y tipos](#5-modelos-y-tipos-typescript)
6. [Flujo de datos](#6-flujo-de-datos)
7. [Etapas de implementación](#7-etapas-de-implementación)
8. [Decisiones técnicas](#8-decisiones-técnicas)

---

## 1. Resumen ejecutivo

Aplicación web SPA para gestionar y visualizar un Mundial de fútbol completo. Los datos se almacenan en LocalStorage con un patrón de estado global basado en React Context + useReducer, asegurando persistencia y consistencia. La lógica de negocio (cálculo de posiciones, desempates, llaves, estadísticas) está completamente aislada de la capa de presentación.

---

## 2. Análisis de requisitos

### 2.1 Requisitos obligatorios (nota mínima)

| ID | Requisito | Impacto |
|----|-----------|---------|
| R1 | Lista de equipos con nombre, bandera, grupo | UX/UI |
| R2 | Tabla de posiciones por grupo con columnas PJ, PG, PE, PP, GF, GC, DG, PTS | Lógica + UX |
| R3 | Ordenamiento automático de tabla (pts → DG → GF → head-to-head) | **Lógica (crítico)** |
| R4 | Bracket de eliminación directa (octavos → cuartos → semis → final) | Lógica + UX |
| R5 | Carga interactiva de resultados con selección de partido | Lógica + UX |
| R6 | Protección contra doble carga de resultado | Lógica |
| R7 | Cálculo instantáneo de tabla al ingresar resultado | **Lógica (crítico)** |
| R8 | Sistema de puntuación (3/1/0) correcto | **Lógica (crítico)** |
| R9 | Criterios de desempate FIFA aplicados correctamente | **Lógica (crítico)** |
| R10 | Top de goleadores y asistidores | Lógica |
| R11 | Fecha y hora visible en cada partido | UX |
| R12 | Código modular con separación lógica/presentación | Calidad |
| R13 | README completo | Presentación |

### 2.2 Requisitos opcionales (puntos extra)

| ID | Requisito | Valor |
|----|-----------|-------|
| O1 | Partido por el 3er puesto | Punto extra |
| O2 | Time extra / penales en eliminatorias | Punto extra |
| O3 | Conversión a zona horaria local | Punto extra |
| O4 | Persistencia (LocalStorage) | Recomendado |
| O5 | Modo oscuro | Punto extra |
| O6 | Datos reales (Qatar 2022) | Recomendado |
| O7 | Predicción de resultados | Punto extra |
| O8 | Exportación de datos | Punto extra |

---

## 3. Arquitectura del sistema

### 3.1 Diagrama de capas

```
┌──────────────────────────────────────────────────────────────┐
│                    UI Layer (Components & Pages)             │
│  LandingPage │ TeamList │ TeamPage │ PlayerCard              │
│  GroupStandings │ BracketView │ BracketNode │ MatchCard      │
│  ResultForm │ TopScorers │ TopAssisters │ DevTools           │
│  ChampionCelebrationModal │ Layout │ Navbar │ Header         │
├──────────────────────────────────────────────────────────────┤
│              State Layer (Context + Reducer)                 │
│         AppContext │ useReducer │ Actions │ Dispatch         │
├──────────────────────────────────────────────────────────────┤
│              Logic Layer (Pure Functions)                    │
│  standings │ tiebreakers │ playoffs │ statistics             │
├──────────────────────────────────────────────────────────────┤
│              Persistence Layer                               │
│  localStorageAdapter │ loadState │ saveState                 │
├──────────────────────────────────────────────────────────────┤
│              Data Layer (Static)                             │
│  teams.ts │ matches.ts │ initialData.ts │ squadsData.json    │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Principios de diseño

1. **Unidirectional data flow:** Las acciones del usuario disparan dispatch → el reducer calcula el nuevo estado → los componentes se re-renderizan.
2. **Pure business logic:** Las funciones de lógica (`src/logic/`) son funciones puras sin efectos secundarios ni dependencias del DOM/React.
3. **State atomization:** El estado global es un único objeto serializable (fácil de persistir en LocalStorage).
4. **Inmutabilidad:** Cada acción produce un nuevo estado sin mutar el anterior.

---

## 4. Estructura de carpetas

```
fixture-mundial/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
├── .gitignore
├── README.md
├── ARQUITECTURA.md
├── Instrucciones.md
├── ETAPA_*.md
├── public/
│   ├── favicon.svg
│   ├── imagenes/
│   │   ├── trofeo.png              # Copa Mundial (landing + celebración)
│   │   └── inicio.jpg              # Fondo de la landing page
│   └── videos/
│       └── background.mp4          # Video de fondo del layout
├── src/
│   ├── main.tsx                    # Entry point + render
│   ├── App.tsx                     # Router + Layout + AppProvider
│   ├── index.css                   # Tailwind import + variables CSS
│   │
│   ├── data/                       # Datos estáticos
│   │   ├── teams.ts               # 32 equipos con nombre, grupo, bandera
│   │   ├── matches.ts             # Calendario completo 64 partidos
│   │   ├── initialData.ts         # Estado inicial semilla
│   │   └── squadsData.json        # Planteles completos (26 jugadores x 32 equipos)
│   │
│   ├── types/                      # Tipos TypeScript
│   │   ├── index.ts               # Re-export point + AppState
│   │   ├── team.ts                # Team, GroupLetter
│   │   ├── match.ts               # Match, MatchResult, MatchStage, GoalEvent
│   │   ├── standing.ts            # Standing, GroupStandings
│   │   ├── playoff.ts             # BracketRound, BracketMatch, BracketRoundName
│   │   ├── player.ts              # Player (posición, altura, peso, foto)
│   │   └── stats.ts               # ScorerEntry, AssisterEntry
│   │
│   ├── logic/                      # Lógica de negocio pura (sin React)
│   │   ├── standings.ts           # Calcular tabla de posiciones por grupo
│   │   ├── tiebreakers.ts         # Criterios de desempate FIFA + head-to-head
│   │   ├── playoffs.ts            # Construir bracket + propagar ganadores
│   │   └── statistics.ts          # Goleadores y asistidores
│   │
│   ├── state/                      # Estado global
│   │   ├── AppContext.tsx          # Context + Provider con persistencia
│   │   ├── appReducer.ts          # Reducer (SET_MATCH_RESULT, RESET_ALL, etc.)
│   │   ├── actions.ts             # Tipos de acciones + BulkMatchUpdate
│   │   └── localStorage.ts        # loadState / saveState
│   │
│   ├── hooks/
│   │   └── useAppContext.ts       # Hook tipado para consumir el contexto
│   │
│   ├── utils/
│   │   └── simulation.ts          # Generador de resultados aleatorios realistas
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx         # Encabezado con título
│   │   │   ├── Navbar.tsx         # Navegación principal
│   │   │   └── Layout.tsx         # Shell con video de fondo + header + navbar + outlet
│   │   ├── teams/
│   │   │   ├── TeamList.tsx       # Grilla de equipos agrupados
│   │   │   ├── TeamCard.tsx       # Card individual de equipo
│   │   │   └── PlayerCard.tsx     # Card de jugador con foto, posición, datos
│   │   ├── groups/
│   │   │   ├── GroupSection.tsx   # Tabla de posiciones de un grupo
│   │   │   ├── GroupStandingsTable.tsx  # Tabla con columnas PJ/PG/PE/PP/GF/GC/DG/PTS
│   │   │   └── GroupTabs.tsx      # Filtro por grupo
│   │   ├── matches/
│   │   │   ├── MatchCard.tsx      # Card de partido con resultado
│   │   │   └── ResultForm.tsx     # Modal de carga de resultado con autocompletado
│   │   ├── playoffs/
│   │   │   ├── BracketView.tsx    # Árbol de eliminatorias horizontal + 3er puesto
│   │   │   ├── BracketNode.tsx    # Nodo individual del bracket
│   │   │   └── ChampionCelebrationModal.tsx  # Fuegos artificiales + campeón
│   │   ├── stats/
│   │   │   ├── TopScorers.tsx     # Tabla de goleadores
│   │   │   └── TopAssisters.tsx   # Tabla de asistidores
│   │   ├── dev/
│   │   │   └── DevTools.tsx       # Botones Simular y Resetear
│   │   └── ui/
│   │       ├── FlagIcon.tsx       # Imagen de bandera desde flagcdn
│   │       ├── Badge.tsx          # Etiqueta con variantes de color
│   │       └── Modal.tsx          # Modal base reutilizable
│   │
│   └── pages/                      # Páginas/rutas
│       ├── LandingPage.tsx         # Pantalla de presentación con trofeo
│       ├── HomePage.tsx            # Equipos + DevTools
│       ├── TeamPage.tsx            # Detalle de equipo con plantel
│       ├── GroupsPage.tsx          # Tablas de posiciones
│       ├── FixturePage.tsx         # Fixture de grupos
│       ├── PlayoffsPage.tsx        # Bracket + celebración
│       └── StatsPage.tsx           # Goleadores y asistidores
```

---

## 5. Modelos y tipos TypeScript

### 5.1 Team (`src/types/team.ts`)

```typescript
interface Team {
  id: string;                // 'ARG', 'BRA', etc.
  name: string;              // 'Argentina'
  flag: string;              // 'flags/arg.svg' o código ISO
  group: GroupLetter;        // Grupo al que pertenece
}

type GroupLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
```

### 5.2 Match (`src/types/match.ts`)

```typescript
type MatchStage = 'group' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'final' | 'third_place';

type MatchStatus = 'scheduled' | 'played';

interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  extraTime?: boolean;       // Si se definió en tiempo extra
  penalties?: {
    homeGoals: number;
    awayGoals: number;
  };
}

interface GoalEvent {
  playerName: string;
  teamId: string;
  minute: number;
  assistPlayerName?: string;
  isPenalty?: boolean;
}

interface Match {
  id: string;                // 'match-001'
  stage: MatchStage;
  group?: GroupLetter;       // Solo para fase de grupos
  homeTeamId: string;
  awayTeamId: string;
  date: string;              // '2022-11-20'
  time: string;              // '18:00'
  timezone: string;          // 'UTC+3'
  result?: MatchResult;
  goals?: GoalEvent[];       // Detalle de goles del partido
  status: MatchStatus;
  round?: number;            // Jornada (1-3) en fase de grupos
}
```

### 5.3 Standing (`src/types/standing.ts`)

```typescript
interface Standing {
  teamId: string;
  group: GroupLetter;
  played: number;            // PJ
  wins: number;              // PG
  draws: number;             // PE
  losses: number;            // PP
  goalsFor: number;          // GF
  goalsAgainst: number;      // GC
  goalDifference: number;    // DG
  points: number;            // PTS
}

type GroupStandings = Record<GroupLetter, Standing[]>;
```

### 5.4 Playoff (`src/types/playoff.ts`)

```typescript
interface BracketMatch {
  id: string;
  round: 'round_of_16' | 'quarter_final' | 'semi_final' | 'final' | 'third_place';
  position: number;          // Posición en el bracket (1-8, 1-4, 1-2, 1)
  homeTeamId?: string;       // Indefinido hasta que se defina
  awayTeamId?: string;
  winnerId?: string;
  matchId?: string;          // Referencia al Match real
  sourceMatchHome?: string;  // ID del match que alimenta local
  sourceMatchAway?: string;  // ID del match que alimenta visitante
}

interface BracketRound {
  name: string;
  matches: BracketMatch[];
}
```

### 5.5 Stats (`src/types/stats.ts`)

```typescript
interface ScorerEntry {
  playerName: string;
  teamId: string;
  goals: number;
}

interface AssisterEntry {
  playerName: string;
  teamId: string;
  assists: number;
}
```

### 5.6 Application State (`src/types/index.ts`)

```typescript
interface AppState {
  teams: Team[];
  matches: Match[];
  standings: GroupStandings;
  playoffs: BracketRound[];
  topScorers: ScorerEntry[];
  topAssisters: AssisterEntry[];
  tournamentStage: 'group' | 'playoffs' | 'finished';
}
```

---

## 6. Flujo de datos

### 6.1 Carga inicial

```
App carga → localStorage.load() → ¿datos guardados? → NO → InitialData seed
                                                      → SÍ → restaurar estado
```

### 6.2 Carga de resultado (ciclo completo)

```
Usuario abre ResultForm → selecciona partido → ingresa goles →
confirma → dispatch(SET_MATCH_RESULT, { matchId, result, goals })

↓

appReducer:
  1. Actualiza matches: reemplaza el partido, marca status='played'
  2. recalculateStandings(matches, teams) → recorre todos los partidos jugados
     y calcula PJ/PG/PE/PP/GF/GC/DG/PTS por equipo
  3. sortStandings(standings[group]) → ordena por: puntos → DG → GF → head-to-head
  4. SI todos los grupos están completos → buildPlayoffs(standings, matches)
     → arma bracket octavos, cuartos, semis, 3er puesto, final
     → propaga ganadores entre rondas
  5. computeTopScorers(matches) → recorre todos los goals y acumula por jugador
  6. computeTopAssisters(matches) → idem para asistencias
  7. getTournamentStage(matches) → 'group' | 'playoffs' | 'finished'

↓

Componentes se re-renderizan con nuevo estado
↓

useEffect en AppProvider → saveState(localStorage)
```

### 6.3 Flujo de eliminación directa

```
Fase de grupos termina → se calculan clasificados (top 2 de cada grupo) →
se arma bracket de octavos (1A vs 2B, 1B vs 2A, etc.) →
cada resultado de octavos propaga al ganador al match de cuartos →
ídem para semis y final
```

### 6.4 Persistencia

```
Cada dispatch exitoso → guardar en LocalStorage
Al iniciar la app → restaurar desde LocalStorage
Estrategia: serialización JSON completa del AppState
```

---

## 7. Etapas de implementación

### Etapa 1 — Fundamentos (Sprint 1)

| Días | Tarea | Archivos |
|------|-------|----------|
| 1 | Scaffold Vite + React + TS + Tailwind | Configuración inicial |
| 1 | Definir todos los tipos TypeScript | `src/types/*.ts` |
| 1 | Data de equipos y partidos (Qatar 2022) | `src/data/*.ts` |
| 1 | AppContext + Reducer + LocalStorage | `src/state/*.ts` |
| 1 | Layout base + navegación | `src/components/layout/*.tsx` |

**Verificación:** App corre, navega entre páginas vacías, estado persiste.

---

### Etapa 2 — Fase de Grupos (Sprint 2)

| Días | Tarea | Archivos |
|------|-------|----------|
| 1 | Lógica de tabla de posiciones + desempates | `src/logic/standings.ts`, `tiebreakers.ts` |
| 1 | Componente GroupStandingsTable | `src/components/groups/*.tsx` |
| 1 | Página GroupsPage | `src/pages/GroupsPage.tsx` |
| 1 | Lista de equipos + TeamCard | `src/components/teams/*.tsx` |

**Verificación:** Tablas de posiciones se renderizan con datos semilla, orden correcto.

---

### Etapa 3 — Carga de Resultados (Sprint 3)

| Días | Tarea | Archivos |
|------|-------|----------|
| 1 | MatchCard + ResultForm con validación | `src/components/matches/*.tsx` |
| 1 | Reducer actions: SET_MATCH_RESULT, RESET_MATCH_RESULT | `src/state/actions.ts` |
| 1 | Página FixturePage con grupos y jornadas | `src/pages/FixturePage.tsx` |

**Verificación:** Se carga un resultado, las tablas se actualizan instantáneamente.

---

### Etapa 4 — Playoffs (Sprint 4)

| Días | Tarea | Archivos |
|------|-------|----------|
| 1 | Lógica de armado de bracket + propagación | `src/logic/playoffs.ts` |
| 1 | BracketView + BracketNode | `src/components/playoffs/*.tsx` |
| 1 | Partido por el 3er puesto con perdedores de semis | `src/logic/playoffs.ts` |
| 1 | Página PlayoffsPage | `src/pages/PlayoffsPage.tsx` |

**Verificación:** Al terminar grupos, bracket se genera y ganadores se propagan.

---

### Etapa 5 — Estadísticas (Sprint 5)

| Días | Tarea | Archivos |
|------|-------|----------|
| 1 | Lógica de goleadores y asistidores | `src/logic/statistics.ts` |
| 1 | TopScorers + TopAssisters | `src/components/stats/*.tsx` |
| 1 | Página StatsPage | `src/pages/StatsPage.tsx` |

**Verificación:** Rankings se actualizan con cada partido cargado.

---

### Etapa 6 — Traducción a español (Extra)

| Días | Tarea | Archivos |
|------|-------|----------|
| 1 | Traducir toda la UI al español | 14 archivos modificados |

---

### Etapa 7 — Extras post-etapas

| Tarea | Archivos | Descripción |
|-------|----------|-------------|
| LandingPage + animaciones | `src/pages/LandingPage.tsx` | Pantalla de presentación con trofeo, animaciones CSS y botón "Ingresar al torneo" |
| TeamPage + PlayerCard | `src/pages/TeamPage.tsx`, `src/components/teams/PlayerCard.tsx` | Vista de detalle de equipo con plantel completo, fotos, posición, datos físicos |
| squadsData.json | `src/data/squadsData.json` | Planteles reales de 32 equipos (26 jugadores c/u) con foto, edad, altura, peso |
| Autocompletado en ResultForm | `src/components/matches/ResultForm.tsx` | Sugerencias de nombres de jugadores al tipear goleador/asistencia, usando datos del plantel |
| Simulador de torneo completo | `src/utils/simulation.ts`, `src/components/dev/DevTools.tsx` | Genera resultados aleatorios para 64 partidos con penales, goleadores reales y 50% asistencias |
| BULK_SIMULATE action | `src/state/actions.ts`, `src/state/appReducer.ts` | Acción que simula múltiples partidos en una sola operación atómica |
| Video de fondo | `public/videos/background.mp4`, `src/components/layout/Layout.tsx` | Video de fondo en bucle con capa oscura superpuesta |
| Modal de celebración | `src/components/playoffs/ChampionCelebrationModal.tsx` | Fuegos artificiales animados con CSS keyframes al cargar la final |
| Paleta oscura + glassmorphism | `src/index.css`, componentes | Variables CSS en tema oscuro, tarjetas con backdrop-blur, bordes semitransparentes |

---

## 8. Decisiones técnicas

| Decisión | Opción elegida | Motivo |
|----------|---------------|--------|
| Estado global | React Context + useReducer | Sin dependencias externas, simple, predecible |
| Persistencia | LocalStorage con JSON | Sin backend, datos persistidos al cerrar |
| Routing | React Router v7 | Estándar en React SPA |
| Estilos | TailwindCSS v4 | Rápido, consistente, responsive, CSS-first |
| Iconos de banderas | FlagCDN (imágenes PNG) | Sin dependencias externas, alta calidad |
| Datos de planteles | JSON local (squadsData.json) | 832 jugadores, acceso offline, usado también para autocompletado |
| Video de fondo | `<video>` nativo + overlay CSS | Sin librerías externas, reproducción en bucle |
| Bracket visual | Columnas horizontales con CSS flexbox | Layout responsivo con scroll horizontal en móvil |
| Simulación | generateSimulationResults() recursivo | Simula ronda por ronda, respetando reglas de playoffs |

### Principios que NO se negocian

1. **Lógica de negocio SIN React** — `src/logic/` exporta funciones puras que reciben datos y devuelven datos. Cero hooks, cero JSX.
2. **Estado inmutable** — El reducer siempre retorna un nuevo objeto.
3. **Tipado completo** — Ningún `any` en la lógica de negocio.
4. **Datos reales** — Usar Mundial 2022 como dataset para validar correctness.
5. **Recálculo completo desde cero** — Ante cualquier cambio se recorre todo el estado y se reconstruyen standings, bracket y estadísticas. Esto elimina bugs de sincronización.

### Extras implementados (puntos extra)

- Partido por el 3er puesto con perdedores de semifinales (O1)
- Tiempo extra y penales en eliminatorias (O2)
- Persistencia completa con LocalStorage (O4)
- Modo oscuro con glassmorphism (O5)
- Datos reales de Qatar 2022 (O6)
- Simulador de torneo completo (O7)
- Planteles completos con fotos (extra)
- Autocompletado de jugadores en formulario de resultados (extra)
- Página de presentación (landing) con animaciones (extra)
- Video de fondo (extra)
- Modal de celebración del campeón con fuegos artificiales (extra)

---

## Checklist de entrega

- [x] Código fuente completo en rama correspondiente
- [x] README.md con descripción, tecnologías, instrucciones, decisiones, integrantes
- [x] Demostración en vivo funcionando
- [x] Tablas de posiciones calculadas correctamente (18/30 mínimo)
- [x] Persistencia de datos (no se pierde al recargar)
- [x] Sin errores de compilación TypeScript
- [x] Sin errores de lógica en desempates
- [x] Partido por el 3er puesto implementado
- [x] Penales y tiempo extra en eliminatorias
- [x] Video de fondo + diseño glassmorphism
- [x] Landing page con animaciones
- [x] Planteles completos con fotos
- [x] Autocompletado de jugadores
- [x] Simulador de torneo completo
- [x] Modal de celebración del campeón
