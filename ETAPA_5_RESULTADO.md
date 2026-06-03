# Etapa 5 — Resultado: Goleadores y Asistidores

> **Proyecto:** Mundial 2022 — Gestor de Fixture  
> **Fecha:** 30 de Mayo de 2026

---

## 1. Resumen

Se implementó el registro de goleadores y asistidores por cada partido, junto con las tablas de estadísticas del torneo. Al cargar un resultado, el usuario puede ingresar el nombre del jugador que convirtió cada gol y opcionalmente quién realizó la asistencia. La cantidad de campos se ajusta dinámicamente según el marcador. Los rankings de goleadores y asistidores se actualizan en tiempo real al cargar, modificar o eliminar resultados.

---

## 2. Archivos creados (3 nuevos)

| Archivo | Líneas | Propósito |
|---------|--------|-----------|
| `src/logic/statistics.ts` | 44 | Funciones puras `computeTopScorers()` y `computeTopAssisters()` que recorren los goles de todos los partidos y generan los rankings ordenados |
| `src/components/stats/TopScorers.tsx` | 59 | Tabla de goleadores con #, nombre del jugador, equipo con bandera y cantidad de goles |
| `src/components/stats/TopAssisters.tsx` | 59 | Tabla de asistidores con #, nombre del jugador, equipo con bandera y cantidad de asistencias |

---

## 3. Archivos modificados (5 existentes)

| Archivo | Cambio |
|---------|--------|
| `src/components/matches/ResultForm.tsx` | Agregada sección dinámica "Goles del partido" con campos de goleador, selector Local/Visitante y asistencia opcional. El callback `onSubmit` ahora incluye `GoalEvent[]` |
| `src/state/appReducer.ts` | `SET_MATCH_RESULT` y `RESET_MATCH_RESULT` ahora recalculan `topScorers` y `topAssisters` via `computeTopScorers()` y `computeTopAssisters()` |
| `src/pages/FixturePage.tsx` | `handleSubmitResult` ahora recibe `goals: GoalEvent[]` y los pasa al dispatch |
| `src/pages/PlayoffsPage.tsx` | `handleSubmitResult` ahora recibe `goals: GoalEvent[]` y los pasa al dispatch |
| `src/pages/StatsPage.tsx` | Reemplazados los placeholders por los componentes `TopScorers` y `TopAssisters` |

---

## 4. Estructura de la lógica de estadísticas

### 4.1 `src/logic/statistics.ts` — Funciones exportadas

| Función | Descripción |
|---------|-------------|
| `computeTopScorers(matches)` | Recorre todos los partidos jugados con goles, agrupa por nombre+equipo, cuenta ocurrencias, ordena descendente por cantidad de goles |
| `computeTopAssisters(matches)` | Similar pero solo considera `GoalEvent.assistPlayerName`. Agrupa por nombre+equipo, cuenta, ordena descendente |

### 4.2 Flujo de datos

```
Usuario carga resultado + goles
  → ResultForm.handleSubmit()
    → buildGoals() → construye GoalEvent[] desde los campos del formulario
    → onSubmit(matchId, result, goals)
      → dispatch(SET_MATCH_RESULT, { matchId, result, goals })
        → appReducer:
          1. Actualiza match con result + goals
          2. Recalcula standings
          3. Reconstruye playoffs
          4. computeTopScorers(finalMatches) → topScorers
          5. computeTopAssisters(finalMatches) → topAssisters
        → Estado actualizado en AppContext
        → StatsPage se re-renderiza con nuevos rankings
```

### 4.3 Recalculo automático

Los rankings se recalculan **desde cero** en cada acción `SET_MATCH_RESULT` y `RESET_MATCH_RESULT`, leyendo todos los `GoalEvent[]` de todos los partidos. Esto asegura que:

- Al **agregar** un resultado con goles → los jugadores aparecen en el ranking
- Al **modificar** un resultado (cambiar goles o goleadores) → el ranking se actualiza
- Al **eliminar** un resultado → los goles de ese partido desaparecen del ranking
- Si un jugador anota en varios partidos → sus goles se acumulan correctamente

---

## 5. Formulario de carga de goles

### 5.1 Campos dinámicos

Cuando el usuario ingresa un marcador (ej: 3-1), el formulario genera automáticamente **4 campos de gol** debajo del marcador. Cada campo contiene:

| Elemento | Descripción |
|----------|-------------|
| `#` | Número de gol (1, 2, 3...) |
| `Local / Visita` | Toggle para seleccionar qué equipo anotó |
| `Nombre del goleador` | Campo de texto libre (obligatorio) |
| `Asistencia (opcional)` | Campo de texto libre para el nombre del asistidor |

