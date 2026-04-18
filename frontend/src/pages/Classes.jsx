import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const bookingFlow = [
  { title: 'Choose Class', description: 'Select the class style that matches your interest and level.' },
  { title: 'Share Preferences', description: 'Pick mode, preferred date, time, and your learning goal.' },
  { title: 'Request Booking', description: 'Submit your request without seeing any fee upfront.' },
  { title: 'Admin Reviews', description: 'Admin checks availability, trainer fit, and batch timing.' },
  { title: 'Private Confirmation', description: 'Slot and fee are shared only after review and confirmation.' },
  { title: 'Booking Finalized', description: 'Once approved, payment and final schedule are handled privately.' }
];

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/20 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-16">
        <section className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-6 tracking-tight">Class Booking Requests</h1>
          <p className="text-base sm:text-xl text-brown/70 font-light max-w-3xl mx-auto">
            Explore our culinary classes and send a booking request first. Slot confirmation and pricing are shared only after admin review.
          </p>

          <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-3 rounded-full bg-white/80 px-5 py-3 border border-beige shadow-soft">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brown/50">No Public Pricing</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sage"></span>
            <span className="text-sm text-brown/70">Request first, confirm later</span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
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
                  <svg className="w-3 h-3 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {cls.duration}
                </div>
              </div>

              <div className="flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-brown mb-2 leading-tight">{cls.title}</h3>
                <p className="text-sm text-brown/60 mb-6 leading-relaxed flex-grow">{cls.description}</p>

                <div className="rounded-2xl bg-cream/70 border border-beige/70 px-4 py-4 mb-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brown/40 mb-2">Booking Flow</p>
                  <p className="text-sm text-brown/70">
                    Send your preferred slot first. Admin will review availability, confirm the batch, and share fees privately.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-5 border-t border-beige/60">
                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-brown/35">Price Shared After Confirmation</span>
                  <Link
                    to={`/enroll/${cls._id}`}
                    className="bg-brown text-white hover:bg-brown/80 px-6 py-2.5 rounded-full font-medium text-sm transition-colors shadow-sm text-center"
                  >
                    Request Booking
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="glass-panel p-5 sm:p-8 md:p-10 bg-white/75">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brown/40 mb-3">User to Admin Flow</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-brown">Booking happens in two stages</h2>
            </div>
            <p className="text-brown/60 max-w-2xl">
              The site collects intent and preferences first. Admin then validates availability and shares the final commercial details privately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {bookingFlow.map((step, index) => (
              <div key={step.title} className="rounded-[1.75rem] border border-beige/70 bg-white/80 p-6 shadow-soft relative overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-brown/35">Step {index + 1}</span>
                <h3 className="text-xl font-bold text-brown mt-3 mb-3">{step.title}</h3>
                <p className="text-sm text-brown/65 leading-relaxed">{step.description}</p>
                <div className="absolute -right-5 -bottom-5 w-20 h-20 rounded-full bg-peach/10"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
