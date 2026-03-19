import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

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
    <div className="w-full relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-peach/30 rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-sage/20 rounded-full blur-[100px] -z-10 -translate-x-1/2"></div>
      
      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center justify-center relative overflow-hidden py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-[55%] xl:w-[60%] z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-soft border border-beige mb-6">
               <span className="w-2 h-2 rounded-full bg-sage animate-pulse"></span>
               <span className="text-xs font-semibold tracking-wider text-brown uppercase">New Interactive Courses</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-brown mb-6 leading-[1.1] tracking-tight">
              Learn to<br/>
              <span className="text-gradient">Cook Like a Pro</span>
            </h1>
            <p className="text-brown/70 text-lg sm:text-xl mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Join fun & interactive cooking classes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/classes" className="btn-primary text-center">
                Browse Classes
              </Link>
              <Link to="/about" className="px-8 py-3 rounded-full text-brown font-medium bg-white border border-beige hover:bg-beige/50 transition-colors shadow-sm text-center">
                Meet the Chefs
              </Link>
            </div>
          </div>
          <div className="lg:w-[45%] xl:w-[40%] relative">
             <div className="w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img src="https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=800&h=1000" alt="Cooking Masterclass" className="w-full h-full object-cover" />
             </div>
             <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border border-beige flex items-center gap-4">
                <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center text-sage text-2xl font-bold">50+</div>
                <div>
                  <p className="font-bold text-brown">Premium Recipes</p>
                  <p className="text-xs text-brown/60">Updated Weekly</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Classes */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
               <h2 className="text-4xl font-bold text-brown mb-4 tracking-tight">Featured Masterclasses</h2>
               <p className="text-brown/70 text-lg font-light max-w-xl">Curated exceptional culinary experiences designed to transform your home cooking.</p>
            </div>
            <Link to="/classes" className="hidden sm:inline-block text-sage font-medium hover:text-brown transition-colors">
              View all classes &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-white/40 h-[400px] rounded-[2rem]"></div>
              ))
            ) : (
              featuredClasses.map((cls) => (
                <div key={cls._id} className="premium-card group flex flex-col">
                  <div className="relative overflow-hidden rounded-2xl mb-6 aspect-video">
                     <img src={cls.image} alt={cls.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brown shadow-sm">
                        {cls.duration}
                     </div>
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-brown leading-tight mb-3">{cls.title}</h3>
                    <p className="text-sm text-brown/60 mb-6 leading-relaxed flex-grow line-clamp-2">{cls.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-beige">
                       <span className="text-2xl font-bold text-sage">₹{cls.price}</span>
                       <Link to={`/enroll/${cls._id}`} className="bg-peach/50 text-brown hover:bg-peach px-6 py-2 rounded-full font-medium text-sm transition-colors">
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
      <section className="py-24 bg-white/50 relative">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-bold text-brown mb-4 tracking-tight">Essential Kitchen Tools</h2>
             <p className="text-brown/70 text-lg font-light max-w-2xl mx-auto">Equip your kitchen with professional-grade tools used by our chefs.</p>
           </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {loading ? (
               [1,2,3].map(i => (
                  <div key={i} className="animate-pulse bg-white/40 h-[350px] rounded-full"></div>
               ))
            ) : (
              featuredProducts.map((p) => (
                <div key={p._id} className="premium-card group flex flex-col items-center text-center p-8">
                  <div className="w-48 h-48 rounded-full overflow-hidden mb-8 shadow-inner-soft p-4 bg-beige/30">
                     <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl font-bold text-brown mb-2">{p.name}</h3>
                  <p className="text-sage font-bold text-lg mb-6">₹{p.price}</p>
                  <Link to="/shop" className="w-full bg-transparent border border-brown text-brown hover:bg-brown hover:text-white transition-colors py-2.5 rounded-full font-medium text-sm text-center">
                    Shop Now
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Chef Introduction */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="bg-brown text-cream rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 lg:gap-20 shadow-2xl relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-sage rounded-bl-full opacity-20 blur-3xl"></div>
             
             <div className="w-48 h-48 md:w-72 md:h-72 shrink-0 relative z-10">
               <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600" alt="Chef Poonam" className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-peach border-opacity-30" />
               <div className="absolute -bottom-4 -right-4 bg-sage text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">Lead Chef</div>
             </div>
             
             <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">Meet Chef Poonam</h2>
               <div className="w-16 h-1 bg-peach mb-8 rounded-full"></div>
               <p className="text-cream/80 text-lg leading-relaxed font-light mb-8 italic">
                 "I passionately believe that cooking should be enjoyable, simple, and shared. Through these classes, my goal is to make professional culinary techniques accessible, so you can prepare extraordinary meals at home."
               </p>
               <p className="font-bold text-peach tracking-widest uppercase text-sm">Poonam — Culinary Expert</p>
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 mb-20 relative">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-brown mb-16 tracking-tight">What Our Students Say</h2>
            
            <div className="glass-panel p-12 relative overflow-visible">
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-6xl text-sage opacity-50 font-serif">"</div>
               <p className="text-2xl text-brown leading-relaxed font-light italic mb-8 relative z-10">
                 These classes completely transformed how I cook! They're incredibly informative, beautiful to watch, and actually fun. I went from basically burning toast to making gourmet meals at home with confidence.
               </p>
               <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-beige overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200" alt="Sarah M." className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-brown">Sarah Miller</p>
                     <p className="text-xs text-brown/60">Enrolled in 4 classes</p>
                  </div>
               </div>
            </div>
            
            <div className="flex justify-center gap-3 mt-10">
               <button className="w-3 h-3 rounded-full bg-brown"></button>
               <button className="w-3 h-3 rounded-full bg-beige hover:bg-peach transition-colors"></button>
               <button className="w-3 h-3 rounded-full bg-beige hover:bg-peach transition-colors"></button>
            </div>
        </div>
      </section>
    </div>
  );
}
