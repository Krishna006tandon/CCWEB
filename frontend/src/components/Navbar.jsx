import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (

    <nav className="sticky top-4 md:top-8 z-[100] mx-auto max-w-6xl px-4 sm:px-6 md:px-10 transition-all duration-300">
      <div className="glass-panel px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center gap-x-12">
        <Link to="/" className="text-xl sm:text-2xl font-bold text-brown flex items-center gap-2 shrink-0">
          <img src={logo} alt="Poonam Cooking and Baking Classes" className="w-20 h-10 sm:w-32 sm:h-16 md:w-40 md:h-20 object-contain" />
          <span className="hidden sm:inline-block leading-tight">Poonam Cooking &  <br /> Baking Classes    </span>
          <span className="sm:hidden text-lg">PCBC</span>
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
        <div className="flex md:hidden items-center gap-3">
          <Link to="/classes" className="btn-secondary text-xs !px-4 !py-2 whitespace-nowrap">
            Enroll
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-beige/50 transition-colors"
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
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-brown hover:text-sage transition-colors py-3 px-4 rounded-xl hover:bg-sage/5 block font-medium">About</Link>
            <Link to="/classes" onClick={() => setIsMobileMenuOpen(false)} className="text-brown hover:text-sage transition-colors py-3 px-4 rounded-xl hover:bg-sage/5 block font-medium">Classes</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-brown hover:text-sage transition-colors py-3 px-4 rounded-xl hover:bg-sage/5 block font-medium">Shop</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-brown hover:text-sage transition-colors py-3 px-4 rounded-xl hover:bg-sage/5 block font-medium">Contact</Link>
            
            {(user.role === 'admin' || user.role === 'student') && <div className="h-px bg-beige/50 my-2 mx-4" />}
            
            {user.role === 'admin' && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-brown hover:text-sage transition-colors py-3 px-4 rounded-xl hover:bg-sage/5 block font-medium">Admin</Link>}
            {user.role === 'student' && <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-brown hover:text-sage transition-colors py-3 px-4 rounded-xl hover:bg-sage/5 block font-medium">Dashboard</Link>}
            {user.role === 'student' && <Link to="/catering-coming-soon" onClick={() => setIsMobileMenuOpen(false)} className="text-brown hover:text-sage transition-colors py-3 px-4 rounded-xl hover:bg-sage/5 block font-medium">Event Catering</Link>}

            <div className="mt-4 pt-4 border-t border-beige/50 px-4 space-y-3">
              {token ? (
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left py-2 text-sm font-medium text-brown hover:text-sage transition-colors"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-3 text-sm font-medium text-brown hover:text-sage transition-colors">Login</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-secondary text-sm !py-3 w-full text-center">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
