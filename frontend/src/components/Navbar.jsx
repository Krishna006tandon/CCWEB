import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const isDashboardRoute = location.pathname === '/dashboard' || location.pathname === '/admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    closeMobileMenu();
    navigate('/login');
  };

  return (
    <nav className={`sticky z-[100] mx-auto max-w-6xl px-3 sm:px-6 md:px-10 transition-all duration-300 ${isDashboardRoute ? 'top-3 sm:top-4' : 'top-4 md:top-8'}`}>
      <div className="glass-panel px-3 sm:px-6 md:px-8 py-3 sm:py-4 flex justify-between items-center gap-3 sm:gap-6">
        <Link to="/" onClick={closeMobileMenu} className="text-xl sm:text-2xl font-bold text-brown flex items-center gap-2 sm:gap-3 shrink min-w-0">
          <img src={logo} alt="Poonam Cooking and Baking Classes" className="w-16 h-8 sm:w-28 sm:h-14 md:w-40 md:h-20 object-contain shrink-0" />
          <span className="hidden sm:inline-block leading-tight">Poonam Cooking &  <br /> Baking Classes    </span>
          <span className="sm:hidden text-base truncate">PCBC</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center space-x-9 text-sm font-medium mr-2">
            {/* <Link to="/" className="text-brown hover:text-sage transition-colors">
              <img src={logo} alt="Poonam Cooking and Baking Classes" className="w-24 h-12 sm:w-32 sm:h-16 md:w-40 md:h-20 object-contain" />
            </Link> */}
            {/* <Link to="/" className="text-brown hover:text-sage transition-colors">Home</Link> */}
            <Link to="/about" className="text-brown hover:text-sage transition-colors">About</Link>
            <Link to="/classes" className="text-brown hover:text-sage transition-colors">Classes</Link>
            <Link to="/shop" className="text-brown hover:text-sage transition-colors">Shop</Link>
            <Link to="/contact" className="text-brown hover:text-sage transition-colors">Contact</Link>
            {user.role === 'admin' && <Link to="/admin" className="text-brown hover:text-sage transition-colors">Admin</Link>}
            {user.role === 'student' && <Link to="/dashboard" className="text-brown hover:text-sage transition-colors">Dashboard</Link>}
            {user.role === 'student' && <Link to="/catering-coming-soon" className="text-brown hover:text-sage transition-colors">Event Catering</Link>}
          </div>

          <div className="flex items-center gap-4">
            {token ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-brown hover:text-sage transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-brown hover:text-sage transition-colors">Login</Link>
                <Link to="/register" className="btn-secondary text-sm !px-5 !py-2.5 whitespace-nowrap">Sign Up</Link>
              </>
            )}
            <Link to="/classes" className="btn-secondary text-sm !px-5 !py-2.5 whitespace-nowrap">
              Enroll Now
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <Link to="/classes" onClick={closeMobileMenu} className="btn-secondary text-xs !px-3 !py-2 whitespace-nowrap">
            Enroll
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-beige/50 transition-colors touch-target"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="w-6 h-6 text-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel mt-3 px-2 py-4 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-1">
            <Link to="/about" onClick={closeMobileMenu} className="text-brown hover:text-sage transition-colors py-3 px-4 rounded-xl hover:bg-sage/5 block font-medium">About</Link>
            <Link to="/classes" onClick={closeMobileMenu} className="text-brown hover:text-sage transition-colors py-3 px-4 rounded-xl hover:bg-sage/5 block font-medium">Classes</Link>
            <Link to="/shop" onClick={closeMobileMenu} className="text-brown hover:text-sage transition-colors py-3 px-4 rounded-xl hover:bg-sage/5 block font-medium">Shop</Link>
            <Link to="/contact" onClick={closeMobileMenu} className="text-brown hover:text-sage transition-colors py-3 px-4 rounded-xl hover:bg-sage/5 block font-medium">Contact</Link>
            
            {(user.role === 'admin' || user.role === 'student') && <div className="h-px bg-beige/50 my-2 mx-4" />}
            
            {user.role === 'admin' && <Link to="/admin" onClick={closeMobileMenu} className="text-brown hover:text-sage transition-colors py-3 px-4 rounded-xl hover:bg-sage/5 block font-medium">Admin</Link>}
            {user.role === 'student' && <Link to="/dashboard" onClick={closeMobileMenu} className="text-brown hover:text-sage transition-colors py-3 px-4 rounded-xl hover:bg-sage/5 block font-medium">Dashboard</Link>}
            {user.role === 'student' && <Link to="/catering-coming-soon" onClick={closeMobileMenu} className="text-brown hover:text-sage transition-colors py-3 px-4 rounded-xl hover:bg-sage/5 block font-medium">Event Catering</Link>}

            <div className="mt-4 pt-4 border-t border-beige/50 px-4 space-y-3">
              {token ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-sm font-medium text-brown hover:text-sage transition-colors"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={closeMobileMenu} className="text-center py-3 text-sm font-medium text-brown hover:text-sage transition-colors">Login</Link>
                  <Link to="/register" onClick={closeMobileMenu} className="btn-secondary text-sm !py-3 w-full text-center">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
