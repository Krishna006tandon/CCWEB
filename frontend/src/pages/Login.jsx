import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('Submitting login with:', { email, password: '***' });
    
    try {
      console.log('Making API call to:', api.defaults.baseURL + '/auth/login');
      const { data } = await api.post('/auth/login', { email, password });
      console.log('Login response:', data);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      
      // Handle different types of errors for mobile
      if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        setError('Network error. Please check your internet connection and try again.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-peach/10 rounded-full blur-[80px] sm:blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-sage/10 rounded-full blur-[60px] sm:blur-[100px] -z-10"></div>
      
      <div className="glass-panel w-full max-w-md p-6 sm:p-8 md:p-10 md:p-12">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-brown mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-brown/60 font-light text-sm sm:text-base">Login to your culinary journey</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 text-xs sm:text-sm font-medium border border-red-100 italic">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brown/60 mb-1.5 sm:mb-2 pl-1">Email Address</label>
            <input 
              required
              type="email" 
              className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-beige/60 rounded-xl sm:rounded-2xl outline-none focus:border-sage bg-white/80 text-brown shadow-inner-soft transition-colors text-sm sm:text-base"
              placeholder="chef@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brown/60 mb-1.5 sm:mb-2 pl-1">Password</label>
            <input 
              required
              type="password" 
              className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-beige/60 rounded-xl sm:rounded-2xl outline-none focus:border-sage bg-white/80 text-brown shadow-inner-soft transition-colors text-sm sm:text-base"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-2 sm:pt-4">
            <button 
              disabled={loading}
              type="submit" 
              className="w-full btn-primary !py-3 sm:!py-4 shadow-lg flex justify-center items-center text-sm sm:text-base"
            >
              {loading ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Login"}
            </button>
          </div>
        </form>

        <div className="mt-6 sm:mt-10 text-center">
          <p className="text-brown/60 text-xs sm:text-sm font-light">
            Don't have an account? {' '}
            <Link to="/register" className="text-sage font-bold hover:text-brown transition-colors">
              Join Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
