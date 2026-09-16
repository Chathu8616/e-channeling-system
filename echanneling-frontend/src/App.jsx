import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DoctorSearchPage from './pages/doctors/DoctorSearchPage';
import DoctorProfilePage from './pages/doctors/DoctorProfilePage';
import BookAppointmentPage from './pages/booking/BookAppointmentPage';
import MyAppointmentsPage from './pages/booking/MyAppointmentsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/doctors" element={<DoctorSearchPage />} />
          <Route path="/doctors/:id" element={<DoctorProfilePage />} />
          <Route path="/book/:sessionId" element={<BookAppointmentPage />} />
          <Route path="/appointments" element={<MyAppointmentsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
