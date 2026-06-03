# Etapa 2 — Resultado: Estado actual contra objetivos

> **Proyecto:** World Cup 2022 — Fixture Manager  
> **Fecha:** 30 de Mayo de 2026

---

## 1. Objetivos de Etapa 2 (según ARQUITECTURA.md)

| Días | Tarea | Archivos planificados |
|------|-------|----------------------|
| 1 | Lógica de tabla de posiciones + desempates | `src/logic/standings.ts`, `src/logic/tiebreakers.ts` |
| 1 | Componente GroupStandingsTable | `src/components/groups/*.tsx` |
| 1 | Página GroupsPage | `src/pages/GroupsPage.tsx` |
| 1 | Lista de equipos + TeamCard | `src/components/teams/*.tsx` |

**Verificación esperada:** Tablas de posiciones se renderizan con datos semilla, orden correcto.

---

## 2. Estado actual por objetivo

### 2.1 Lógica de tabla de posiciones + desempates

| Aspecto | Estado | Archivo |
|---------|--------|---------|
| `recalculateStandings()` | ✅ **Completado** | `src/logic/standings.ts` |
| `sortStandings()` con criterios FIFA | ✅ **Completado** | `src/logic/tiebreakers.ts` |
| `resolveHeadToHead()` | ✅ **Completado** | `src/logic/tiebreakers.ts` |
| Puntuación 3/1/0 | ✅ **Completado** | `src/logic/standings.ts:49-62` |
| Cálculo de DG, PJ, PG, PE, PP, GF, GC | ✅ **Completado** | `src/logic/standings.ts:34-62` |
| Desempate por puntos → DG → GF → H2H | ✅ **Completado** | `src/logic/tiebreakers.ts:25-34` |

➡️ **100% implementado.** Incluso fue refactorizado en la etapa de revisión de arquitectura para asegurar que vive exclusivamente en `src/logic/`.

---

### 2.2 Componente GroupStandingsTable

| Aspecto | Estado |
|---------|--------|
| Archivo `src/components/groups/GroupStandingsTable.tsx` | ❌ **No existe** |
| Columnas #, Equipo, PJ, PG, PE, PP, GF, GC, DG, PTS | ⚠️ **Sí se renderizan** pero inline en `GroupsPage.tsx` |
| Tabla ordenada automáticamente | ✅ Funciona (vía `standings.ts`) |
| Resaltado de top 2 | ⚠️ **Sí se implementó** pero inline |

➡️ **Funcionalmente funciona, pero no está extraído a un componente reutilizable.** El HTML de la tabla completa (incluyendo `thead`, `tbody`, filas, celdas, lógica de color, badge "Q") está escrito directamente en `src/pages/GroupsPage.tsx:37-67`.

---

### 2.3 Página GroupsPage

| Aspecto | Estado |
|---------|--------|
| Archivo `src/pages/GroupsPage.tsx` | ✅ **Existe** |
| Renderiza 8 tablas de posiciones | ✅ Funciona |
| Orden correcto desde datos semilla | ✅ Funciona |
| Badge "Q" condicional (solo si grupo completo) | ✅ Corregido en etapa anterior |

➡️ **100% funcional**, pero contiene lógica de presentación que debería estar en componentes extraídos.

---

### 2.4 Lista de equipos + TeamCard

| Aspecto | Estado |
|---------|--------|
| Archivo `src/components/teams/TeamList.tsx` | ❌ **No existe** |
| Archivo `src/components/teams/TeamCard.tsx` | ❌ **No existe** |
| Lista de 32 equipos agrupados por grupo | ⚠️ **Sí se renderiza** pero inline en `HomePage.tsx` |
| Nombre, bandera, grupo por equipo | ⚠️ **Sí se muestra** pero inline |

➡️ **Funcionalmente funciona, pero la UI de equipos está inlined en `HomePage.tsx`** sin componentes reutilizables.

---

## 3. Mapeo de componentes planificados vs reales

| Componente planificado | Ruta planificada | Existe como archivo? | Dónde está realmente |
|----------------------|------------------|---------------------|---------------------|
| `TeamList` | `src/components/teams/TeamList.tsx` | ❌ No | Inline en `src/pages/HomePage.tsx:25-57` |
| `TeamCard` | `src/components/teams/TeamCard.tsx` | ❌ No | Inline como `<div>` en `HomePage.tsx:45-54` |
| `GroupSection` | `src/components/groups/GroupSection.tsx` | ❌ No | Inline en `src/pages/GroupsPage.tsx:22-71` |
| `GroupStandingsTable` | `src/components/groups/GroupStandingsTable.tsx` | ❌ No | Inline como `<table>` en `GroupsPage.tsx:28-67` |
| `GroupTabs` | `src/components/groups/GroupTabs.tsx` | ❌ No | No implementado en ninguna página de grupos |
| `FlagIcon` | `src/components/ui/FlagIcon.tsx` | ✅ Sí | `src/components/ui/FlagIcon.tsx` |
| `Badge` | `src/components/ui/Badge.tsx` | ✅ Sí | `src/components/ui/Badge.tsx` |

