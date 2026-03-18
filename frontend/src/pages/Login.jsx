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
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sage/10 rounded-full blur-[100px] -z-10"></div>
      
      <div className="glass-panel w-full max-w-md p-10 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-brown mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-brown/60 font-light">Login to your culinary journey</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100 italic">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brown/60 mb-2 pl-1">Email Address</label>
            <input 
              required
              type="email" 
              className="w-full px-5 py-4 border border-beige/60 rounded-2xl outline-none focus:border-sage bg-white/80 text-brown shadow-inner-soft transition-colors"
              placeholder="chef@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brown/60 mb-2 pl-1">Password</label>
            <input 
              required
              type="password" 
              className="w-full px-5 py-4 border border-beige/60 rounded-2xl outline-none focus:border-sage bg-white/80 text-brown shadow-inner-soft transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              type="submit" 
              className="w-full btn-primary !py-4 shadow-lg flex justify-center items-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Login"}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-brown/60 text-sm font-light">
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