### 5.2 Sincronización con el marcador

- Si el usuario cambia el marcador de 3-1 a 2-1, los campos de gol se reducen de 4 a 3 (el último se elimina)
- Si el usuario cambia el marcador de 2-1 a 3-2, se agregan 2 nuevos campos vacíos
- Los nuevos goles se asignan automáticamente al equipo local o visitante según el marcador

### 5.3 Validaciones

- El nombre del goleador es obligatorio para cada gol
- El nombre del asistidor es opcional
- Si algún goleador está vacío, el formulario muestra error "Completá el nombre del goleador en todos los goles" y no guarda

### 5.4 GoalEvent generado

```typescript
{
  playerName: "Messi",
  teamId: "ARG",       // según toggle Local/Visita
  minute: 1,           // auto-incrementado por posición
  assistPlayerName: "Di María"  // opcional
}
```

---

## 6. Página de estadísticas

### 6.1 TopScorers (`src/components/stats/TopScorers.tsx`)

- Columnas: #, Jugador, Equipo (con bandera), Goles
- Ordenado por goles descendente
- Cantidad de goles en azul destacado (`text-blue-700 text-lg`)
- Estado vacío con mensaje informativo

### 6.2 TopAssisters (`src/components/stats/TopAssisters.tsx`)

- Columnas: #, Jugador, Equipo (con bandera), Asistencias
- Ordenado por asistencias descendente
- Cantidad de asistencias en ámbar destacado (`text-amber-700 text-lg`)
- Estado vacío con mensaje informativo

---

## 7. Verificación técnica

```bash
npx tsc --noEmit      # Sin errores
npx vite build         # Build exitoso (57 módulos, 574ms)
```

---

## 8. Ejemplo de uso

### 8.1 Carga de resultado con goles

1. Ir a Fixture → Grupo C → Partido ARG vs KSA
2. Ingresar marcador: Local 3, Visitante 1
3. Aparecen 4 campos de gol:
   - Gol 1 → Local → "Messi" → Asistencia: "Di María"
   - Gol 2 → Local → "Lautaro" → Asistencia: (vacío)
   - Gol 3 → Visita → "Al-Dawsari" → Asistencia: "Al-Breik"
   - Gol 4 → Local → "Messi" → Asistencia: "De Paul"
4. Guardar resultado

### 8.2 Rankings generados

**Goleadores:**
| # | Jugador | Equipo | Goles |
|---|---------|--------|-------|
| 1 | Messi | Argentina | 2 |
| 2 | Al-Dawsari | Arabia Saudita | 1 |
| 3 | Lautaro | Argentina | 1 |

**Asistidores:**
| # | Jugador | Equipo | Asistencias |
|---|---------|--------|-------------|
| 1 | Di María | Argentina | 1 |
| 2 | Al-Breik | Arabia Saudita | 1 |
| 3 | De Paul | Argentina | 1 |

### 8.3 Modificación de resultado

Si se edita el mismo partido cambiando el marcador a 1-0 (solo 1 gol), los campos se reducen a 1 y al guardar, los rankings se recalculan:
- Messi: 1 gol, 0 asistencias (se pierde el segundo gol)
- Al-Dawsari y Lautaro: desaparecen del ranking
- Di María y De Paul: desaparecen del ranking de asistencias

---

## 9. Archivos no modificados (confirmación)

| Archivo | Motivo |
|---------|--------|
| `src/types/*.ts` | Los tipos existentes `GoalEvent`, `ScorerEntry`, `AssisterEntry` ya cubren todos los casos |
| `src/logic/standings.ts` | No se tocó |
| `src/logic/tiebreakers.ts` | No se tocó |
| `src/logic/playoffs.ts` | No se tocó |
| `src/state/actions.ts` | No se tocó. `SET_MATCH_RESULT` ya aceptaba `goals?: GoalEvent[]` |
| `src/state/AppContext.tsx` | No se tocó |
| `src/state/localStorage.ts` | No se tocó |
| `src/data/*.ts` | No se tocó |
| `src/components/ui/*.tsx` | No se tocó |
| `src/components/groups/*.tsx` | No se tocó |
| `src/components/teams/*.tsx` | No se tocó |
| `src/components/playoffs/*.tsx` | No se tocó |
| `src/components/layout/*.tsx` | No se tocó |
| `src/pages/HomePage.tsx` | No se tocó |
| `src/pages/GroupsPage.tsx` | No se tocó |
