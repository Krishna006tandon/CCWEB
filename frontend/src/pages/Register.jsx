import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="glass-panel w-full max-w-md p-10 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-brown mb-2 tracking-tight">Create Account</h2>
          <p className="text-brown/60 font-light">Join our community of gourmet enthusiasts</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100 italic">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brown/60 mb-2 pl-1">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full px-5 py-4 border border-beige/60 rounded-2xl outline-none focus:border-sage bg-white/80 text-brown shadow-inner-soft transition-colors"
              placeholder="Emma Davis"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brown/60 mb-2 pl-1">Email Address</label>
            <input 
              required
              type="email" 
              className="w-full px-5 py-4 border border-beige/60 rounded-2xl outline-none focus:border-sage bg-white/80 text-brown shadow-inner-soft transition-colors"
              placeholder="emma@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brown/60 mb-2 pl-1">Password</label>
            <input 
              required
              type="password" 
              className="w-full px-5 py-4 border border-beige/60 rounded-2xl outline-none focus:border-sage bg-white/80 text-brown shadow-inner-soft transition-colors"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
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
              ) : "Create Account"}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-brown/60 text-sm font-light">
            Already have an account? {' '}
            <Link to="/login" className="text-sage font-bold hover:text-brown transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
