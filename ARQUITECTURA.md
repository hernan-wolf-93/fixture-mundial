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
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (Components)                 │
│  TeamList │ GroupStandings │ Bracket │ Fixture │ Stats  │
├─────────────────────────────────────────────────────────┤
│              State Layer (Context + Reducer)             │
│         AppContext │ useReducer │ Actions │ Dispatch     │
├─────────────────────────────────────────────────────────┤
│              Logic Layer (Pure Functions)                │
│  standingsLogic │ tiebreakers │ playoffBuilder │ stats   │
├─────────────────────────────────────────────────────────┤
│              Persistence Layer                           │
│  localStorageAdapter │ loadState │ saveState             │
├─────────────────────────────────────────────────────────┤
│              Data Layer (Static)                         │
│  teams.ts │ matches.ts │ initialData.ts                  │
└─────────────────────────────────────────────────────────┘
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
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── README.md
├── public/
│   └── flags/                     # Banderas SVG de equipos
├── src/
│   ├── main.tsx                   # Entry point + render
│   ├── App.tsx                    # Layout raíz + routing
│   ├── index.css                  # Tailwind directives + estilos globales
│   │
│   ├── data/                      # Datos estáticos y semilla
│   │   ├── teams.ts               # 32 equipos con nombre, grupo, bandera
│   │   ├── matches.ts             # Calendario completo 64 partidos
│   │   └── initialData.ts         # Estado inicial para el seed
│   │
│   ├── types/                     # Tipos TypeScript
│   │   ├── index.ts               # Re-export point
│   │   ├── team.ts                # Team, Group
│   │   ├── match.ts               # Match, MatchResult, MatchStage
│   │   ├── standing.ts            # Standing, GroupStandings
│   │   ├── playoff.ts             # BracketRound, BracketMatch
│   │   └── stats.ts               # ScorerEntry, AssisterEntry
│   │
│   ├── logic/                     # Lógica de negocio pura
│   │   ├── standings.ts           # Calcular tabla de posiciones
│   │   ├── tiebreakers.ts         # Criterios de desempate FIFA
│   │   ├── playoffs.ts            # Construir llaves eliminatorias
│   │   ├── matchEngine.ts         # Procesar resultado de partido
│   │   └── statistics.ts          # Actualizar goleadores/asistidores
│   │
│   ├── state/                     # Estado global
│   │   ├── AppContext.tsx         # Context + Provider
│   │   ├── appReducer.ts          # Reducer principal
│   │   ├── actions.ts             # Tipos de acciones
│   │   └── localStorage.ts        # Persistencia (load/save)
│   │
│   ├── components/                # Componentes UI
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Layout.tsx
│   │   ├── teams/
│   │   │   ├── TeamList.tsx
│   │   │   └── TeamCard.tsx
│   │   ├── groups/
│   │   │   ├── GroupSection.tsx
│   │   │   ├── GroupStandingsTable.tsx
│   │   │   └── GroupTabs.tsx
│   │   ├── matches/
│   │   │   ├── FixtureGrid.tsx
│   │   │   ├── MatchCard.tsx
│   │   │   ├── MatchForm.tsx        # Modal/form para cargar resultado
│   │   │   └── GoalScorerInput.tsx
│   │   ├── playoffs/
│   │   │   ├── BracketView.tsx
│   │   │   └── BracketNode.tsx
│   │   ├── stats/
│   │   │   ├── TopScorers.tsx
│   │   │   └── TopAssisters.tsx
│   │   └── ui/
│   │       ├── FlagIcon.tsx
│   │       ├── Badge.tsx
│   │       ├── Modal.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── pages/                     # Páginas/rutas
│   │   ├── HomePage.tsx
│   │   ├── GroupsPage.tsx
│   │   ├── FixturePage.tsx
│   │   ├── PlayoffsPage.tsx
│   │   └── StatsPage.tsx
│   │
│   ├── hooks/                     # Custom hooks
│   │   ├── useAppContext.ts
│   │   └── useLocalStorage.ts
│   │
│   └── utils/                     # Utilidades generales
│       ├── groupBy.ts
│       ├── sortBy.ts
│       └── timezone.ts
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

type MatchStatus = 'scheduled' | 'played' | 'pending';

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
  date: string;              // '2026-06-14'
  time: string;              // '18:00'
  timezone: string;          // 'UTC-3'
  result?: MatchResult;
  goals?: GoalEvent[];       // Detalle de goles del partido
  status: MatchStatus;
  round?: number;            // Para ordenar por fecha en fase de grupos
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
Usuario abre MatchForm → selecciona partido → ingresa goles →
confirma → dispatch(SET_MATCH_RESULT, { matchId, result, goals })

