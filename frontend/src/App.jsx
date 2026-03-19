import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Classes from './pages/Classes';
import Enrollment from './pages/Enrollment';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import EventCatering from './pages/EventCatering';
import CateringOrderDetails from './pages/CateringOrderDetails';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes — login required */}
            <Route path="/enroll/:classId?" element={
              <ProtectedRoute><Enrollment /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><StudentDashboard /></ProtectedRoute>
            } />

            <Route path="/event-catering" element={
              <ProtectedRoute><EventCatering /></ProtectedRoute>
            } />

            <Route path="/catering-order/:orderId" element={
              <ProtectedRoute><CateringOrderDetails /></ProtectedRoute>
            } />

            {/* Admin Only Route */}
            <Route path="/admin" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

