export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
        <span className="text-2xl">⚽</span>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Mundial 2022</h1>
          <p className="text-blue-200 text-xs">Gestor de Fixture</p>
        </div>
      </div>
    </header>
  );
}