↓

appReducer:
  1. matchEngine.processResult(match, result) → standing diff
  2. standingsLogic.updateStandings(currentStandings, diffs) → newStandings
  3. tiebreakers.sortStandings(newStandings[group]) → sortedStandings
  4. IF fase de grupos terminó → playoffsLogic.buildBracket(sortedStandings) → playoffs
  5. statisticsLogic.updateScorers(currentScorers, goals) → newScorers
  6. statisticsLogic.updateAssisters(currentAssisters, goals) → newAssisters
  7. localStorage.save(newState)

↓

Componentes se re-renderizan con nuevo estado
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
| 1 | MatchEngine + actualización de standings | `src/logic/matchEngine.ts` |
| 1 | FixtureGrid + MatchCard | `src/components/matches/*.tsx` |
| 1 | MatchForm (modal de carga) | Modal con formulario |
| 1 | GoalScorerInput (registro de goleadores) | Input dinámico |
| 1 | Reducer actions para SET_MATCH_RESULT | `src/state/actions.ts` |
| 1 | Página FixturePage | `src/pages/FixturePage.tsx` |

**Verificación:** Se carga un resultado, las tablas se actualizan instantáneamente.

---

### Etapa 4 — Playoffs (Sprint 4)

| Días | Tarea | Archivos |
|------|-------|----------|
| 1 | Lógica de armado de bracket | `src/logic/playoffs.ts` |
| 1 | BracketView + BracketNode | `src/components/playoffs/*.tsx` |
| 1 | Propagación automática de ganadores | En el reducer |
| 1 | Página PlayoffsPage | `src/pages/PlayoffsPage.tsx` |

**Verificación:** Al terminar grupos, bracket se genera y gana propagación.

---

### Etapa 5 — Estadísticas y refinamiento (Sprint 5)

| Días | Tarea | Archivos |
|------|-------|----------|
| 1 | Lógica de estadísticas (goleadores/asistidores) | `src/logic/statistics.ts` |
| 1 | TopScorers + TopAssisters components | `src/components/stats/*.tsx` |
| 1 | Página StatsPage | `src/pages/StatsPage.tsx` |
| 1 | Partido 3er puesto (opcional) | Lógica extra |
| 1 | Penales y tiempo extra en eliminatorias | UI + lógica |

**Verificación:** Rankings se actualizan con cada partido.

---

### Etapa 6 — Pulido final (Sprint 6)

| Días | Tarea |
|------|-------|
| 1 | Animaciones y transiciones (Tailwind) |
| 1 | Modo oscuro (opcional) |
| 1 | Responsive design |
| 1 | Testing manual completo de todos los escenarios |
| 1 | README.md |
| 1 | Últimas correcciones |

---

## 8. Decisiones técnicas

| Decisión | Opción elegida | Motivo |
|----------|---------------|--------|
| Estado global | React Context + useReducer | Sin dependencias externas, simple, predecible |
| Persistencia | LocalStorage con JSON | Sin backend, datos persistidos al cerrar |
| Routing | React Router v7 | Estándar en React SPA |
| Estilos | TailwindCSS v4 | Rápido, consistente, responsive |
| Iconos de banderas | SVG planos embebidos o emojis | Sin dependencias externas |
| Fechas | date-fns (liviano) o Intl API | Formateo de fechas y zonas horarias |
| Test | Vitest (opcional) | Si sobra tiempo |

### Principios que NO se negocian

1. **Lógica de negocio SIN React** — `src/logic/` exporta funciones puras que reciben datos y devuelven datos. Cero hooks, cero JSX.
2. **Estado inmutable** — El reducer siempre retorna un nuevo objeto.
3. **Tipado completo** — Ningún `any` en la lógica de negocio.
4. **Datos reales** — Usar Mundial 2022 como dataset para validar correctness.

---

## Checklist de entrega

- [ ] Código fuente completo en rama correspondiente
- [ ] README.md con descripción, tecnologías, instrucciones, decisiones, integrantes
- [ ] Demostración en vivo funcionando
- [ ] Tablas de posiciones calculadas correctamente (18/30 mínimo)
- [ ] Persistencia de datos (no se pierde al recargar)
- [ ] Sin errores de compilación TypeScript
- [ ] Sin errores de lógica en desempates
