import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SEO from '../components/SEO';

export default function Home() {
  const [featuredClasses, setFeaturedClasses] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, prodRes] = await Promise.all([
          api.get('/classes'),
          api.get('/products')
        ]);
        // Show first 3 as featured
        setFeaturedClasses(classRes.data.slice(0, 3));
        setFeaturedProducts(prodRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <SEO
        title="Home - Learn to Cook Like a Pro | Poonam Cooking and Baking Classes"
        description="Join Poonam Cooking and Baking Classes for professional culinary training in Mumbai. Learn cooking, baking, and catering from expert chefs with interactive courses and premium recipes."
        keywords="poonam classes, poonam cooking classes, baking classes, poonam baking classes, cooking classes Mumbai, culinary training, professional cooking, chef training, cooking courses, baking courses, catering classes"
        ogUrl="/"
      />
      <div className="w-full relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-peach/30 rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-sage/20 rounded-full blur-[100px] -z-10 -translate-x-1/2"></div>

        {/* Hero Section */}
        <section className="min-h-[90vh] sm:min-h-[85vh] flex items-center justify-center relative overflow-hidden py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="lg:w-[55%] xl:w-[60%] z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white shadow-soft border border-beige mb-4 sm:mb-6">
                <span className="w-2 h-2 rounded-full bg-sage animate-pulse"></span>
                <span className="text-xs font-semibold tracking-wider text-brown uppercase">New Interactive Courses</span>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-soft flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-brown text-lg">Email Us</h4>
                  <a href="mailto:poonamcookingclassess@gmail.com" className="text-brown/50 font-medium hover:text-sage transition-colors">poonamcookingclassess@gmail.com</a>
                </div>
                <div>
                  <h4 className="font-bold text-brown text-lg">Contact Number</h4>
                  <a href="+91 8956395162" className="text-brown/50 font-medium hover:text-sage transition-colors">+91 8956395162</a>
                  <br />
                  <a href="+91 9175603240" className="text-brown/50 font-medium hover:text-sage transition-colors">+91 9175603240</a>

                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-brown mb-4 sm:mb-6 leading-[1.1] tracking-tight">
                Learn to<br />
                <span className="text-gradient">Cook Like a Pro</span>
              </h1>
              <p className="text-brown/70 text-base sm:text-lg md:text-xl mb-6 sm:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Join fun & interactive cooking classes
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link to="/classes" className="btn-primary text-center text-sm sm:text-base">
                  Browse Classes
                </Link>
                <Link to="/about" className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-brown font-medium bg-white border border-beige hover:bg-beige/50 transition-colors shadow-sm text-center text-sm sm:text-base">
                  Meet the Chefs
                </Link>
              </div>
            </div>
            <div className="lg:w-[50%] xl:w-[50%] relative w-full">
              <div className="w-full aspect-[4/5] sm:aspect-[5/5] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-4x2 border-8 sm:border-12 border-white">
                <img src="/logo.png" alt="Poonam Cooking and Baking Classes" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 sm:-bottom-8 sm:-left-8 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-beige flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sage/20 rounded-full flex items-center justify-center text-sage text-lg sm:text-2xl font-bold">50+</div>
                <div>
                  <p className="font-bold text-brown text-sm sm:text-base">Premium Recipes</p>
                  <p className="text-xs text-brown/60">Updated Weekly</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Classes */}
        <section className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-12 sm:mb-16">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brown mb-3 sm:mb-4 tracking-tight">Featured Masterclasses</h2>
                <p className="text-brown/70 text-base sm:text-lg font-light max-w-xl">Curated exceptional culinary experiences designed to transform your home cooking.</p>
              </div>
              <Link to="/classes" className="inline-block text-sage font-medium hover:text-brown transition-colors text-sm sm:text-base">
                View all classes &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-white/40 h-[350px] sm:h-[400px] rounded-[2rem]"></div>
                ))
              ) : (
                featuredClasses.map((cls) => (
                  <div key={cls._id} className="premium-card group flex flex-col">
                    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl mb-4 sm:mb-6 aspect-video">
                      <img src={cls.image} alt={cls.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 backdrop-blur px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-brown shadow-sm">
                        {cls.duration}
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h3 className="text-lg sm:text-xl font-bold text-brown leading-tight mb-2 sm:mb-3">{cls.title}</h3>
                      <p className="text-sm text-brown/60 mb-4 sm:mb-6 leading-relaxed flex-grow line-clamp-2">{cls.description}</p>

                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-beige">
                        <span className="text-xl sm:text-2xl font-bold text-sage">₹{cls.price}</span>
                        <Link to={`/enroll/${cls._id}`} className="bg-peach/50 text-brown hover:bg-peach px-4 sm:px-6 py-2 rounded-full font-medium text-xs sm:text-sm transition-colors">
                          Enroll Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Popular Cooking Products Section */}
        <section className="py-16 sm:py-24 bg-white/50 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brown mb-3 sm:mb-4 tracking-tight">Essential Kitchen Tools</h2>
              <p className="text-brown/70 text-base sm:text-lg font-light max-w-2xl mx-auto">Equip your kitchen with professional-grade tools used by our chefs.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-white/40 h-[300px] sm:h-[350px] rounded-full"></div>
                ))
              ) : (
                featuredProducts.map((p) => (
                  <div key={p._id} className="premium-card group flex flex-col items-center text-center p-6 sm:p-8">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-6 sm:mb-8 shadow-inner-soft p-3 sm:p-4 bg-beige/30">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-brown mb-2">{p.name}</h3>
                    <p className="text-sage font-bold text-base sm:text-lg mb-4 sm:mb-6">₹{p.price}</p>
                    <Link to="/shop" className="w-full bg-transparent border border-brown text-brown hover:bg-brown hover:text-white transition-colors py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm text-center">
                      Shop Now
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Chef Introduction */}
        <section className="py-20 sm:py-32 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-brown text-cream rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-center gap-8 lg:gap-20 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-sage rounded-bl-full opacity-20 blur-3xl"></div>

              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-72 md:h-72 shrink-0 relative z-10">
                <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600" alt="Chef Poonam" className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-peach border-opacity-30" />
                <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-sage text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">Lead Chef</div>
              </div>

              <div className="relative z-10 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 tracking-tight text-white">Meet Chef Poonam</h2>
                <div className="w-12 h-1 sm:w-16 bg-peach mb-6 sm:mb-8 rounded-full"></div>
                <p className="text-cream/80 text-base sm:text-lg leading-relaxed font-light mb-6 sm:mb-8 italic">
                  "I passionately believe that cooking should be enjoyable, simple, and shared. Through these classes, my goal is to make professional culinary techniques accessible, so you can prepare extraordinary meals at home."
                </p>
                <p className="font-bold text-peach tracking-widest uppercase text-xs sm:text-sm">Poonam — Culinary Expert</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
