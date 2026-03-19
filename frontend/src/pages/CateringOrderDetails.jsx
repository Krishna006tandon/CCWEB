import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CateringOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/catering/orders/${orderId}`);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePayment = async () => {
    if (!order || !order.pricing?.advanceAmount) return;
    
    // Debug: Check if user is logged in
    const token = localStorage.getItem('token');
    console.log('🔑 Token exists:', !!token);
    console.log('📋 Order ID:', orderId);
    console.log('💰 Advance Amount:', order.pricing.advanceAmount);
    
    if (!token) {
      alert('Please login to make payment');
      navigate('/login');
      return;
    }
    
    setPaymentLoading(true);
    try {
      const { data } = await api.post(`/catering/orders/${orderId}/payment`);
      console.log('💳 Payment order created:', data);
      
      // Load Razorpay
      const options = {
        key: 'rzp_live_SSmtrie2xDJHZ1', // Use your Razorpay key
        amount: data.amount,
        currency: data.currency,
        name: 'Cookery Class - Catering',
        description: `Advance payment for ${order.orderNumber}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await api.post(`/catering/orders/${orderId}/payment/verify`, {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });
            
            if (verifyResponse.data.message === 'Payment verified successfully') {
              alert('Payment successful! Order confirmed.');
              window.location.reload(); // Refresh to show updated status
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          contact: '',
          email: ''
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <p className="text-brown/40 text-lg mb-4">Order not found</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-brown text-white px-6 py-3 rounded-full font-medium text-sm transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-peach/10 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-brown/60 hover:text-brown transition-colors font-medium text-sm flex items-center gap-2 mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-brown mb-2">Order Details</h1>
            <p className="text-brown/60">Order #{order.orderNumber}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            order.status === 'Pending' ? 'bg-yellow/10 text-yellow' :
            order.status === 'Advance Paid' ? 'bg-blue/10 text-blue' :
            order.status === 'Fully Paid' ? 'bg-green/10 text-green' :
            'bg-red/10 text-red'
          }`}>
            {order.status}
          </span>
        </div>

        {/* Order Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Event Details */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-beige shadow-soft">
            <h3 className="text-lg font-bold text-brown mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-peach/20 text-peach flex items-center justify-center text-sm">📅</span>
              Event Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-brown/60">Event Type:</span>
                <span className="font-semibold text-brown">{order.eventType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown/60">Date:</span>
                <span className="font-semibold text-brown">{new Date(order.eventDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown/60">Time:</span>
                <span className="font-semibold text-brown">{order.eventTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown/60">Guests:</span>
                <span className="font-semibold text-brown">{order.guestCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown/60">Serving Style:</span>
                <span className="font-semibold text-brown">{order.servingStyle}</span>
              </div>
            </div>
          </div>

          {/* Venue Details */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-beige shadow-soft">
            <h3 className="text-lg font-bold text-brown mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-peach/20 text-peach flex items-center justify-center text-sm">📍</span>
              Venue Details
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-brown/60">Venue Name:</span>
                <p className="font-semibold text-brown mt-1">{order.venue?.name}</p>
              </div>
              <div>
                <span className="text-brown/60">Address:</span>
                <p className="font-semibold text-brown mt-1">{order.venue?.address}</p>
              </div>
              {order.venue?.landmark && (
                <div>
                  <span className="text-brown/60">Landmark:</span>
                  <p className="font-semibold text-brown mt-1">{order.venue?.landmark}</p>
                </div>
              )}
              <div>
                <span className="text-brown/60">Contact:</span>
                <p className="font-semibold text-brown mt-1">{order.venue?.contactNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-beige shadow-soft mb-8">
          <h3 className="text-lg font-bold text-brown mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-peach/20 text-peach flex items-center justify-center text-sm">🍽️</span>
            Menu Items ({order.items?.length || 0})
          </h3>
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-cream/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.isCustomItem ? '🥗' : '🍴'}</span>
                  <div>
                    <p className="font-semibold text-brown">{item.name}</p>
                    <p className="text-xs text-brown/60">
                      {item.isCustomItem ? 'Custom Item' : 'Menu Item'} • {item.dietary}
                    </p>
                    {item.customizations?.spiceLevel && (
                      <p className="text-xs text-brown/60">Spice Level: {item.customizations.spiceLevel}</p>
                    )}
                    {item.customizations?.specialInstructions && (
                      <p className="text-xs text-brown/60 italic">"{item.customizations.specialInstructions}"</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-brown">x{item.quantity}</p>
                  {item.price && (
                    <p className="text-sm text-brown/60">₹{item.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        {order.pricing && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-beige shadow-soft mb-8">
            <h3 className="text-lg font-bold text-brown mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-peach/20 text-peach flex items-center justify-center text-sm">💰</span>
              Pricing Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-brown/60">Subtotal:</span>
                <span className="font-semibold text-brown">₹{order.pricing.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown/60">Service Charge (10%):</span>
                <span className="font-semibold text-brown">₹{order.pricing.serviceCharge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown/60">GST (18%):</span>
                <span className="font-semibold text-brown">₹{order.pricing.tax}</span>
              </div>
              <div className="border-t border-beige pt-3 flex justify-between">
                <span className="font-bold text-brown">Total Amount:</span>
                <span className="font-bold text-lg text-brown">₹{order.pricing.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown/60">Advance (50%):</span>
                <span className="font-semibold text-brown">₹{order.pricing.advanceAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown/60">Remaining:</span>
                <span className="font-semibold text-brown">₹{order.pricing.remainingAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Special Requirements */}
        {order.specialRequirements && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-beige shadow-soft mb-8">
            <h3 className="text-lg font-bold text-brown mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-peach/20 text-peach flex items-center justify-center text-sm">📝</span>
              Special Requirements
            </h3>
            {typeof order.specialRequirements === 'string' ? (
              <p className="text-brown">{order.specialRequirements}</p>
            ) : (
              <div className="space-y-3">
                {order.specialRequirements.dietaryRestrictions && (
                  <div>
                    <span className="font-semibold text-brown/60">Dietary Restrictions:</span>
                    <p className="text-brown">{order.specialRequirements.dietaryRestrictions.join(', ')}</p>
                  </div>
                )}
                {order.specialRequirements.equipmentNeeded && (
                  <div>
                    <span className="font-semibold text-brown/60">Equipment Needed:</span>
                    <p className="text-brown">{order.specialRequirements.equipmentNeeded.join(', ')}</p>
                  </div>
                )}
                {order.specialRequirements.staffRequired && (
                  <div>
                    <span className="font-semibold text-brown/60">Staff Required:</span>
                    <p className="text-brown">{order.specialRequirements.staffRequired}</p>
                  </div>
                )}
                {order.specialRequirements.specialInstructions && (
                  <div>
                    <span className="font-semibold text-brown/60">Special Instructions:</span>
                    <p className="text-brown">{order.specialRequirements.specialInstructions}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        {order.timeline && order.timeline.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-beige shadow-soft">
            <h3 className="text-lg font-bold text-brown mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-peach/20 text-peach flex items-center justify-center text-sm">📊</span>
              Order Timeline
            </h3>
            <div className="space-y-3">
              {order.timeline.map((entry, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sage/20 text-sage flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-brown">{entry.status}</p>
                    <p className="text-xs text-brown/60">{entry.notes}</p>
                    <p className="text-xs text-brown/40">
                      {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Section */}
        {order.status === 'Confirmed' && order.pricing?.advanceAmount && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-beige shadow-soft">
            <h3 className="text-lg font-bold text-brown mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-peach/20 text-peach flex items-center justify-center text-sm">💳</span>
              Advance Payment
            </h3>
            <div className="space-y-4">
              <p className="text-brown/60 mb-4">
                Pay 50% advance to confirm your booking. Remaining amount will be collected on event day.
              </p>
              <div className="bg-green/10 border border-green/20 rounded-2xl p-4 mb-4">
                <p className="text-sm font-semibold text-green">
                  ✅ Order Confirmed! Ready for Advance Payment
                </p>
              </div>
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full bg-brown text-white hover:bg-brown/80 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-2xl font-bold transition-all shadow-lg"
              >
                {paymentLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </span>
                ) : (
                  `Pay Advance Amount - ₹${order.pricing.advanceAmount}`
                )}
              </button>
              <div className="bg-yellow/10 border border-yellow/20 rounded-2xl p-4">
                <p className="text-xs text-yellow font-semibold mb-2">
                  💰 Remaining Payment Details
                </p>
                <p className="text-xs text-brown/60">
                  Remaining amount: ₹{order.pricing.remainingAmount}
                </p>
                <p className="text-xs text-brown/60">
                  Will be collected on event day: {new Date(order.eventDate).toLocaleDateString()}
                </p>
              </div>
              <p className="text-xs text-brown/40 text-center mt-4">
                By clicking "Pay Advance Amount", you agree to our terms and conditions.
              </p>
            </div>
          </div>
        )}

        {order.status === 'Advance Paid' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-beige shadow-soft">
            <h3 className="text-lg font-bold text-brown mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-green/20 text-green flex items-center justify-center text-sm">✅</span>
              Payment Status
            </h3>
            <div className="space-y-4">
              <div className="bg-green/10 border border-green/20 rounded-2xl p-4">
                <p className="text-sm font-semibold text-green">
                  ✅ Advance Payment Received
                </p>
                <p className="text-xs text-green/60 mt-1">
                  Amount: ₹{order.pricing.advanceAmount}
                </p>
              </div>
              <div className="bg-yellow/10 border border-yellow/20 rounded-2xl p-4">
                <p className="text-xs text-yellow font-semibold mb-2">
                  💰 Remaining Payment
                </p>
                <p className="text-xs text-brown/60">
                  Amount: ₹{order.pricing.remainingAmount}
                </p>
                <p className="text-xs text-brown/60">
                  Due Date: {new Date(order.eventDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-brown/60">
                  Payment Method: Cash/Credit Card on event day
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
