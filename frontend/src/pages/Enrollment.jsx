import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
      } catch {
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
      
      console.log('📋 Order created:', order.id, 'Amount: ₹', order.amount/100);
      
      // Check if this is a mock payment (order ID starts with order_mock_)
      const isMockPayment = order.id && order.id.startsWith('order_mock_');
      
      if (isMockPayment) {
        // Handle mock payment directly
        console.log('🔧 Processing mock payment');
        
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verify mock payment
        try {
          await api.post('/payment/verify', {
            classId: classData._id,
            razorpay_order_id: order.id,
            razorpay_payment_id: 'pay_mock_' + Date.now(),
            razorpay_signature: 'mock_signature'
          });
          
          alert('Payment successful! Redirecting to dashboard...');
          navigate('/dashboard');
        } catch {
          setError('Payment verification failed. Please contact support.');
        }
        return;
      }
      
      // 2. Razorpay Options for real payments
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_YOUR_KEY',
        amount: order.amount,
        currency: order.currency,
        name: 'Poonam Cooking and Baking Classes',
        description: `Enrollment for ${classData.title}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            console.log('💰 Payment received:', response.razorpay_payment_id);
            setLoading(true);
            setError('');
            
            // 3. Verify Payment Backend
            const verifyResponse = await api.post('/payment/verify', {
              classId: classData._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            console.log('✅ Payment verified:', verifyResponse.data.message);
            
            // Show success message instead of alert
            setError('');
            alert('🎉 Payment successful! Redirecting to dashboard...');
            navigate('/dashboard');
          } catch (verifyError) {
            console.error('❌ Payment verification failed:', verifyError);
            setError('❌ Payment verification failed. Please contact support with payment ID: ' + response.razorpay_payment_id);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '', // Add phone number if available
        },
        theme: {
          color: '#6B4F3A',
        },
        modal: {
          ondismiss: function() {
            console.log('❌ Payment modal closed by user');
            setError('Payment cancelled. Please try again.');
            setLoading(false);
          },
          escape: true,
          handleback: true,
          confirm_close: true,
          animation: 'fade',
        },
        notes: {
          address: 'Poonam Cooking and Baking Classes',
          course_name: classData.title,
          customer_email: user.email,
        },
        // UPI specific optimizations for mobile
        upi: {
          flow: 'collect', // Better for mobile UPI apps
          merchant_name: 'Poonam Cooking Classes', // Shows in UPI apps
        },
        // Merchant branding
        image: 'https://your-domain.com/logo.png', // Optional: Add your logo
        brand_color: '#6B4F3A',
        // Mobile-specific configuration
        callback_url: `${window.location.origin}/payment-success`,
        send_sms: true,
        send_email: true,
        // Mobile UPI app handling
        retry: {
          enabled: true,
          max_count: 3
        },
        // Timeout for mobile payments
        timeout: 300, // 5 minutes timeout for mobile UPI
        // Error handling
        redirect: false,
      };

      const rzp = new window.Razorpay(options);
      
      // Add mobile-specific event listeners
      rzp.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error);
        console.error('❌ Error code:', response.error.code);
        console.error('❌ Error description:', response.error.description);
        console.error('❌ Error source:', response.error.source);
        console.error('❌ Error step:', response.error.step);
        console.error('❌ Error reason:', response.error.reason);
        
        // Mobile-specific error messages
        let errorMessage = 'Payment failed. ';
        
        if (response.error.code === 'BAD_REQUEST_ERROR') {
          errorMessage += 'Invalid payment request. Please try again.';
        } else if (response.error.code === 'PAYMENT_CANCELLED') {
          errorMessage += 'Payment was cancelled. Please try again.';
        } else if (response.error.code === 'PAYMENT_FAILED') {
          if (response.error.reason === 'timeout') {
            errorMessage += 'Payment timed out. Please check your UPI app and try again.';
          } else if (response.error.reason === 'user_declined') {
            errorMessage += 'Payment was declined. Please try again or use a different payment method.';
          } else {
            errorMessage += 'Transaction failed. Please try again or use a different payment method.';
          }
        } else if (response.error.code === 'NETWORK_ERROR') {
          errorMessage += 'Network error. Please check your internet connection and try again.';
        } else {
          errorMessage += 'Please try again or contact support.';
        }
        
        setError(errorMessage);
        setLoading(false);
      });
      
      rzp.on('payment.success', function (response) {
        console.log('✅ Payment success:', response);
      });
      
      // Add mobile-specific debugging
      console.log('📱 Mobile device detected:', /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
      console.log('🌐 User Agent:', navigator.userAgent);
      console.log('📋 Opening Razorpay with options:', options);
      
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
          <div className={`p-4 rounded-2xl mb-6 text-sm font-medium border text-center ${
            error.includes('❌') ? 'bg-red-50 text-red-500 border-red-100' : 
            error.includes('🎉') ? 'bg-green-50 text-green-600 border-green-100' :
            'bg-yellow-50 text-yellow-600 border-yellow-100'
          }`}>
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
                   <span className="text-2xl font-bold text-sage">₹{classData.price}</span>
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
