import React from 'react';
import { motion } from 'framer-motion';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden font-sans text-white px-4">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-t-2 border-r-2 border-amber-500 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Under Maintenance
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 mb-10 leading-relaxed max-w-lg mx-auto">
            <b>Poonam Cooking Classes</b> is currently undergoing a scheduled upgrade to serve you better. We'll be back shortly with a fresh experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="h-px w-12 bg-neutral-800 hidden sm:block"></div>
            <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-medium">
              We'll be back soon
            </span>
            <div className="h-px w-12 bg-neutral-800 hidden sm:block"></div>
          </div>

          <div className="mt-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-neutral-300 text-sm">Our team is working on updates</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 text-neutral-500 text-sm tracking-wide"
      >
        © {new Date().getFullYear()} Poonam Cooking Classes
      </motion.div>
    </div>
  );
};

export default Maintenance;
