import { useCallback } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { generateSimulationResults } from '../../utils/simulation';

export function DevTools() {
  const { state, dispatch } = useAppContext();

  const handleSimulate = useCallback(() => {
    const simResults = generateSimulationResults(state.teams);
    dispatch({
      type: 'BULK_SIMULATE',
      payload: { updates: simResults },
    });
  }, [dispatch, state.teams]);

  const handleResetAll = useCallback(() => {
    if (window.confirm('¿Estás seguro de que querés resetear todos los resultados?')) {
      dispatch({ type: 'RESET_ALL' });
    }
  }, [dispatch]);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="border-2 border-dashed border-yellow-400 bg-yellow-50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-yellow-800 uppercase tracking-wide">
          Herramientas de Desarrollo
        </h3>
        <span className="text-xs font-mono bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
          Solo Desarrollo
        </span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleSimulate}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm font-medium"
        >
          Simular torneo completo
        </button>
        <button
          onClick={handleResetAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm font-medium"
        >
          Resetear todo
        </button>
      </div>
    </div>
  );
}
