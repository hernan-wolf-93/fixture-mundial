# Mundial 2022 — Gestor de Fixture

Aplicación web SPA para gestionar y visualizar el fixture completo del Mundial de Fútbol Qatar 2022. Permite cargar resultados de los 64 partidos, ver tablas de posiciones con criterios FIFA, seguir la eliminatoria con bracket automático y consultar estadísticas de goleadores y asistidores en tiempo real. Los datos persisten automáticamente al cerrar o recargar la página.

## Tecnologías utilizadas

| Tecnología | Versión |
|------------|---------|
| React | ^19.2.6 |
| TypeScript | ~6.0.2 |
| Vite | ^8.0.12 |
| TailwindCSS | ^4.3.0 |
| react-router-dom | ^7.16.0 |
| @vitejs/plugin-react | ^6.0.1 |

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd fixture-mundial

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
# Abrir http://localhost:5173 en el navegador

# 4. Build de producción
npm run build

# 5. Preview del build generado
npm run preview
```

## Funcionalidades implementadas

- **Fase de grupos** — 8 grupos (A–H) con 4 equipos cada uno. Tablas de posiciones con PJ, PG, PE, PP, GF, GC, DG, PTS. Orden automático según criterios FIFA: puntos → diferencia de gol → goles a favor → head-to-head.
- **Fixture interactivo** — Vista de todos los partidos agrupados por grupo y jornada. Modal para cargar, modificar o eliminar resultados con validación completa.
- **Carga de resultados** — Ingreso de goles local/visitante, selección de goleador por gol, asistencia opcional. Los campos se generan dinámicamente según el marcador. Tiempo extra y penales en fase eliminatoria.
- **Playoffs** — Bracket de eliminación directa: Octavos → Cuartos → Semifinales → Tercer puesto → Final. Los ganadores se propagan automáticamente entre rondas. Los cruces aparecen solo cuando la fase de grupos está completa.
- **Estadísticas** — Ranking de goleadores y asistidores del torneo, actualizado en tiempo real al cargar, modificar o eliminar resultados.
- **Persistencia automática** — El estado completo se guarda en localStorage después de cada cambio. Al recargar la página, todo se restaura exactamente como estaba.
- **Simulación de desarrollo** — Botón "Simular torneo completo" (solo en desarrollo) que genera resultados aleatorios realistas para los 64 partidos. Botón "Resetear todo" con confirmación.

## Decisiones de diseño y técnicas relevantes

1. **Lógica de negocio aislada en `src/logic/`** — Todas las funciones de cálculo (puntuación, desempates, armado de bracket, estadísticas) son funciones puras sin dependencias de React, hooks ni DOM. Reciben datos y devuelven datos, lo que permite testearlas de forma independiente y mantener la UI desacoplada.

2. **Estado global con Context + useReducer** — Sin bibliotecas externas de estado. Un único objeto `AppState` serializable se actualiza mediante un reducer puro. Cada acción produce un nuevo estado sin mutaciones. La persistencia en localStorage es inmediata gracias a un `useEffect` en el Provider.

3. **Recálculo completo desde cero en cada acción** — Ante cualquier cambio (cargar, modificar o eliminar un resultado), el reducer recalcula standings, bracket, goleadores y asistidores desde cero recorriendo todos los partidos. Esto elimina bugs de estado inconsistentemente actualizado y simplifica el código al no requerir lógica de "diff" o "merge".

4. **Propagación automática de playoffs** — El bracket no es estático: `buildPlayoffs()` se ejecuta en cada `SET_MATCH_RESULT` y reconstruye todas las rondas desde los clasificados de grupos. Si los equipos de un cruce cambian por una modificación en grupos, el resultado previo se limpia automáticamente. El partido por el tercer puesto se genera con los perdedores de semifinales.

5. **TailwindCSS v4 con configuración CSS-first** — A diferencia de v3, TailwindCSS v4 elimina la necesidad de `tailwind.config.js` y `postcss.config.js`. Se integra como plugin de Vite (`@tailwindcss/vite`) y se configura directamente desde `src/index.css` con `@import "tailwindcss"`. Esto reduce la configuración y acelera el build.

6. **Separación estricta de responsabilidades** — Las páginas (`src/pages/`) orquestan componentes y leen del contexto, los componentes (`src/components/`) solo renderizan props o leen estado, y la lógica (`src/logic/`) es completamente independiente de React. El reducer (`src/state/appReducer.ts`) solo orquesta llamadas a funciones de lógica sin implementar reglas de negocio.

7. **GoalEvents con 50 % de asistencias en simulación** — La función `generateSimulationResults()` en `src/utils/simulation.ts` genera resultados realistas para testing: goles 0–4 por equipo, penales forzados en caso de empate en playoffs, y un 50 % de probabilidad de asistencia por gol, con una pool de 35 nombres de jugadores.

## Integrantes

- **Nombre:** [TU NOMBRE] — **Legajo:** [TU LEGAJO]
