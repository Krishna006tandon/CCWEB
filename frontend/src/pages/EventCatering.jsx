import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import CateringPackages from '../components/CateringPackages';

export default function EventCatering() {
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [venue, setVenue] = useState({ name: '', address: '', contactNumber: '' });
  const [guestCount, setGuestCount] = useState('');
  const [servingStyle, setServingStyle] = useState('Buffet');
  const [items, setItems] = useState([]);
  const [customItem, setCustomItem] = useState({ name: '', quantity: 1, dietary: 'vegetarian' });
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get minimum date (3 days from now)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  };

  const addItem = () => {
    if (customItem.name) {
      setItems([...items, { ...customItem, isCustomItem: true }]);
      setCustomItem({ name: '', quantity: 1, dietary: 'vegetarian' });
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        eventType,
        eventDate,
        eventTime,
        venue,
        guestCount: parseInt(guestCount),
        servingStyle,
        items,
        packages: selectedPackage ? [{
          packageId: selectedPackage._id,
          name: selectedPackage.name,
          quantity: 1
        }] : [],
        specialRequirements
      };

      console.log('🔍 Sending order data:', orderData);
      const response = await api.post('/catering/orders', orderData);
      console.log('✅ Order response:', response.data);
      alert('✅ Catering order placed successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Order error:', error.response?.data);
      alert('❌ Failed to place order: ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 md:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-brown mb-4 sm:mb-8 text-center">Event Catering Order</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-brown mb-1 sm:mb-2">Event Type</label>
                <select 
                  value={eventType} 
                  onChange={e => setEventType(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-beige rounded-lg sm:rounded-xl focus:outline-none focus:border-sage text-sm"
                  required
                >
                  <option value="">Select Event Type</option>
                  <option value="Kitty Party">Kitty Party</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-brown mb-1 sm:mb-2">Number of Guests</label>
                <input 
                  type="number" 
                  value={guestCount}
                  onChange={e => setGuestCount(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-beige rounded-lg sm:rounded-xl focus:outline-none focus:border-sage text-sm"
                  min="10"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-brown mb-1 sm:mb-2">Event Date</label>
                <input 
                  type="date" 
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  min={getMinDate()}
                  className="w-full p-2 sm:p-3 border border-beige rounded-lg sm:rounded-xl focus:outline-none focus:border-sage text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-brown mb-1 sm:mb-2">Event Time</label>
                <input 
                  type="time" 
                  value={eventTime}
                  onChange={e => setEventTime(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-beige rounded-lg sm:rounded-xl focus:outline-none focus:border-sage text-sm"
                  required
                />
              </div>
            </div>

            {/* Venue Details */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-brown">Venue Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <input 
                  type="text" 
                  placeholder="Venue Name"
                  value={venue.name}
                  onChange={e => setVenue({...venue, name: e.target.value})}
                  className="p-2 sm:p-3 border border-beige rounded-lg sm:rounded-xl focus:outline-none focus:border-sage text-sm"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Venue Address"
                  value={venue.address}
                  onChange={e => setVenue({...venue, address: e.target.value})}
                  className="p-2 sm:p-3 border border-beige rounded-lg sm:rounded-xl focus:outline-none focus:border-sage text-sm"
                  required
                />
                <input 
                  type="tel" 
                  placeholder="Contact Number"
                  value={venue.contactNumber}
                  onChange={e => setVenue({...venue, contactNumber: e.target.value})}
                  className="p-2 sm:p-3 border border-beige rounded-lg sm:rounded-xl focus:outline-none focus:border-sage text-sm"
                  required
                />
              </div>
            </div>

            {/* Catering Packages */}
            <CateringPackages 
              selectedPackage={selectedPackage}
              onPackageSelect={setSelectedPackage}
              guestCount={parseInt(guestCount) || 0}
            />

            {/* Serving Style */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brown mb-1 sm:mb-2">Serving Style</label>
              <select 
                value={servingStyle} 
                onChange={e => setServingStyle(e.target.value)}
                className="w-full p-2 sm:p-3 border border-beige rounded-lg sm:rounded-xl focus:outline-none focus:border-sage text-sm"
              >
                <option value="Buffet">Buffet</option>
                <option value="Plated">Plated</option>
                <option value="Cocktail">Cocktail</option>
                <option value="Family Style">Family Style</option>
              </select>
            </div>

            {/* Custom Food Items */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-brown">
                Additional Custom Items 🥗 
                {selectedPackage && <span className="text-xs sm:text-sm font-normal text-brown/60 block sm:inline"> (Optional - Add extra items to your package)</span>}
              </h3>
              <p className="text-xs sm:text-sm text-brown/60 mb-3 sm:mb-4">
                {selectedPackage 
                  ? "Add extra vegetarian food items to complement your selected package"
                  : "Add your own vegetarian food items for the event"
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
                <input 
                  type="text" 
                  placeholder="Item Name"
                  value={customItem.name}
                  onChange={e => setCustomItem({...customItem, name: e.target.value})}
                  className="flex-1 p-2 sm:p-3 border border-beige rounded-lg sm:rounded-xl focus:outline-none focus:border-sage text-sm"
                />
                <input 
                  type="number" 
                  placeholder="Quantity"
                  value={customItem.quantity}
                  onChange={e => setCustomItem({...customItem, quantity: parseInt(e.target.value)})}
                  className="w-full sm:w-20 p-2 sm:p-3 border border-beige rounded-lg sm:rounded-xl focus:outline-none focus:border-sage text-sm"
                  min="1"
                />
                <select 
                  value={customItem.dietary}
                  onChange={e => setCustomItem({...customItem, dietary: e.target.value})}
                  className="w-full sm:w-auto p-2 sm:p-3 border border-beige rounded-lg sm:rounded-xl focus:outline-none focus:border-sage text-sm"
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="jain">Jain</option>
                </select>
                <button 
                  type="button" 
                  onClick={addItem}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-sage text-white rounded-lg sm:rounded-xl hover:bg-sage/80 transition-colors text-xs sm:text-sm font-medium"
                >
                  Add Item
                </button>
              </div>

              {items.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-brown text-sm sm:text-base">Added Items:</h4>
                  {items.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg sm:rounded-xl gap-2">
                      <div className="flex-1">
                        <span className="font-medium text-sm sm:text-base">{item.name}</span>
                        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                          <span className="text-brown/60">x {item.quantity}</span>
                          <span className="text-green-600">🥗 {item.dietary}</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium self-start sm:self-auto"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brown mb-1 sm:mb-2">Special Requirements</label>
              <textarea 
                placeholder="Any special dietary requirements, equipment needed, etc."
                value={specialRequirements}
                onChange={e => setSpecialRequirements(e.target.value)}
                className="w-full p-2 sm:p-3 border border-beige rounded-lg sm:rounded-xl focus:outline-none focus:border-sage text-sm"
                rows="3"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-brown text-white rounded-lg sm:rounded-xl hover:bg-brown/80 transition-colors disabled:opacity-50 font-medium text-sm sm:text-base"
            >
              {loading ? 'Placing Order...' : 'Place Catering Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
