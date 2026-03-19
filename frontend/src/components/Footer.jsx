import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-beige pt-20 pb-10 mt-20 rounded-t-[3rem]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
           <div className="md:w-1/3">
              <Link to="/" className="text-2xl font-bold text-brown flex items-center gap-2 mb-6">
                <img src={logo} alt="Poonam Cooking and Baking Classes" className="w-30 h-15 object-contain" />
                Poonam Cooking and Baking Classes
              </Link>
              <p className="text-brown/70 text-sm leading-relaxed mb-6">
                 Elevate your culinary skills with interactive classes, premium recipes, and tools designed for every level.
              </p>
           </div>
           
           <div className="flex gap-16 md:w-1/2 justify-end">
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
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-beige text-xs text-brown/50">
           <p>© 2026 Poonam Cooking and Baking Classes. All rights reserved.</p>
           <div className="flex space-x-4 mt-4 md:mt-0">
             <div className="w-8 h-8 rounded-full bg-peach/50 flex items-center justify-center hover:bg-peach transition-colors cursor-pointer text-brown">IG</div>
             <div className="w-8 h-8 rounded-full bg-peach/50 flex items-center justify-center hover:bg-peach transition-colors cursor-pointer text-brown">TW</div>
             <div className="w-8 h-8 rounded-full bg-peach/50 flex items-center justify-center hover:bg-peach transition-colors cursor-pointer text-brown">FB</div>
           </div>
        </div>
      </div>
    </footer>
  );
}
