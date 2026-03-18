import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import api from '../services/api';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('classes');
  const [enrollments, setEnrollments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/enrollments/my');
        setEnrollments(data);
        
        // If there are enrollments, fetch notes for the first class as default or all?
        // Let's fetch notes for all enrolled classes for simplicity in this dashboard view
        const allNotes = [];
        for (const enroll of data) {
           if (enroll.classId?._id) {
              const notesRes = await api.get(`/notes/${enroll.classId._id}`);
              allNotes.push(...notesRes.data);
           }
        }
        setNotes(allNotes);

      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const tabs = [
    {id: 'classes', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', label: 'My Classes'},
    {id: 'notes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Recipe Notes'},
    {id: 'profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Profile'}
  ];

  return (
    <div className="flex min-h-[90vh] bg-cream relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-peach/10 rounded-full blur-[100px] -z-10"></div>
      
      {/* Sidebar */}
      <aside className="w-72 bg-white/40 backdrop-blur-3xl border-r border-beige/40 flex flex-col hidden lg:flex shadow-[4px_0_24px_-10px_rgba(107,79,58,0.05)] z-20 pt-8 h-full sticky top-0">
        
        <div className="px-8 mb-12 flex items-center gap-4">
           <div className="relative">
             <div className="w-12 h-12 rounded-full bg-peach flex items-center justify-center font-bold text-brown shadow-soft border-2 border-white">{user.name?.charAt(0)}</div>
             <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-sage rounded-full border-2 border-white"></div>
           </div>
           <div>
              <p className="font-bold text-brown text-sm">{user.name}</p>
              <p className="text-xs text-brown/50 uppercase tracking-widest font-semibold mt-0.5">{user.role}</p>
           </div>
        </div>

        <nav className="flex-1 px-5 space-y-1.5">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all text-sm font-semibold flex items-center gap-3 tracking-wide ${activeTab === tab.id ? 'bg-white shadow-soft text-brown' : 'text-brown/50 hover:bg-white/50 hover:text-brown'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeTab === tab.id ? 'bg-peach/30 text-peach' : 'bg-transparent text-brown/40'}`}>
                 <svg className={`w-4 h-4 ${activeTab === tab.id ? 'stroke-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon}></path></svg>
              </span>
              {tab.label}
            </button>
          ))}
        </nav>
        
        <div className="p-8">
           <button onClick={handleLogout} className="w-full py-3 rounded-2xl text-brown/50 hover:text-brown hover:bg-white/50 transition-all text-sm font-bold flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Log Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-14 overflow-y-auto z-10">
        <div className="mb-14">
           <h1 className="text-4xl font-bold text-brown mb-2 tracking-tight">Welcome Back, {user.name?.split(' ')[0]}</h1>
           <p className="text-brown/60 text-lg font-light">Continue mastering your culinary journey.</p>
        </div>

        <AnimatePresence mode="wait">
           {activeTab === 'classes' && (
              <div 
                key="classes"
                className="space-y-6"
              >
                <div className="mb-10 flex justify-between items-end">
                   <h3 className="text-xl text-brown font-bold flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-sage inline-block"></span>
                      Enrolled Classes
                   </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {enrollments.map(enroll => (
                    <div key={enroll._id} className="premium-card p-5 group flex flex-col relative overflow-hidden bg-white/80 backdrop-blur-xl">
                      <div className="relative overflow-hidden rounded-[1rem] aspect-video mb-5 shadow-inner-soft">
                         <img src={enroll.classId?.image} alt={enroll.classId?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                         <div className="absolute inset-0 bg-gradient-to-t from-brown/80 to-transparent opacity-60"></div>
                      </div>
                      <div className="flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-brown mb-4 leading-tight">{enroll.classId?.title}</h3>
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-beige/60">
                           <span className="text-xl font-bold text-sage">${enroll.classId?.price}</span>
                           <button onClick={() => navigate(`/classes`)} className="bg-brown text-white hover:bg-brown/80 px-4 py-2 rounded-full font-medium text-xs transition-colors shadow-sm">
                             View Details
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {enrollments.length === 0 && (
                    <div className="col-span-full py-20 text-center glass-panel">
                       <p className="text-brown/40 italic">You haven't enrolled in any classes yet.</p>
                       <Link to="/classes" className="text-sage font-bold mt-4 inline-block hover:underline">Browse Classes</Link>
                    </div>
                  )}
                </div>
              </div>
           )}

           {activeTab === 'notes' && (
              <div 
                key="notes"
                className="space-y-6"
              >
                <div className="mb-10 flex justify-between items-end">
                   <h3 className="text-xl text-brown font-bold flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-peach inline-block"></span>
                      Recipe Notes & Guides
                   </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {notes.map(note => (
                      <div key={note._id} className="premium-card p-6 bg-white/60 border border-beige/40 flex items-center justify-between group">
                         <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-peach/10 text-peach flex items-center justify-center group-hover:bg-peach group-hover:text-white transition-colors duration-500">
                               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <div>
                               <h4 className="font-bold text-brown">{note.title}</h4>
                               <p className="text-xs text-brown/50 font-medium uppercase tracking-widest mt-1">{note.description}</p>
                            </div>
                         </div>
                         <a href={note.fileURL} target="_blank" rel="noreferrer" className="bg-sage text-white p-3 rounded-xl hover:bg-sage/80 transition-colors shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                         </a>
                      </div>
                   ))}
                   {notes.length === 0 && (
                      <div className="col-span-full py-20 text-center glass-panel">
                         <p className="text-brown/40 italic">No recipe notes available for your classes.</p>
                      </div>
                   )}
                </div>
              </div>
           )}

           {activeTab === 'profile' && (
              <div 
                key="profile"
                className="space-y-6 max-w-2xl"
              >
                <div className="glass-panel p-10 bg-white/80">
                   <div className="flex items-center gap-8 mb-12">
                      <div className="w-24 h-24 rounded-full bg-peach flex items-center justify-center text-3xl font-bold text-brown border-4 border-white shadow-lg">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                         <h2 className="text-2xl font-bold text-brown">{user.name}</h2>
                         <p className="text-brown/50 font-medium uppercase tracking-widest text-sm mt-1">{user.role}</p>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div>
                            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brown/40 mb-2">Email Address</span>
                            <p className="font-bold text-brown">{user.email}</p>
                         </div>
                         <div>
                            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brown/40 mb-2">Member Since</span>
                            <p className="font-bold text-brown">March 2026</p>
                         </div>
                      </div>
                      <div className="pt-8 border-t border-beige/40">
                         <button className="btn-secondary !text-xs !px-6 !py-3">Update Profile</button>
                      </div>
                   </div>
                </div>
              </div>
           )}
        </AnimatePresence>
      </main>
    </div>
  );
}
