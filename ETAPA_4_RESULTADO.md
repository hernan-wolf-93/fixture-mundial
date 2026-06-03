# Etapa 4 — Resultado: Playoffs y Fase Eliminatoria

> **Proyecto:** Mundial 2022 — Gestor de Fixture  
> **Fecha:** 30 de Mayo de 2026

---

## 1. Resumen

Se implementó la fase eliminatoria completa del Mundial: desde la clasificación automática desde la fase de grupos hasta la final, incluyendo el partido por el tercer puesto. El bracket se genera automáticamente al completarse todos los partidos de grupos, y los ganadores se propagan a través de las rondas sin intervención manual.

---

## 2. Archivos creados (3 nuevos)

| Archivo | Líneas | Propósito |
|---------|--------|-----------|
| `src/logic/playoffs.ts` | 208 | Lógica pura de armado de bracket, clasificación, propagación y detección de etapa del torneo |
| `src/components/playoffs/BracketNode.tsx` | 72 | Componente que renderiza un cruce individual del bracket con banderas, nombres y resultado |
| `src/components/playoffs/BracketView.tsx` | 164 | Componente que renderiza el bracket completo con layout de árbol, conectores visuales entre rondas y posicionamiento absoluto |

## 3. Archivos modificados (3 existentes)

| Archivo | Cambio |
|---------|--------|
| `src/state/appReducer.ts` | `SET_MATCH_RESULT` y `RESET_MATCH_RESULT` ahora reconstruyen automáticamente los playoffs y actualizan `tournamentStage` |
| `src/pages/PlayoffsPage.tsx` | Reescribita por completo: reemplaza placeholder por `BracketView` interactivo con `ResultForm` para editar resultados |
| `src/components/matches/ResultForm.tsx` | Agregado soporte para penales y tiempo extra en partidos de eliminación directa |

---

## 4. Estructura de la lógica de playoffs

### 4.1 `src/logic/playoffs.ts` — Funciones exportadas

| Función | Descripción |
|---------|-------------|
| `getQualifiedTeams(standings)` | Extrae los 2 primeros de cada grupo desde `GroupStandings` (ya ordenado por puntos → DG → GF → H2H) |
| `buildPlayoffs(standings, matches)` | Función principal: construye el bracket completo y devuelve `{ bracket, updatedMatches }` |
| `getTournamentStage(matches)` | Retorna `'group'`, `'playoffs'` o `'finished'` según el estado de los partidos |

### 4.2 Flujo de datos

```
Usuario carga resultado de fase de grupos
  → appReducer.SET_MATCH_RESULT
    → recalculateStandings() [src/logic/standings.ts]
    → buildPlayoffs() [src/logic/playoffs.ts]
      → getQualifiedTeams() → top 2 de cada grupo
      → Arma Octavos (formato oficial 1A-2B, 1C-2D, ...)
      → Para cada ronda posterior:
          - Lee ganadores de ronda anterior
          - Asigna equipos al siguiente cruce
          - Si los equipos cambiaron, limpia el resultado anterior
      → Arma Tercer puesto con perdedores de semifinales
    → getTournamentStage() → 'playoffs' o 'finished'
  → Estado actualizado: matches, standings, playoffs, tournamentStage
```

### 4.3 Formato oficial de Octavos de Final

```
Partido 49: 1A vs 2B      Partido 53: 1B vs 2A
Partido 50: 1C vs 2D      Partido 54: 1D vs 2C
Partido 51: 1E vs 2F      Partido 55: 1F vs 2E
Partido 52: 1G vs 2H      Partido 56: 1H vs 2G
```

### 4.4 Propagación entre rondas

```
Octavos (8 partidos) → Cuartos (4 partidos) → Semifinales (2 partidos) → Final (1 partido)
                                                                         → Tercer puesto (1 partido)
```

La propagación funciona de la siguiente forma:
- **Cuartos:** Ganador de partido 49 vs Ganador de partido 50 → partido 57
- **Semifinales:** Ganador de partido 57 vs Ganador de partido 58 → partido 61
- **Final:** Ganador de partido 61 vs Ganador de partido 62 → partido 64
- **Tercer puesto:** Perdedor de partido 61 vs Perdedor de partido 62 → partido 63

---

## 5. Componentes del bracket

### 5.1 BracketNode (`src/components/playoffs/BracketNode.tsx`)

Renderiza un cruce individual del bracket:

- Muestra equipo local + bandera + resultado
- Muestra equipo visitante + bandera + resultado
- Resalta al ganador con fondo verde (`bg-green-100`)
- Muestra "Pendiente" si el partido está programado
- Muestra "Por definir" si los equipos aún no se conocen
- Es un `<button>` clickeable que abre el `ResultForm`

### 5.2 BracketView (`src/components/playoffs/BracketView.tsx`)

Renderiza el bracket completo con 5 columnas (Octavos, Cuartos, Semifinales, Final, Tercer puesto):

- **Layout:** Posicionamiento absoluto con cálculo de coordenadas basado en el árbol del bracket
- **Conectores:** Líneas CSS (border-right + border-top) que conectan visualmente los cruces entre rondas
- **Fórmula de posicionamiento:** Cada cruce en ronda `R` está centrado verticalmente entre sus `2^R` cruces padres
- **Responsive:** Scroll horizontal en pantallas angostas
- **Internacionalización:** Títulos de rondas en español (Octavos de Final, Cuartos de Final, etc.)

---

## 6. Manejo de penales y tiempo extra

