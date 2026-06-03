import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
