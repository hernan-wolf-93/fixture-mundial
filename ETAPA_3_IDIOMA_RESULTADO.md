# Traducción al Español — Interfaz Visible

> **Proyecto:** World Cup 2022 — Fixture Manager  
> **Fecha:** 30 de Mayo de 2026

---

## 1. Resumen

Se tradujeron todos los textos visibles al usuario de inglés a español, manteniendo únicamente "Playoffs" en inglés según lo requerido. No se modificó lógica de negocio, tipos, estado, ni código interno. TypeScript y build pasan sin errores.

---

## 2. Textos traducidos por archivo

### `index.html`

| Línea | Inglés → Español |
|-------|------------------|
| 7 | `World Cup 2022 — Fixture Manager` → `Mundial 2022 — Gestor de Fixture` |

### `src/components/layout/Header.tsx`

| Línea | Inglés → Español |
|-------|------------------|
| 7 | `World Cup 2022` → `Mundial 2022` |
| 8 | `Fixture Manager` → `Gestor de Fixture` |

### `src/components/layout/Navbar.tsx`

| Ruta | Inglés → Español |
|------|------------------|
| `/` | `Teams` → `Equipos` |
| `/groups` | `Groups` → `Grupos` |
| `/fixture` | `Fixture` → `Fixture` (sin cambios) |
| `/playoffs` | `Playoffs` → `Playoffs` (sin cambios, requerido) |
| `/stats` | `Stats` → `Estadísticas` |

### `src/pages/HomePage.tsx`

| Línea | Inglés → Español |
|-------|------------------|
| 6 | `Teams` → `Equipos` |

### `src/pages/GroupsPage.tsx`

| Línea | Inglés → Español |
|-------|------------------|
| 17 | `Group Standings` → `Posiciones de Grupos` |

### `src/pages/FixturePage.tsx`

| Línea | Inglés → Español |
|-------|------------------|
| 42 | `Match Fixture` → `Fixture de Partidos` |
| 44 | `Group stage · {n} of {m} played` → `Fase de grupos · {n} de {m} jugados` |
| 68 | `Group {g}` → `Grupo {g}` |
| 80 | `No matches found for this group.` → `No se encontraron partidos para este grupo.` |
| 87 | `Round {round}` → `Jornada {round}` |
| 91 | `{n}/{m} played` → `{n}/{m} jugados` |

### `src/pages/PlayoffsPage.tsx`

| Línea | Inglés → Español |
|-------|------------------|
| 8 | `Playoffs` → `Playoffs` (sin cambios, requerido) |
| 12-13 | `Playoff brackets will appear once the group stage is complete.` → `Los cruces de playoffs aparecerán una vez que la fase de grupos esté completa.` |
| 15-16 | `Load results for all group stage matches to unlock the knockout phase.` → `Cargá los resultados de todos los partidos de grupos para desbloquear la fase eliminatoria.` |
| 20 | `Bracket visualization coming in Stage 4.` → `Visualización de llaves próximamente en Etapa 4.` |

### `src/pages/StatsPage.tsx`

| Línea | Inglés → Español |
|-------|------------------|
| 8 | `Tournament Statistics` → `Estadísticas del Torneo` |
| 12 | `⚽ Top Scorers` → `⚽ Goleadores` |
| 16 | `No goals registered yet. Load match results with goal details to populate this list.` → `Aún no se registraron goles. Cargá resultados con detalles de goles para poblar esta lista.` |
| 19 | `Scorers will appear here once registered.` → `Los goleadores aparecerán aquí una vez registrados.` |
| 25 | `🎯 Top Assists` → `🎯 Asistencias` |
| 29 | `No assists registered yet. Load match results with assist details to populate this list.` → `Aún no se registraron asistencias. Cargá resultados con detalles de asistencias para poblar esta lista.` |
| 32 | `Assisters will appear here once registered.` → `Los asistidores aparecerán aquí una vez registrados.` |

### `src/components/teams/TeamList.tsx`

| Línea | Inglés → Español |
|-------|------------------|
| 17 | `Group {letter}` → `Grupo {letter}` |
| 18 | `{n} teams` → `{n} equipos` |

