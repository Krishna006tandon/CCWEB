import { motion as Motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden font-sans text-white px-4 selection:bg-amber-500/30">
      <Helmet>
        <title>Under Maintenance | Poonam Cooking & Baking Classes</title>
        <meta name="description" content="Poonam Cooking & Baking Classes is currently undergoing scheduled maintenance. We'll be back soon!" />
      </Helmet>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-[140px]"
        />
        <Motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-tl from-orange-600/20 to-transparent rounded-full blur-[140px]"
        />
      </div>

      <div className="relative z-10 text-center max-w-3xl">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Premium Animated Icon */}
          <div className="flex justify-center mb-10">
            <div className="relative group">
              <Motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border-t-[3px] border-r-[1px] border-amber-500/40 rounded-full"
              />
              <Motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-b-[3px] border-l-[1px] border-orange-500/30 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg
                    className="w-14 h-14 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M21 15.546c0 1.587-1.416 2.452-2.733 1.76l-2.227-1.113a2 2 0 00-1.79 0L12.023 17.3c-1.317.692-2.733-.173-2.733-1.76V7.02l4.636 2.318a2 2 0 011.097 1.789v.454"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 10V7a2 2 0 012-2h2M7 3h10M17 3h2a2 2 0 012 2v3M21 17v2a2 2 0 01-2 2h-2M17 21H7M7 21H5a2 2 0 01-2-2v-2" />
                  </svg>
                </Motion.div>
              </div>
            </div>
          </div>

          <Motion.h1 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none"
          >
            <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
              Under
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
              Maintenance
            </span>
          </Motion.h1>

          <p className="text-xl md:text-2xl text-neutral-400 mb-12 leading-relaxed max-w-xl mx-auto font-light">
            <span className="text-white font-medium">Poonam Cooking & Baking Classes</span> is leveling up. We'll be back shortly with a brand new digital kitchen.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
              <span className="text-neutral-300 text-sm font-medium uppercase tracking-widest">Upgrade in Progress</span>
            </div>
          </div>

          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-neutral-500 border-t border-white/5 pt-12"
          >
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-tighter text-neutral-600">Status</span>
              <span className="text-sm font-medium text-neutral-400">Server Migration</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-tighter text-neutral-600">Eta</span>
              <span className="text-sm font-medium text-neutral-400">Coming Soon</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-tighter text-neutral-600">Contact</span>
              <span className="text-sm font-medium text-neutral-400">support@poonamclasses.com</span>
            </div>
          </Motion.div>
        </Motion.div>
      </div>

      {/* Footer Branding */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 text-neutral-600 text-xs tracking-[0.2em] uppercase"
      >
        © {new Date().getFullYear()} Poonam Cooking & Baking Classes | Crafted by Nexbyte
      </Motion.div>
    </div>
  );
};

export default Maintenance;
