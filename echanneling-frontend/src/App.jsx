import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import RequireRole from './components/RequireRole';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DoctorSearchPage from './pages/doctors/DoctorSearchPage';
import DoctorProfilePage from './pages/doctors/DoctorProfilePage';
import BookAppointmentPage from './pages/booking/BookAppointmentPage';
import MyAppointmentsPage from './pages/booking/MyAppointmentsPage';
import PaymentPage from './pages/payments/PaymentPage';
import ScheduleManagerPage from './pages/admin/ScheduleManagerPage';
import ReportsPage from './pages/admin/ReportsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/doctors" element={<DoctorSearchPage />} />
            <Route path="/doctors/:id" element={<DoctorProfilePage />} />
            <Route path="/book/:sessionId" element={<BookAppointmentPage />} />
            <Route path="/appointments" element={<MyAppointmentsPage />} />
            <Route path="/pay/:appointmentId" element={<PaymentPage />} />
            <Route
              path="/admin/schedule"
              element={
                <RequireRole roles={['OPERATIONS_MANAGER', 'DOCTOR']}>
                  <ScheduleManagerPage />
                </RequireRole>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <RequireRole roles={['OPERATIONS_MANAGER', 'DOCTOR']}>
                  <ReportsPage />
                </RequireRole>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