### `src/components/groups/GroupStandingsTable.tsx`

| Línea | Inglés → Español |
|-------|------------------|
| 18 | `Team` → `Equipo` |
| 44 | `Q` → `C` (Clasificado) |

Las abreviaturas PJ, PG, PE, PP, GF, GC, DG, PTS ya estaban en español (terminología futbolística estándar), no requirieron cambios.

### `src/components/groups/GroupSection.tsx`

| Línea | Inglés → Español |
|-------|------------------|
| 22 | `Group {letter}` → `Grupo {letter}` |

### `src/components/groups/GroupTabs.tsx`

| Línea | Inglés → Español |
|-------|------------------|
| 18 | `All` → `Todas` |
| 30 | `Group {g}` → `Grupo {g}` |

### `src/components/matches/MatchCard.tsx`

| Línea | Inglés → Español |
|-------|------------------|
| 27 | `Played` (Badge) → `Jugado` |
| 34 | `TBD` (fallback local) → `—` (em dash, neutral) |
| 50 | `TBD` (fallback visitante) → `—` |
| 58 | `Defined in extra time` → `Definido en tiempo extra` |
| 63 | `Penalties:` → `Penales:` |

### `src/components/matches/ResultForm.tsx`

| Línea | Inglés → Español |
|-------|------------------|
| 48 | `Required` → `Obligatorio` |
| 50 | `Must be a whole number` → `Debe ser un número entero` |
| 52 | `Cannot be negative` → `No puede ser negativo` |
| 56 | `Required` → `Obligatorio` |
| 58 | `Must be a whole number` → `Debe ser un número entero` |
| 60 | `Cannot be negative` → `No puede ser negativo` |
| 102 | `Enter Result` → `Ingresar Resultado` |
| 108 | `Home` → `Local` |
| 130 | `Away` → `Visitante` |
| 157 | `Confirm Delete` → `Confirmar Eliminación` |
| 164 | `Cancel` → `Cancelar` |
| 173 | `Update Result` → `Actualizar Resultado` |
| 180 | `Delete` → `Eliminar` |
| 190 | `Save Result` → `Guardar Resultado` |

---

## 3. Archivos modificados (17 archivos)

| Archivo | Cambios |
|---------|---------|
| `index.html` | 1 traducción |
| `src/components/layout/Header.tsx` | 2 traducciones |
| `src/components/layout/Navbar.tsx` | 3 traducciones |
| `src/pages/HomePage.tsx` | 1 traducción |
| `src/pages/GroupsPage.tsx` | 1 traducción |
| `src/pages/FixturePage.tsx` | 6 traducciones |
| `src/pages/PlayoffsPage.tsx` | 3 traducciones |
| `src/pages/StatsPage.tsx` | 7 traducciones |
| `src/components/teams/TeamList.tsx` | 2 traducciones |
| `src/components/groups/GroupStandingsTable.tsx` | 2 traducciones |
| `src/components/groups/GroupSection.tsx` | 1 traducción |
| `src/components/groups/GroupTabs.tsx` | 2 traducciones |
| `src/components/matches/MatchCard.tsx` | 5 traducciones |
| `src/components/matches/ResultForm.tsx` | 13 traducciones |

**Total: 49 textos traducidos** en 14 archivos.

---

## 4. Archivos NO modificados

| Archivo | Motivo |
|---------|--------|
| `src/components/ui/FlagIcon.tsx` | Sin textos visibles fijos |
| `src/components/ui/Badge.tsx` | Sin textos visibles fijos |
| `src/components/ui/Modal.tsx` | Sin textos visibles fijos |
| `src/components/teams/TeamCard.tsx` | Sin textos visibles fijos |
| `src/data/*.ts` | Datos, no interfaz. Nombres de países no se traducen |
| `src/logic/*.ts` | Lógica de negocio, no interfaz |
| `src/state/*.ts` | Estado global, no interfaz |
| `src/types/*.ts` | Tipos, no interfaz |
| `src/hooks/*.ts` | Hooks, no interfaz |

---

## 5. Verificación técnica

```bash
npx tsc --noEmit     # Sin errores
npx vite build        # Build exitoso (51 módulos, 722ms)
```