---

## 4. Dónde está cada funcionalidad actualmente

### 4.1 Lista de equipos

Actualmente en `src/pages/HomePage.tsx`:

```
HomePage
├── Grid container (4 columnas responsivas)
│   └── Por cada grupo (A-H):
│       ├── Título "Group X" + Badge con cantidad
│       └── Lista vertical de equipos
│           └── Por cada equipo:
│               ├── <div> (hace de TeamCard)
│               │   ├── FlagIcon
│               │   ├── Nombre del equipo
│               │   └── Código ISO (ej: "ARG")
```

Lo que debería según ARQUITECTURA.md:

```
HomePage → TeamList
            └── Por cada grupo:
                ├── TeamCard × N (FlagIcon + Nombre + Grupo)
```

### 4.2 Tablas de posiciones

Actualmente en `src/pages/GroupsPage.tsx`:

```
GroupsPage
├── Grid container (2 columnas)
│   └── Por cada grupo (A-H):
│       ├── <div> contenedor
│       │   ├── Header "Group X" (bg-blue-50)
│       │   └── <table> (hace de GroupStandingsTable)
│       │       ├── thead con columnas (#, Team, PJ, PG, PE, PP, GF, GC, DG, PTS)
│       │       └── tbody con filas de Standing + FlagIcon + Badge "Q"
```

Lo que debería según ARQUITECTURA.md:

```
GroupsPage → GroupSection × 8
             ├── GroupTabs (pestañas A-H)
             └── GroupStandingsTable
                 ├── thead (#, Team, PJ, PG, PE, PP, GF, GC, DG, PTS)
                 └── tbody (filas ordenadas)
```

---

## 5. Tabla resumen

| Objetivo | Estado | ¿Funcional? | ¿Componentizado? |
|----------|--------|-------------|------------------|
| Lógica de posiciones (standings.ts) | ✅ Completo | Sí | ✅ En `src/logic/` |
| Lógica de desempates (tiebreakers.ts) | ✅ Completo | Sí | ✅ En `src/logic/` |
| GroupStandingsTable | ⚠️ Parcial | Sí (inline en GroupsPage) | ❌ No extraído |
| GroupsPage | ✅ Completo | Sí | ✅ Existe como página |
| TeamList | ⚠️ Parcial | Sí (inline en HomePage) | ❌ No extraído |
| TeamCard | ⚠️ Parcial | Sí (inline en HomePage) | ❌ No extraído |
| GroupSection | ❌ Faltante | N/A | ❌ No existe |
| GroupTabs | ❌ Faltante | N/A | ❌ No existe |

---

## 6. Conclusión

**Lo que funciona correctamente:**
- Toda la lógica de cálculo y desempate está en `src/logic/` y es correcta.
- La página `GroupsPage` muestra las 8 tablas con datos correctamente ordenados.
- La página `HomePage` muestra los 32 equipos agrupados por grupo.
- El badge "Q" solo aparece cuando el grupo está completo.

**Lo que falta para cumplir la Etapa 2 según ARQUITECTURA.md:**
- Extraer `TeamCard` como componente independiente en `src/components/teams/TeamCard.tsx`
- Extraer `TeamList` como componente en `src/components/teams/TeamList.tsx`
- Extraer `GroupStandingsTable` como componente en `src/components/groups/GroupStandingsTable.tsx`
- Extraer `GroupSection` como componente en `src/components/groups/GroupSection.tsx`
- Extraer `GroupTabs` como componente en `src/components/groups/GroupTabs.tsx`
- Refactorizar `HomePage.tsx` para usar `TeamList` + `TeamCard`
- Refactorizar `GroupsPage.tsx` para usar `GroupSection` + `GroupStandingsTable` + `GroupTabs`

**Impacto en evaluación:** Funcionalmente la app ya cumple con lo que pide la Etapa 2 (las tablas se renderizan y ordenan correctamente). La deuda técnica es de componentización y reutilización, no de funcionalidad.
