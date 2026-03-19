import { useNavigate } from 'react-router-dom';

export default function CateringComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center">
          <div className="mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-peach/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <span className="text-2xl sm:text-4xl">🍽️</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brown mb-3 sm:mb-4">Event Catering</h1>
            <div className="w-16 h-1 sm:w-20 bg-sage mx-auto rounded-full mb-4 sm:mb-6"></div>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <p className="text-lg sm:text-xl text-brown/70 font-light leading-relaxed">
              Our premium catering services are coming soon!
            </p>
            
            <div className="bg-beige/50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-brown mb-3 sm:mb-4">What's Coming</h2>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl shadow-soft flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">🎂</span>
                </div>
                <h3 className="font-bold text-brown mb-2 text-sm sm:text-base">Kitty Parties</h3>
                <p className="text-xs sm:text-sm text-brown/60">Complete kitty party catering solutions with delicious homemade-style food</p>
              </div>
            </div>
            
            <div className="bg-sage/10 rounded-2xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-brown mb-2 sm:mb-3">Stay Updated</h3>
              <p className="text-brown/70 mb-3 sm:mb-4 text-sm sm:text-base">
                Be the first to know when our catering services launch! Get exclusive early-bird discounts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button 
                  onClick={() => navigate('/contact')}
                  className="bg-brown text-white hover:bg-brown/80 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium transition-colors shadow-sm text-sm sm:text-base"
                >
                  Notify Me
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="bg-transparent border border-brown text-brown hover:bg-brown hover:text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium transition-colors text-sm sm:text-base"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
