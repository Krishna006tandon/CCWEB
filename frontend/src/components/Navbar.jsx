import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="sticky top-4 z-50 mx-4 sm:mx-8 lg:mx-auto max-w-6xl">
      <div className="glass-panel px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-brown flex items-center gap-2">
          <div className="w-8 h-8 bg-peach rounded-full flex items-center justify-center">
            <span className="text-brown">P</span>
          </div>
          Poonam Cooking Classes
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium mr-2">
            <Link to="/about" className="text-brown hover:text-sage transition-colors">About</Link>
            <Link to="/classes" className="text-brown hover:text-sage transition-colors">Classes</Link>
            <Link to="/shop" className="text-brown hover:text-sage transition-colors">Shop</Link>
            <Link to="/contact" className="text-brown hover:text-sage transition-colors">Contact</Link>
            {user.role === 'admin' && <Link to="/admin" className="text-brown hover:text-sage transition-colors">Admin</Link>}
            {user.role === 'student' && <Link to="/dashboard" className="text-brown hover:text-sage transition-colors">Dashboard</Link>}
            {user.role === 'student' && <Link to="/event-catering" className="text-brown hover:text-sage transition-colors">Event Catering</Link>}
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
      </div>
    </nav>
  );
}