El `ResultForm` se modificó para soportar la fase eliminatoria:

- Si el partido es de playoffs y el marcador termina empatado, se muestran campos para ingresar penales
- Se valida que los penales no terminen empatados
- Se puede marcar "Se definió en tiempo extra" como checkbox informativo
- El `MatchResult` enviado al reducer incluye `penalties` y `extraTime`

---

## 7. Casos borde cubiertos

| Escenario | Comportamiento |
|-----------|---------------|
| Fase de grupos incompleta | `buildPlayoffs` retorna bracket vacío, todos los playoff matches se limpian |
| Cambio de resultado de grupos | Playoffs se reconstruyen desde cero; si los equipos de un cruce cambiaron, se limpia su resultado |
| Empate en playoffs | Se requieren penales para determinar ganador; validación estricta |
| Reset de grupo | Si un grupo deja de estar completo, los playoffs desaparecen |
| Tercer puesto sin semifinales definidas | Muestra "Por definir" hasta que las semifinales tengan ganador |
| Torneo finalizado | `tournamentStage` cambia a `'finished'` cuando la final tiene resultado |

---

## 8. Ejemplo de clasificación y propagación

### 8.1 Clasificación desde grupos

Suponiendo estos resultados en fase de grupos:

| Grupo | 1° (clasificado) | 2° (clasificado) |
|-------|-------------------|-------------------|
| A | Netherlands (NED) | Senegal (SEN) |
| B | England (ENG) | United States (USA) |
| C | Argentina (ARG) | Poland (POL) |
| D | France (FRA) | Australia (AUS) |
| E | Japan (JPN) | Spain (ESP) |
| F | Morocco (MAR) | Croatia (CRO) |
| G | Brazil (BRA) | Switzerland (SUI) |
| H | Portugal (POR) | South Korea (KOR) |

### 8.2 Octavos generados automáticamente

```
Partido 49: NED vs USA        Partido 53: ENG vs SEN
Partido 50: ARG vs AUS        Partido 54: FRA vs POL
Partido 51: JPN vs CRO        Partido 55: MAR vs ESP
Partido 52: BRA vs KOR        Partido 56: POR vs SUI
```

### 8.3 Propagación a Cuartos (ejemplo)

Si los resultados de octavos son:
- NED 3-1 USA → Pasa NED
- ARG 2-1 AUS → Pasa ARG
- JPN 1-1 CRO (3-1 penales) → Pasa JPN
- BRA 4-0 KOR → Pasa BRA
- ENG 3-0 SEN → Pasa ENG
- FRA 3-1 POL → Pasa FRA
- MAR 0-0 ESP (3-0 penales) → Pasa MAR
- POR 6-1 SUI → Pasa POR

Cuartos generados:
```
Partido 57: NED vs ARG
Partido 58: JPN vs BRA
Partido 59: ENG vs FRA
Partido 60: MAR vs POR
```

### 8.4 Semifinales y Final

Semifinales:
```
Partido 61: Ganador(57) vs Ganador(58)
Partido 62: Ganador(59) vs Ganador(60)
```

Tercer puesto:
```
Partido 63: Perdedor(61) vs Perdedor(62)
```

Final:
```
Partido 64: Ganador(61) vs Ganador(62)
```

---

## 9. Verificación técnica

```bash
npx tsc --noEmit      # Sin errores
npx vite build         # Build exitoso (54 módulos, 785ms)
```

---

## 10. Integridad contra ARQUITECTURA.md

| Componente planificado | Estado | Archivo |
|------------------------|--------|---------|
| `src/logic/playoffs.ts` | ✅ Creado | Lógica de armado de bracket + propagación |
| `src/components/playoffs/BracketView.tsx` | ✅ Creado | Vista completa del bracket con conectores |
| `src/components/playoffs/BracketNode.tsx` | ✅ Creado | Nodo individual del bracket |
| `src/pages/PlayoffsPage.tsx` | ✅ Modificado | Reemplazado placeholder por bracket interactivo |
| Propagación automática de ganadores | ✅ Implementado | En `buildPlayoffs` → `buildRound` |
| Partido 3er puesto | ✅ Implementado | `buildThirdPlace` con perdedores de semis |
| Penales y tiempo extra | ✅ Implementado | En `ResultForm` para partidos de playoffs |

---

## 11. Archivos no modificados (confirmación)

| Archivo | Motivo |
|---------|--------|
| `src/types/*.ts` | Los tipos existentes (`BracketMatch`, `BracketRound`, `MatchResult`) ya cubren todos los casos |
| `src/logic/standings.ts` | No se tocó. La lógica de posiciones sigue siendo la fuente de clasificación |
| `src/logic/tiebreakers.ts` | No se tocó. Los desempates FIFA se usan indirectamente vía standings |
| `src/state/actions.ts` | No se tocó. `SET_MATCH_RESULT` ya acepta `MatchResult` con penalties |
| `src/data/*.ts` | No se tocó. Los playoffs toman los partidos existentes (match-049 a match-064) |
| `src/components/ui/*.tsx` | No se tocó. Modal, FlagIcon, Badge se reutilizan |
| `src/components/groups/*.tsx` | No se tocó |
| `src/components/teams/*.tsx` | No se tocó |
| `src/components/layout/*.tsx` | No se tocó |
| `src/pages/HomePage.tsx` | No se tocó |
| `src/pages/GroupsPage.tsx` | No se tocó |
| `src/pages/FixturePage.tsx` | No se tocó |
| `src/pages/StatsPage.tsx` | No se tocó |
