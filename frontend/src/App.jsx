import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Historial from './pages/Historial';
import Recordatorios from './pages/Recordatorios';
import Nutricion from './pages/Nutricion';
import Perfil from './pages/Perfil';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/dashboard"       element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/historial"       element={<PrivateRoute><Historial /></PrivateRoute>} />
          <Route path="/recordatorios"   element={<PrivateRoute><Recordatorios /></PrivateRoute>} />
          <Route path="/nutricion"       element={<PrivateRoute><Nutricion /></PrivateRoute>} />
          <Route path="/perfil"          element={<PrivateRoute><Perfil /></PrivateRoute>} />
          <Route path="*"                element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
