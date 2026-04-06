import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const initialForm = {
  contactName: '',
  contactEmail: '',
  contactPhone: ''
};

export default function Enrollment() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState(initialForm);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    const fetchClass = async () => {
      try {
        const { data } = await api.get('/classes');
        const selectedClass = data.find((item) => item._id === classId);
        if (selectedClass) {
          setClassData(selectedClass);
        } else {
          setError('Class not found');
        }
      } catch {
        setError('Failed to fetch class details');
      }
    };

    if (classId) fetchClass();
  }, [classId, navigate]);

  useEffect(() => {
    setFormData({
      contactName: user.name || '',
      contactEmail: user.email || '',
      contactPhone: user.phone || ''
    });
  }, [user.email, user.name, user.phone]);

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!classData) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/enrollments', {
        classId: classData._id,
        ...formData
      });

      setSuccess(response.data?.message || 'Booking request submitted. Admin will review your slot and share the next step privately.');
      setFormData(initialForm);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking request');
    } finally {
      setLoading(false);
    }
  };

  if (!classId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream">
        <h2 className="text-2xl font-bold text-brown mb-4">No Class Selected</h2>
        <button onClick={() => navigate('/classes')} className="btn-primary">Browse Classes</button>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-24 px-6 flex justify-center items-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-peach/10 rounded-full blur-[120px] -z-10"></div>

      <div className="glass-panel w-full max-w-5xl p-8 md:p-12 relative overflow-hidden backdrop-blur-2xl bg-white/60">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.3fr] gap-8 lg:gap-12">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brown/40 mb-3">Booking Request</p>
              <h2 className="text-4xl font-bold text-brown mb-4 tracking-tight">Share your preferred slot first</h2>
              <p className="text-brown/60 text-lg font-light">
                This form only collects your contact details. Admin will reach out, confirm the slot, and share pricing after review.
              </p>
            </div>

            {classData && (
              <div className="premium-card p-6 bg-white/80 border border-beige/40">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                  <img src={classData.image} alt={classData.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-brown/40">Class Title</span>
                    <span className="font-bold text-brown text-right">{classData.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-brown/40">Trainer</span>
                    <span className="font-medium text-brown/80">{classData.chefName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-brown/40">Duration</span>
                    <span className="font-medium text-brown/80">{classData.duration}</span>
                  </div>
                  <div className="pt-4 border-t border-beige/40">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brown/35 mb-2">Pricing Policy</p>
                    <p className="text-sm text-brown/65 leading-relaxed">
                      No fee is displayed here. Admin reviews your request first, then confirms slot and price privately.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-[1.75rem] border border-beige/60 bg-cream/60 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brown/35 mb-4">What Happens Next</p>
              <div className="space-y-3 text-sm text-brown/65">
                <p>1. You submit your basic contact details for this class.</p>
                <p>2. Chef contacts you directly to discuss slot and availability.</p>
                <p>3. Pricing is shared privately only after review.</p>
              </div>
            </div>
          </div>

          <div>
            {(error || success) && (
              <div className={`p-4 rounded-2xl mb-6 text-sm font-medium border ${error ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                }`}>
                {error || success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brown/50 mb-2">Name</label>
                <input
                  required
                  value={formData.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-5 py-4 rounded-2xl border border-beige/60 bg-white/85 text-brown font-medium outline-none focus:border-sage"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown/50 mb-2">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-5 py-4 rounded-2xl border border-beige/60 bg-white/85 text-brown font-medium outline-none focus:border-sage"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown/50 mb-2">Mobile Number</label>
                  <input
                    required
                    value={formData.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-5 py-4 rounded-2xl border border-beige/60 bg-white/85 text-brown font-medium outline-none focus:border-sage"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading || !classData}
                  className="flex-1 btn-primary !py-4 shadow-lg flex justify-center items-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Submit Booking Request'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/classes')}
                  className="sm:w-auto px-6 py-4 rounded-full border border-beige bg-white/80 text-brown font-semibold hover:bg-cream transition-colors"
                >
                  Back to Classes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
