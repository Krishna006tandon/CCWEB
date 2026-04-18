import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-beige pt-14 sm:pt-20 pb-8 sm:pb-10 mt-14 sm:mt-20 rounded-t-[2rem] sm:rounded-t-[3rem]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 sm:gap-12 mb-12 sm:mb-16">
          <div className="md:w-1/3 min-w-0">
            <Link to="/" className="text-lg sm:text-2xl font-bold text-brown flex items-center gap-3 mb-5 sm:mb-6">
              <img src={logo} alt="Poonam Cooking and Baking Classes" className="w-20 sm:w-28 h-auto object-contain shrink-0" />
              <span className="leading-tight">Poonam Cooking and Baking Classes</span>
            </Link>
            <p className="text-brown/70 text-sm leading-relaxed mb-6">
              Elevate your culinary skills with interactive classes, premium recipes, and tools designed for every level.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-16 md:w-1/2 w-full md:justify-end">
            <div>
              <h4 className="font-semibold text-brown mb-4">Platform</h4>
              <div className="flex flex-col space-y-3 text-sm text-brown/70">
                <Link to="/" className="hover:text-sage transition-colors">Home</Link>
                <Link to="/classes" className="hover:text-sage transition-colors">Classes</Link>
                <Link to="/dashboard" className="hover:text-sage transition-colors">Dashboard</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-brown mb-4">Legal</h4>
              <div className="flex flex-col space-y-3 text-sm text-brown/70">
                <a href="#" className="hover:text-sage transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-sage transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-sage transition-colors">Contact Us</a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-beige text-xs text-brown/50 text-center md:text-left">
          <p>&copy; 2026 Poonam Cooking and Baking Classes. All rights reserved.</p>
          <div className="flex space-x-4">
            <div className="w-8 h-8 rounded-full bg-peach/50 flex items-center justify-center hover:bg-peach transition-colors cursor-pointer text-brown">IG</div>
            <div className="w-8 h-8 rounded-full bg-peach/50 flex items-center justify-center hover:bg-peach transition-colors cursor-pointer text-brown">TW</div>
            <div className="w-8 h-8 rounded-full bg-peach/50 flex items-center justify-center hover:bg-peach transition-colors cursor-pointer text-brown">FB</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
