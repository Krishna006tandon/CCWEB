import { useState } from 'react';

export default function Contact() {
   const [submitted, setSubmitted] = useState(false);

   const handleSubmit = (e) => {
      e.preventDefault();
      setSubmitted(true);
   };

   return (
      <div className="min-h-screen pt-32 pb-20 bg-cream/30 px-6 lg:px-8 relative overflow-hidden">
         {/* Background accents */}
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sage/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-peach/10 rounded-full blur-[120px] -z-10 translate-x-1/2 translate-y-1/2"></div>

         <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/2">
               <h1 className="text-6xl font-bold text-brown mb-8 tracking-tighter">Get in <br /><span className="text-sage">Touch.</span></h1>
               <p className="text-xl text-brown/60 font-light leading-relaxed mb-12 max-w-md">
                  Have questions about our classes or professional kits? We'd love to hear from you.
               </p>

               <div className="space-y-10">
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
                        <a href="+91 8956395162 \n+91 9175603240" className="text-brown/50 font-medium hover:text-sage transition-colors">poonamcookingclassess@gmail.com</a>
                     </div>
                  </div>

                  <div className="flex items-start gap-6">
                     <div className="w-12 h-12 bg-white rounded-2xl shadow-soft flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                     </div>
                     <div>
                        <h4 className="font-bold text-brown text-lg">Visit Studio</h4>
                        <a href="https://maps.app.goo.gl/CbnU8amDfPZNSnxB7" target="_blank" rel="noopener noreferrer" className="text-brown/50 font-medium hover:text-sage transition-colors">48/7, Ujwal Nagar, Manish Nagar, Somalwada, Nagpur, Maharashtra 440025</a>
                        <p className="text-brown/40 text-sm mt-2">Click for directions</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:w-1/2">
               <div className="glass-panel p-10 md:p-14 bg-white/70 shadow-2xl relative">
                  {submitted ? (
                     <div className="text-center py-20">
                        <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-8">
                           <svg className="w-10 h-10 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-brown mb-2">Message Sent!</h3>
                        <p className="text-brown/60">We'll get back to you within 24 hours.</p>
                        <button onClick={() => setSubmitted(false)} className="mt-8 text-sage font-bold hover:underline">Send another message</button>
                     </div>
                  ) : (
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className="block text-xs font-bold uppercase tracking-widest text-brown/40 mb-2 ml-1">Name</label>
                              <input required type="text" className="w-full px-5 py-4 bg-white border border-beige rounded-2xl outline-none focus:border-sage transition-all text-sm font-medium" placeholder="Your Name" />
                           </div>
                           <div>
                              <label className="block text-xs font-bold uppercase tracking-widest text-brown/40 mb-2 ml-1">Email</label>
                              <input required type="email" className="w-full px-5 py-4 bg-white border border-beige rounded-2xl outline-none focus:border-sage transition-all text-sm font-medium" placeholder="your@email.com" />
                           </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold uppercase tracking-widest text-brown/40 mb-2 ml-1">Message</label>
                           <textarea required className="w-full px-5 py-4 bg-white border border-beige rounded-2xl outline-none focus:border-sage transition-all text-sm font-medium" rows="5" placeholder="Tell us how we can help..."></textarea>
                        </div>
                        <button type="submit" className="w-full btn-primary !py-4 shadow-xl">
                           Send Message
                        </button>
                     </form>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
