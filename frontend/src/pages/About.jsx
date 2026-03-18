export default function About() {
  return (
    <div className="min-h-screen pt-24 bg-cream/30 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Story Section */}
        <section className="flex flex-col lg:flex-row items-center gap-16 mb-32">
          <div className="lg:w-1/2">
            <h1 className="text-5xl font-bold text-brown mb-8 tracking-tight">Our Story</h1>
            <p className="text-xl text-brown/70 font-light leading-relaxed mb-6">
              Founded in 2026, Cookery. began with a simple mission: to bridge the gap between amateur home cooking and professional culinary artistry.
            </p>
            <p className="text-lg text-brown/60 font-light leading-relaxed mb-8">
              We believe that everyone has the potential to be a great chef. Our platform connects passionate food enthusiasts with Michelin-star experienced chefs through immersive, interactive online masterclasses.
            </p>
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-beige">
               <div>
                  <p className="text-3xl font-bold text-sage">15k+</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-brown/40 mt-1">Students</p>
               </div>
               <div>
                  <p className="text-3xl font-bold text-sage">50+</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-brown/40 mt-1">Chefs</p>
               </div>
               <div>
                  <p className="text-3xl font-bold text-sage">200+</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-brown/40 mt-1">Recipes</p>
               </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
             <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3">
                <img src="https://images.unsplash.com/photo-1556910103-1c02745a872f?w=800" className="w-full h-full object-cover" alt="Cooking" />
             </div>
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-peach rounded-full blur-[100px] -z-10 opacity-30"></div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-24 border-t border-beige/40">
           <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-brown mb-4 tracking-tight">Our Philosophy</h2>
              <div className="w-20 h-1.5 bg-sage mx-auto rounded-full"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {title: "Accessibility", desc: "No matter your skill level, we break down complex techniques into simple, repeatable steps."},
                {title: "Quality", desc: "We only partner with the best chefs and suggest the highest quality ingredients and tools."},
                {title: "Community", desc: "Cooking is a social experience. We foster a community where students can share and learn."}
              ].map((item, i) => (
                <div key={i} className="text-center">
                   <div className="w-16 h-16 bg-white rounded-2xl shadow-soft flex items-center justify-center mx-auto mb-8">
                      <span className="text-2xl font-bold text-sage">{i+1}</span>
                   </div>
                   <h3 className="text-xl font-bold text-brown mb-4">{item.title}</h3>
                   <p className="text-brown/60 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
