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
    <nav className="sticky top-4 z-50 mx-2 sm:mx-4 md:mx-8 lg:mx-auto max-w-6xl">
      <div className="glass-panel px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <Link to="/" className="text-xl sm:text-2xl font-bold text-brown flex items-center gap-2">
          <img src={logo} alt="Poonam Cooking and Baking Classes" className="w-24 h-12 sm:w-32 sm:h-16 md:w-40 md:h-20 object-contain" />
          <span className="hidden sm:inline">Poonam Cooking and Baking Classes</span>
          <span className="sm:hidden">PCBC</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center space-x-6 text-sm font-medium mr-2">
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-beige/50 transition-colors"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel mt-2 px-4 py-6 rounded-3xl">
          <div className="flex flex-col space-y-4">
            <Link to="/about" className="text-brown hover:text-sage transition-colors py-2">About</Link>
            <Link to="/classes" className="text-brown hover:text-sage transition-colors py-2">Classes</Link>
            <Link to="/shop" className="text-brown hover:text-sage transition-colors py-2">Shop</Link>
            <Link to="/contact" className="text-brown hover:text-sage transition-colors py-2">Contact</Link>
            {user.role === 'admin' && <Link to="/admin" className="text-brown hover:text-sage transition-colors py-2">Admin</Link>}
            {user.role === 'student' && <Link to="/dashboard" className="text-brown hover:text-sage transition-colors py-2">Dashboard</Link>}
            {user.role === 'student' && <Link to="/catering-coming-soon" className="text-brown hover:text-sage transition-colors py-2">Event Catering</Link>}
            
            <div className="border-t border-beige pt-4 space-y-3">
              {token ? (
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-brown hover:text-sage transition-colors py-2"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-brown hover:text-sage transition-colors py-2 block">Login</Link>
                  <Link to="/register" className="btn-secondary text-sm !px-5 !py-2.5 whitespace-nowrap block text-center">Sign Up</Link>
                </>
              )}
              <Link to="/classes" className="btn-secondary text-sm !px-5 !py-2.5 whitespace-nowrap block text-center">
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
