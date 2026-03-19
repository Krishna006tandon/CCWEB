import { useState, useEffect } from 'react';
import api from '../services/api';

export default function CateringPackages({ selectedPackage, onPackageSelect, guestCount }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get('/catering/packages');
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (pkg) => {
    return pkg.pricePerPerson * guestCount;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brown"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-brown">Choose a Catering Package 🎉</h3>
      <p className="text-sm text-brown/60">Select from our specially curated packages for your event</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div 
            key={pkg._id}
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
              selectedPackage?._id === pkg._id 
                ? 'border-sage bg-sage/10' 
                : 'border-beige hover:border-sage/50'
            }`}
            onClick={() => onPackageSelect(pkg)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-brown text-lg">{pkg.name}</h4>
                <span className="inline-block px-2 py-1 bg-sage/20 text-sage text-xs rounded-full mt-1">
                  {pkg.packageType}
                </span>
                {pkg.isPopular && (
                  <span className="inline-block px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full mt-1 ml-2">
                    ⭐ Popular
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-brown">₹{pkg.pricePerPerson}</div>
                <div className="text-xs text-brown/60">per person</div>
              </div>
            </div>

            <p className="text-sm text-brown/70 mb-4">{pkg.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-brown/60">Guests:</span>
                <span className="font-medium">{pkg.minGuests} - {pkg.maxGuests} people</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brown/60">Serving Style:</span>
                <span className="font-medium">{pkg.servingStyle}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brown/60">Preparation Time:</span>
                <span className="font-medium">{pkg.preparationTime} hours</span>
              </div>
              {guestCount >= pkg.minGuests && guestCount <= pkg.maxGuests && (
                <div className="flex justify-between text-sm font-semibold text-green-600">
                  <span>Total for {guestCount} guests:</span>
                  <span>₹{calculateTotalPrice(pkg)}</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <h5 className="font-medium text-brown mb-2">Menu Items:</h5>
              <div className="space-y-1">
                {pkg.items.slice(0, 4).map((item, index) => (
                  <div key={index} className="text-xs text-brown/70">
                    • {item.name} ({item.quantity} {item.unit} per person)
                  </div>
                ))}
                {pkg.items.length > 4 && (
                  <div className="text-xs text-brown/50">
                    +{pkg.items.length - 4} more items
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h5 className="font-medium text-brown mb-2">Inclusions:</h5>
              <div className="flex flex-wrap gap-1">
                {pkg.inclusions.map((inclusion, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-beige text-brown/70 text-xs rounded"
                  >
                    {inclusion}
                  </span>
                ))}
              </div>
            </div>

            {guestCount < pkg.minGuests && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                Minimum {pkg.minGuests} guests required
              </div>
            )}
            
            {guestCount > pkg.maxGuests && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                Maximum {pkg.maxGuests} guests allowed
              </div>
            )}

            {pkg.customizations.canModifyItems && (
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded mt-2">
                ✨ Customizable items available
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedPackage && (
        <div className="bg-sage/10 border-2 border-sage rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-brown">Selected Package: {selectedPackage.name}</h4>
              <p className="text-sm text-brown/70">
                {selectedPackage.items.length} items • {selectedPackage.inclusions.length} inclusions
              </p>
            </div>
            <button 
              type="button"
              onClick={() => onPackageSelect(null)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
