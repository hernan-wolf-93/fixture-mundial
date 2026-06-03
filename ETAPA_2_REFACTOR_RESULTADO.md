# Etapa 2 — Refactor: Componentización de Equipos y Grupos

> **Proyecto:** World Cup 2022 — Fixture Manager  
> **Fecha:** 30 de Mayo de 2026

---

## 1. Resumen

Se extrajo la UI de equipos y grupos desde las páginas `HomePage` y `GroupsPage` hacia componentes reutilizables dedicados. El comportamiento visual y la lógica de negocio no fueron modificados. TypeScript y build pasan sin errores.

---

## 2. Componentes creados (5 nuevos archivos)

| Componente | Ruta | Líneas | Responsabilidad |
|------------|------|--------|-----------------|
| `TeamCard` | `src/components/teams/TeamCard.tsx` | 17 | Renderiza un equipo individual: bandera + nombre + código ISO. Recibe `Team` como prop |
| `TeamList` | `src/components/teams/TeamList.tsx` | 27 | Renderiza el grid de todos los equipos agrupados por letra de grupo. Internamente usa `TeamCard` y `Badge`. Obtiene datos via `useAppContext` |
| `GroupStandingsTable` | `src/components/groups/GroupStandingsTable.tsx` | 60 | Renderiza la tabla HTML de posiciones con todas las columnas (PJ, PG, PE, PP, GF, GC, DG, PTS). Recibe `standings`, `teams` y `groupComplete` como props |
| `GroupSection` | `src/components/groups/GroupSection.tsx` | 26 | Renderiza un grupo completo: header "Group X" + `GroupStandingsTable`. Calcula `groupComplete` internamente filtrando `matches`. Recibe `letter`, `standings`, `teams`, `matches` como props |
| `GroupTabs` | `src/components/groups/GroupTabs.tsx` | 34 | Renderiza tabs de navegación entre grupos (All + A-H). Recibe `groups`, `selectedGroup`, `onSelect` como props |

---

## 3. Archivos modificados (2)

| Archivo | Cambio | Líneas antes | Líneas después |
|---------|--------|-------------|----------------|
| `src/pages/HomePage.tsx` | Reemplazó JSX inline por `<TeamList />` | 39 | 9 |
| `src/pages/GroupsPage.tsx` | Reemplazó JSX inline por `<GroupTabs>` + `<GroupSection>`. Agregó filtro por grupo seleccionado | 83 | 33 |

---

## 4. Comparativa antes vs después

### 4.1 HomePage (Teams)

**Antes:** Todo el JSX de la lista de equipos (grid, grupos, cards, badges) estaba inline en `HomePage.tsx`.

```
HomePage (39 líneas)
├── imports: useAppContext, FlagIcon, Badge
├── JSX: grid → group loop → team div → FlagIcon + name + code
```

**Después:** `HomePage` delega completamente a `TeamList`.

```
HomePage (9 líneas)
├── imports: TeamList
└── JSX: <h2> + <TeamList />

TeamList (27 líneas)        [NUEVO]
├── imports: useAppContext, Badge, TeamCard
└── JSX: grid → group loop → header + TeamCard × N

TeamCard (17 líneas)        [NUEVO]
├── imports: FlagIcon
└── JSX: card div → FlagIcon + name + code
```

### 4.2 GroupsPage (Standings)

**Antes:** Todo el JSX de las tablas de posiciones (8 tablas completas con thead, tbody, lógica de color, badges) estaba inline en `GroupsPage.tsx`.

```
GroupsPage (83 líneas)
├── imports: useAppContext, FlagIcon, Badge
├── data: groupMatches, groupComplete
└── JSX: grid → group div → header + table (thead + tbody con colores y Q badge)
```

**Después:** `GroupsPage` usa `GroupTabs` + `GroupSection` con filtro por grupo.

```
GroupsPage (33 líneas)      [REFACTORIZADO]
├── imports: useState, useAppContext, GroupSection, GroupTabs
├── state: selectedGroup (null = All)
└── JSX: header + GroupTabs + grid → GroupSection × N

GroupTabs (34 líneas)        [NUEVO]
├── buttons: All (default) + A-H
└── callback: onSelect(group | null)

GroupSection (26 líneas)     [NUEVO]
├── calcula: groupComplete desde matches
└── JSX: group div → header + GroupStandingsTable

GroupStandingsTable (60 líneas) [NUEVO]
├── props: standings, teams, groupComplete
└── JSX: table → thead + tbody con colores y Q badge
```

---

## 5. Dependencias entre componentes

```
HomePage
  └── TeamList (useAppContext)
        └── TeamCard × N
              └── FlagIcon

GroupsPage (useState, useAppContext)
  ├── GroupTabs
  └── GroupSection × N
        └── GroupStandingsTable
              ├── FlagIcon
              └── Badge
```

---

## 6. Archivos no modificados (confirmación)

| Archivo | Motivo |
|---------|--------|
| `src/logic/standings.ts` | No se tocó. La lógica de cálculo sigue intacta |
| `src/logic/tiebreakers.ts` | No se tocó. Los criterios FIFA siguen intactos |
| `src/state/appReducer.ts` | No se tocó. El reducer no requería cambios |
| `src/state/actions.ts` | No se tocó. Las acciones no cambiaron |
| `src/state/AppContext.tsx` | No se tocó. El provider no cambió |
| `src/types/*.ts` | No se tocó. Los tipos no cambiaron |
| `src/data/*.ts` | No se tocó. Los datos semilla no cambiaron |
| `src/components/ui/*.tsx` | No se tocó (FlagIcon, Badge, Modal se mantienen) |
| `src/components/layout/*.tsx` | No se tocó (Header, Navbar, Layout se mantienen) |
| `src/components/matches/*.tsx` | No se tocó (MatchCard, ResultForm se mantienen) |
| `src/pages/FixturePage.tsx` | No se tocó. Sigue funcionando igual |
| `src/pages/PlayoffsPage.tsx` | No se tocó |
| `src/pages/StatsPage.tsx` | No se tocó |

---

## 7. Verificación técnica

```bash
npx tsc --noEmit     # Sin errores
npx vite build        # Build exitoso (51 módulos, 580ms)
```

---

## 8. Cumplimiento de ARQUITECTURA.md

Verificación contra la estructura planificada en `ARQUITECTURA.md`:

| Componente planificado | Estado | Archivo |
|------------------------|--------|---------|
| `src/components/teams/TeamList.tsx` | ✅ Creado | `src/components/teams/TeamList.tsx` |
| `src/components/teams/TeamCard.tsx` | ✅ Creado | `src/components/teams/TeamCard.tsx` |
| `src/components/groups/GroupSection.tsx` | ✅ Creado | `src/components/groups/GroupSection.tsx` |
| `src/components/groups/GroupStandingsTable.tsx` | ✅ Creado | `src/components/groups/GroupStandingsTable.tsx` |
| `src/components/groups/GroupTabs.tsx` | ✅ Creado | `src/components/groups/GroupTabs.tsx` |
| `src/pages/HomePage.tsx` | ✅ Refactorizado | Usa `TeamList` |
| `src/pages/GroupsPage.tsx` | ✅ Refactorizado | Usa `GroupSection` + `GroupTabs` |

**Estado de Etapa 2: COMPLETADA** ✅
