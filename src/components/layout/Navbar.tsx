import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Equipos' },
  { to: '/groups', label: 'Grupos' },
  { to: '/fixture', label: 'Fixture' },
  { to: '/playoffs', label: 'Playoffs' },
  { to: '/stats', label: 'Estadísticas' },
];

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 overflow-x-auto">
        <ul className="flex gap-1 whitespace-nowrap">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `inline-block px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
