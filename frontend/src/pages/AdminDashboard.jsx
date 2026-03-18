import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [enrollments, setEnrollments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [products, setProducts] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const [isAdding, setIsAdding] = useState(false);
  const [targetType, setTargetType] = useState('class');
  const [formData, setFormData] = useState({ 
    title: '', name: '', description: '', price: '', duration: '', chefName: '', stock: '', classId: '', studentId: ''
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enrolRes, classRes, prodRes, certRes] = await Promise.all([
        api.get('/enrollments'),
        api.get('/classes'),
        api.get('/products'),
        api.get('/certificates'),
      ]);
      setEnrollments(enrolRes.data);
      setClasses(classRes.data);
      setProducts(prodRes.data);
      setCertificates(certRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const data = new FormData();
    
    try {
      if (targetType === 'class') {
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('duration', formData.duration);
        data.append('chefName', formData.chefName);
        if (file) data.append('image', file);
        await api.post('/classes', data);
        alert('✅ Class added successfully!');
      } else if (targetType === 'product') {
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        if (file) data.append('image', file);
        await api.post('/products', data);
        alert('✅ Product added successfully!');
      } else if (targetType === 'note') {
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('classId', formData.classId);
        if (file) data.append('file', file);
        await api.post('/notes', data);
        alert('✅ Note uploaded successfully!');
      } else if (targetType === 'certificate') {
        data.append('title', formData.title);
        data.append('studentId', formData.studentId);
        data.append('classId', formData.classId);
        if (file) data.append('file', file);
        await api.post('/certificates', data);
        alert('✅ Certificate uploaded & email sent!');
      }
      setIsAdding(false);
      resetForm();
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
      alert(`❌ Failed: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', name: '', description: '', price: '', duration: '', chefName: '', stock: '', classId: '', studentId: '' });
    setFile(null);
    setError('');
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Delete this ${type}?`)) {
      try {
        if (type === 'class') await api.delete(`/classes/${id}`);
        else if (type === 'product') await api.delete(`/products/${id}`);
        else if (type === 'certificate') await api.delete(`/certificates/${id}`);
        fetchData();
      } catch (err) {
        alert(`❌ Delete failed: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const totalRevenue = enrollments
    .filter(en => en.paymentStatus === 'Completed')
    .reduce((acc, en) => acc + (en.classId?.price || 0), 0);

  const totalStudents = new Set(enrollments.map(en => en.studentId?._id)).size;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const tabs = [
    {id: 'dashboard',    label: 'Overview',     icon: 'M4 6h16M4 12h16M4 18h16'},
    {id: 'classes',      label: 'Classes',       icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'},
    {id: 'products',     label: 'Products',      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'},
    {id: 'notes',        label: 'Recipe Notes',  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'},
    {id: 'payments',     label: 'Enrollments',   icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'},
    {id: 'certificates', label: 'Certificates',  icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'},
  ];

  // Determine which tabs show the "Add" button
  const addableTabs = ['classes', 'products', 'notes', 'certificates'];

  return (
    <div className="flex h-screen bg-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-beige shadow-[4px_0_24px_-10px_rgba(107,79,58,0.02)] flex flex-col pt-12 z-20 h-full">
        <div className="px-8 mb-16 flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brown flex items-center justify-center shadow-lg shadow-brown/20 relative">
             <div className="w-8 h-8 rounded-lg border-2 border-white/20 absolute"></div>
             <span className="text-white font-serif italic font-bold">A</span>
          </div>
          <div>
            <h2 className="font-bold text-brown uppercase tracking-widest text-xs">Admin Panel</h2>
            <p className="font-bold text-brown/40 text-[10px] tracking-widest mt-0.5 uppercase">Cookery Portal</p>
          </div>
        </div>
        
        <nav className="flex-1 px-5 space-y-1.5 overflow-y-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left px-5 py-4 rounded-2xl transition-all text-xs font-bold tracking-wider uppercase flex items-center gap-4 ${activeTab === tab.id ? 'bg-brown text-white shadow-xl shadow-brown/20 translate-x-2' : 'text-brown/50 hover:bg-beige/50 hover:text-brown'}`}>
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-inner-soft transition-colors ${activeTab === tab.id ? 'bg-white/10 text-white' : 'bg-white border border-beige/60 text-brown'}`}>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon}></path></svg>
              </span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-8 space-y-4">
           <button onClick={() => navigate('/')} className="w-full py-3 rounded-2xl text-brown/50 hover:text-brown border border-beige hover:bg-white transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              Website
           </button>
           <button onClick={handleLogout} className="w-full py-3 rounded-2xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              Log Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-14 overflow-y-auto z-10 relative">
        <header className="flex justify-between items-center mb-12 max-w-6xl mx-auto border-b border-beige/40 pb-8">
           <div>
              <h1 className="text-3xl font-bold text-brown mb-2 tracking-tight uppercase tracking-widest text-lg">{tabs.find(t => t.id === activeTab)?.label}</h1>
              <p className="text-brown/50 font-medium text-sm italic">Mastering the Cookery culinary empire.</p>
           </div>
           {addableTabs.includes(activeTab) && (
              <button 
                onClick={() => {
                  const typeMap = { classes: 'class', products: 'product', notes: 'note', certificates: 'certificate' };
                  setTargetType(typeMap[activeTab]);
                  setIsAdding(true);
                }} 
                className="btn-primary !py-3 !text-xs !bg-sage border-none shadow-sage/20"
              >
                 + Add {activeTab === 'certificates' ? 'Certificate' : activeTab.slice(0, -1)}
              </button>
           )}
        </header>

        <div className="max-w-6xl mx-auto">
           <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                 <div key="dash" className="space-y-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        {label: 'Total Students', value: totalStudents.toString(), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'},
                        {label: 'Classes', value: classes.length.toString(), icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253'},
                        {label: 'Enrollments', value: enrollments.length.toString(), icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'},
                        {label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'}
                      ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-3xl p-8 border border-beige shadow-soft flex flex-col justify-between h-44 relative overflow-hidden group">
                           <div className="w-10 h-10 rounded-xl bg-peach/10 flex items-center justify-center text-peach mb-4 group-hover:bg-peach group-hover:text-white transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}></path></svg>
                           </div>
                           <div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-brown/40 block mb-1">{stat.label}</span>
                              <span className="text-3xl font-bold tracking-tight text-brown">{stat.value}</span>
                           </div>
                           <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-beige/10 group-hover:scale-150 transition-transform duration-700"></div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-soft">
                          <h3 className="text-xs font-bold text-brown uppercase tracking-widest mb-10 pb-4 border-b border-beige">Latest Enrollments</h3>
                          <div className="space-y-6">
                             {enrollments.slice(0, 5).map((en) => (
                                <div key={en._id} className="flex justify-between items-center group">
                                   <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-peach/20 text-brown font-bold flex items-center justify-center text-xs border border-beige">{en.studentId?.name?.charAt(0)}</div>
                                      <div>
                                         <p className="font-bold text-brown text-sm">{en.studentId?.name}</p>
                                         <p className="text-[10px] text-brown/40 uppercase tracking-widest">{new Date(en.enrolledAt).toLocaleDateString()}</p>
                                      </div>
                                   </div>
                                   <span className="text-xs font-bold text-sage px-3 py-1 bg-sage/10 rounded-full">₹{en.classId?.price}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                       
                       <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-soft">
                          <h3 className="text-xs font-bold text-brown uppercase tracking-widest mb-10 pb-4 border-b border-beige">Inventory Status</h3>
                          <div className="space-y-6">
                             {products.slice(0, 5).map((p) => (
                                <div key={p._id} className="flex justify-between items-center">
                                   <div className="flex items-center gap-4">
                                      <img src={p.image} className="w-10 h-10 rounded-xl object-cover border border-beige" alt={p.name} />
                                      <div>
                                         <p className="font-bold text-brown text-sm">{p.name}</p>
                                         <p className={`text-[10px] font-bold uppercase tracking-widest ${p.stock < 10 ? 'text-peach' : 'text-sage'}`}>{p.stock} in stock</p>
                                      </div>
                                   </div>
                                   <span className="font-bold text-brown text-sm">₹{p.price}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === 'classes' && (
                 <div key="classes" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {classes.length === 0 && <p className="text-brown/40 col-span-3 text-center py-20">No classes yet. Click "+ Add class" to get started.</p>}
                    {classes.map(cls => (
                       <div key={cls._id} className="premium-card p-4 bg-white/60 group relative overflow-hidden">
                          <div className="aspect-video w-full rounded-2xl overflow-hidden mb-5">
                             <img src={cls.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cls.title} />
                          </div>
                          <h4 className="font-bold text-brown text-lg mb-1">{cls.title}</h4>
                          <p className="text-xs text-brown/50 font-medium uppercase tracking-widest mb-6">{cls.chefName} • {cls.duration}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-beige">
                             <span className="font-bold text-sage text-xl">₹{cls.price}</span>
                             <button onClick={() => handleDelete('class', cls._id)} className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors">Delete</button>
                          </div>
                       </div>
                    ))}
                 </div>
              )}

              {activeTab === 'products' && (
                 <div key="products" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.length === 0 && <p className="text-brown/40 col-span-3 text-center py-20">No products yet. Click "+ Add product" to get started.</p>}
                    {products.map(p => (
                       <div key={p._id} className="premium-card p-6 bg-white/60 group">
                          <div className="w-24 h-24 rounded-2xl overflow-hidden mb-6 mx-auto shadow-soft bg-beige/20 p-2">
                             <img src={p.image} className="w-full h-full object-cover rounded-xl" alt={p.name} />
                          </div>
                          <div className="text-center">
                             <h4 className="font-bold text-brown mb-1">{p.name}</h4>
                             <p className="text-[10px] font-bold text-sage uppercase tracking-widest mb-6">{p.stock} units in stock</p>
                             <div className="flex items-center justify-between pt-4 border-t border-beige">
                                <span className="font-bold text-brown underline decoration-peach decoration-2">₹{p.price}</span>
                                <button onClick={() => handleDelete('product', p._id)} className="text-[10px] font-bold text-red-300 hover:text-red-500 uppercase tracking-widest">Remove</button>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              )}

              {activeTab === 'notes' && (
                 <div key="notes" className="space-y-4">
                    <p className="text-brown/50 text-sm mb-6 italic">Notes are linked to classes. Students can access them from their dashboard.</p>
                    <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-soft text-center">
                      <p className="text-brown/40 text-sm">Upload notes using the "+ Add note" button above.</p>
                      <p className="text-brown/30 text-xs mt-2">PDFs and images are supported via Cloudinary.</p>
                    </div>
                 </div>
              )}

              {activeTab === 'payments' && (
                 <div key="pay" className="bg-white/70 rounded-[2.5rem] overflow-hidden border border-beige shadow-soft">
                    <table className="w-full text-left">
                       <thead className="bg-beige/20 border-b border-beige">
                          <tr>
                             <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-brown/50">Student</th>
                             <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-brown/50">Class</th>
                             <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-brown/50">Amount</th>
                             <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-brown/50">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-beige/40">
                          {enrollments.map(en => (
                             <tr key={en._id} className="hover:bg-white transition-colors">
                                <td className="px-8 py-6">
                                   <p className="font-bold text-brown text-sm">{en.studentId?.name}</p>
                                   <p className="text-[10px] text-brown/40">{en.studentId?.email}</p>
                                </td>
                                <td className="px-8 py-6 text-sm text-brown/70 font-medium">{en.classId?.title}</td>
                                <td className="px-8 py-6 font-bold text-brown text-sm">₹{en.classId?.price}</td>
                                <td className="px-8 py-6">
                                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${en.paymentStatus === 'Completed' ? 'bg-sage/10 text-sage' : 'bg-peach/10 text-peach'}`}>
                                      {en.paymentStatus}
                                   </span>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              )}

              {activeTab === 'certificates' && (
                 <div key="certificates" className="space-y-4">
                    {certificates.length === 0 && (
                       <div className="bg-white/70 rounded-[2.5rem] p-16 border border-beige shadow-soft text-center">
                          <p className="text-brown/40 text-sm">No certificates issued yet.</p>
                          <p className="text-brown/30 text-xs mt-2">Click "+ Add Certificate" to issue one to a student.</p>
                       </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {certificates.map(cert => (
                          <div key={cert._id} className="bg-white rounded-3xl p-6 border border-beige shadow-soft">
                             <div className="w-12 h-12 rounded-2xl bg-brown/10 flex items-center justify-center text-2xl mb-4">🏆</div>
                             <h4 className="font-bold text-brown mb-1">{cert.title}</h4>
                             <p className="text-xs text-brown/50 mb-1">Student: <span className="font-bold">{cert.studentId?.name}</span></p>
                             <p className="text-xs text-brown/50 mb-4">Class: <span className="font-bold">{cert.classId?.title}</span></p>
                             <div className="flex items-center justify-between pt-4 border-t border-beige">
                                <a href={cert.fileURL} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-sage uppercase tracking-widest hover:underline">Download</a>
                                <button onClick={() => handleDelete('certificate', cert._id)} className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest">Revoke</button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}
           </AnimatePresence>
        </div>

        {/* Modal for Adding Items */}
        <AnimatePresence>
           {isAdding && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brown/40 backdrop-blur-sm" onClick={(e) => { if(e.target === e.currentTarget) { setIsAdding(false); resetForm(); } }}>
                 <div 
                   className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 relative"
                 >
                    <button onClick={() => { setIsAdding(false); resetForm(); }} className="absolute top-8 right-8 text-brown/20 hover:text-brown transition-colors">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    
                    <h2 className="text-2xl font-bold text-brown mb-2 tracking-tight">Add New {targetType}</h2>
                    <p className="text-brown/40 text-sm mb-8 font-medium italic">Fill in the details to expand your culinary library.</p>
                    
                    {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                       {targetType === 'class' && (
                          <div className="grid grid-cols-2 gap-4">
                             <div className="col-span-2"><input required placeholder="Class Title" className="input-field" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} /></div>
                             <input required placeholder="Duration (e.g. 2 hours)" className="input-field" value={formData.duration} onChange={e=>setFormData({...formData, duration:e.target.value})} />
                             <input required type="number" min="0" placeholder="Price (₹)" className="input-field" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})} />
                             <input required placeholder="Chef Name" className="input-field col-span-2" value={formData.chefName} onChange={e=>setFormData({...formData, chefName:e.target.value})} />
                          </div>
                       )}

                       {targetType === 'product' && (
                          <div className="grid grid-cols-2 gap-4">
                             <div className="col-span-2"><input required placeholder="Product Name" className="input-field" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} /></div>
                             <input required type="number" min="0" placeholder="Price (₹)" className="input-field" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})} />
                             <input required type="number" min="0" placeholder="Stock Quantity" className="input-field" value={formData.stock} onChange={e=>setFormData({...formData, stock:e.target.value})} />
                          </div>
                       )}

                       {targetType === 'note' && (
                          <div className="space-y-4">
                             <input required placeholder="Note Title" className="input-field" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} />
                             <select required className="input-field" value={formData.classId} onChange={e=>setFormData({...formData, classId:e.target.value})}>
                                <option value="">Select Associated Class</option>
                                {classes.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                             </select>
                          </div>
                       )}

                       {targetType === 'certificate' && (
                          <div className="space-y-4">
                             <input required placeholder="Certificate Title (e.g. Certificate of Completion)" className="input-field" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} />
                             <select required className="input-field" value={formData.classId} onChange={e=>setFormData({...formData, classId:e.target.value})}>
                                <option value="">Select Class</option>
                                {classes.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                             </select>
                             <select required className="input-field" value={formData.studentId} onChange={e=>setFormData({...formData, studentId:e.target.value})}>
                                <option value="">Select Student (Enrolled)</option>
                                {enrollments.filter(en => en.paymentStatus === 'Completed').map(en => (
                                   <option key={en.studentId?._id} value={en.studentId?._id}>
                                      {en.studentId?.name} — {en.classId?.title}
                                   </option>
                                ))}
                             </select>
                             <p className="text-xs text-brown/40 italic">An email with certificate link will be sent automatically.</p>
                          </div>
                       )}

                       {targetType !== 'certificate' && (
                          <textarea 
                            required={targetType !== 'certificate'} 
                            placeholder="Description" 
                            className="input-field h-24" 
                            value={formData.description} 
                            onChange={e=>setFormData({...formData, description:e.target.value})} 
                          />
                       )}
                       
                       <div className="p-6 border-2 border-dashed border-beige rounded-2xl bg-cream/30 text-center group hover:border-sage transition-colors cursor-pointer relative">
                          <input required type="file" onChange={e => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" 
                            accept={targetType === 'note' || targetType === 'certificate' ? '.pdf,.jpg,.jpeg,.png' : 'image/*'} />
                          <p className="text-xs font-bold text-brown/40 uppercase tracking-widest">
                             {file ? `✓ ${file.name}` : `Upload ${targetType === 'note' || targetType === 'certificate' ? 'PDF / Image' : 'Image'}`}
                          </p>
                          {!file && <p className="text-[10px] text-brown/30 mt-1">Click or drag & drop</p>}
                       </div>

                       <div className="pt-2">
                          <button type="submit" disabled={submitting} className="w-full btn-primary !py-4 shadow-xl !bg-brown border-none disabled:opacity-50">
                             {submitting ? 'Uploading...' : 'Create & Publish'}
                          </button>
                       </div>
                    </form>
                 </div>
              </div>
           )}
        </AnimatePresence>
      </main>
      
      <style>{`
         .input-field {
            width: 100%;
            padding: 14px 20px;
            border: 1px solid #F6F1EB;
            border-radius: 16px;
            font-size: 13px;
            font-weight: 500;
            color: #6B4F3A;
            outline: none;
            background: white;
            transition: all 0.3s;
         }
         .input-field:focus {
            border-color: #8FBF9F;
            box-shadow: 0 0 0 4px rgba(143, 191, 159, 0.1);
         }
         .shadow-soft {
            box-shadow: 0 10px 30px -10px rgba(107, 79, 58, 0.08);
         }
      `}</style>
    </div>
  );
}
