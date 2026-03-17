import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

export default function Enrollment() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState(null);
  const [error, setError] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    const fetchClass = async () => {
      try {
        const { data } = await api.get('/classes');
        const selectedClass = data.find(c => c._id === classId);
        if (selectedClass) {
          setClassData(selectedClass);
        } else {
          setError('Class not found');
        }
      } catch (err) {
        setError('Failed to fetch class details');
      }
    };

    if (classId) fetchClass();
  }, [classId, navigate]);

  const handlePayment = async () => {
    if (!classData) return;
    
    setLoading(true);
    setError('');

    try {
      // 1. Create Order Backend
      const { data: order } = await api.post('/payment/create-order', { classId: classData._id });
      
      // 2. Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_YOUR_KEY', // Should be in .env
        amount: order.amount,
        currency: order.currency,
        name: 'Cookery.',
        description: `Enrollment for ${classData.title}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // 3. Verify Payment Backend
            await api.post('/payment/verify', {
              classId: classData._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            alert('Payment successful! Redirecting to dashboard...');
            navigate('/dashboard');
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#6B4F3A',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  if (!classId) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream">
       <h2 className="text-2xl font-bold text-brown mb-4">No Class Selected</h2>
       <button onClick={() => navigate('/classes')} className="btn-primary">Browse Classes</button>
    </div>
  );

  return (
    <div className="min-h-[85vh] py-24 px-6 flex justify-center items-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-peach/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="glass-panel w-full max-w-2xl p-10 md:p-14 relative overflow-hidden backdrop-blur-2xl bg-white/60">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-brown mb-4 tracking-tight">Complete Enrollment</h2>
          <p className="text-brown/60 text-lg font-light">Confirm your booking for <span className="text-brown font-bold">{classData?.title || 'loading...'}</span></p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100 italic text-center">
            {error}
          </div>
        )}

        <div className="max-w-md mx-auto">
          {classData && (
             <div className="premium-card p-6 mb-10 bg-white/80 border border-beige/40">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-xs font-bold uppercase tracking-widest text-brown/40">Class Title</span>
                   <span className="font-bold text-brown">{classData.title}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                   <span className="text-xs font-bold uppercase tracking-widest text-brown/40">Duration</span>
                   <span className="font-medium text-brown/80">{classData.duration}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-beige/40">
                   <span className="text-lg font-bold text-brown">Total Amount</span>
                   <span className="text-2xl font-bold text-sage">${classData.price}</span>
                </div>
             </div>
          )}

          <div className="space-y-4">
             <button 
                disabled={loading || !classData}
                onClick={handlePayment}
                className="w-full btn-primary !py-4 shadow-lg flex justify-center items-center gap-2"
             >
                {loading ? (
                   <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                    Pay & Enroll Now
                  </>
                )}
             </button>
             <button 
                onClick={() => navigate('/classes')}
                className="w-full text-xs font-bold text-brown/40 uppercase tracking-widest hover:text-brown transition-colors"
             >
                Cancel & Go Back
             </button>
          </div>

          <div className="mt-12 pt-8 border-t border-beige/40 flex items-center justify-center gap-6 opacity-40">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sage"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Payment</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sage"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Instant Access</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
