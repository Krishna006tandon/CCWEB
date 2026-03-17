import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await api.get('/classes');
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen py-16 px-6 lg:px-8 relative">
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/20 rounded-full blur-[100px] -z-10"></div>
       
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-brown mb-6 tracking-tight">Our Classes</h1>
          <p className="text-xl text-brown/70 font-light max-w-2xl mx-auto">Discover a range of culinary experiences tailored to every skill level, taught by professional chefs.</p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-10">
             <button className="px-6 py-2 rounded-full bg-brown text-white text-sm font-medium shadow-md">All Classes</button>
             <button className="px-6 py-2 rounded-full bg-white text-brown hover:bg-beige hover:text-brown border border-beige text-sm font-medium transition-colors">Beginner</button>
             <button className="px-6 py-2 rounded-full bg-white text-brown hover:bg-beige hover:text-brown border border-beige text-sm font-medium transition-colors">Intermediate</button>
             <button className="px-6 py-2 rounded-full bg-white text-brown hover:bg-beige hover:text-brown border border-beige text-sm font-medium transition-colors">Advanced</button>
          </div>
        </div>
        
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {classes.map((cls) => (
              <div key={cls._id} className="premium-card group flex flex-col p-5">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/3]">
                   <img src={cls.image} alt={cls.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute top-4 left-4 flex gap-2">
                       <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-brown shadow-sm uppercase tracking-wider">
                          {cls.chefName}
                       </span>
                   </div>
                   <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brown shadow-sm flex items-center gap-1">
                      <svg className="w-3 h-3 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {cls.duration}
                   </div>
                </div>
                <div className="flex flex-col flex-grow">
                   <h3 className="text-xl font-bold text-brown mb-2 leading-tight">{cls.title}</h3>
                   <p className="text-sm text-brown/60 mb-8 leading-relaxed flex-grow">{cls.description}</p>
                   
                   <div className="flex items-center justify-between pt-5 border-t border-beige/60">
                      <span className="text-2xl font-bold text-sage">${cls.price}</span>
                      <Link to={`/enroll/${cls._id}`} className="bg-brown text-white hover:bg-brown/80 px-6 py-2.5 rounded-full font-medium text-sm transition-colors shadow-sm">
                        Enroll Now
                      </Link>
                   </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}
