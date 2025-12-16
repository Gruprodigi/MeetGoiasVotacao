import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { UtensilsCrossed, Settings, LogOut, Award, Home } from 'lucide-react';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = DataService.getCurrentUser();
  const isAdmin = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    DataService.logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      {/* Header */}
      <header className={`shadow-lg border-b-4 ${isAdmin ? 'bg-slate-800 border-slate-600' : 'bg-goias-green border-goias-yellow'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className={`p-2 rounded-full ${isAdmin ? 'bg-slate-700' : 'bg-goias-light'}`}>
                <UtensilsCrossed className={`w-6 h-6 ${isAdmin ? 'text-white' : 'text-goias-green'}`} />
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-serif font-bold ${isAdmin ? 'text-white' : 'text-white'}`}>
                  Meet Goiás
                </span>
                {!isAdmin && (
                  <span className="text-xs text-goias-yellow font-medium uppercase tracking-wider">
                    Votação Cultural
                  </span>
                )}
                {isAdmin && (
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Painel Administrativo
                  </span>
                )}
              </div>
            </Link>

            <nav className="flex items-center gap-4">
              {!isAdmin ? (
                <>
                  <Link to="/" className={`px-4 py-2 rounded-md font-medium transition-colors ${location.pathname === '/' ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white'}`}>
                    Indicar
                  </Link>
                  <Link to="/resultados" className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${location.pathname === '/resultados' ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white'}`}>
                    <Award className="w-4 h-4" /> Resultados
                  </Link>
                  <Link to="/admin/login" className="text-xs text-white/50 hover:text-white ml-4 flex items-center gap-1">
                    <Settings className="w-3 h-3" /> Admin
                  </Link>
                </>
              ) : (
                <>
                  {user && (
                    <>
                      <Link to="/admin/dashboard" className="text-slate-300 hover:text-white text-sm font-medium">Dashboard</Link>
                      <Link to="/admin/indicacoes" className="text-slate-300 hover:text-white text-sm font-medium">Indicações</Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 ml-4 text-sm font-medium">
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-goias-orange text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif font-bold text-lg mb-2">Tradição & Cultura</p>
          <p className="text-white/80 text-sm max-w-2xl mx-auto mb-6">
            Este sistema visa valorizar a rica gastronomia do estado de Goiás, 
            promovendo nossos pratos típicos e os restaurantes que mantêm viva nossa história.
          </p>
          <div className="border-t border-white/20 pt-4 text-xs text-white/60">
            &copy; {new Date().getFullYear()} Meet Goiás. Todos os direitos reservados.
            <br />
            Dados pessoais protegidos e não divulgados publicamente.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;