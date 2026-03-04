import { BrowserRouter as Router, Outlet, Route, Routes } from 'react-router';
import Dashboard from '../pages/Administration/Dashboard';
import Login from '../pages/Login';
import NavBar from '../components/NavBar';
import navBarData from "../data/dataNavBar/NavBarData";
import UserManagement from '../pages/Administration/Users/UserManagement';
import Branches from '../pages/Administration/Branches/BranchManagement';
import FormSucursal from '../pages/Administration/Branches/FormSucursal';
import FormUser from '../pages/Administration/Users/FormUser';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import settings from '../lib/settings';

/**
 * AppLayout: Define la estructura común para las páginas internas.
 * Incluye el NavBar y el Outlet donde se renderizan las rutas hijas.
 */
const AppLayout = () => (
  <div className="min-h-screen bg-[#f4f6fb]">
    {/* Pasamos la data del NavBar que está definida */}
    <NavBar {...navBarData} />
    <main className="container mx-auto">
      <Outlet />
    </main>
  </div>
);

const AppRouter = () => (
  <AuthProvider>
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        {/* Rutas protegidas - requieren autenticación */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/Users-Management" element={<UserManagement />} />
            <Route path="/Users-Management/Create-User" element={<FormUser/>} />
            <Route path="/Users-Management/Update-User/:id" element={<FormUser/>} />
            <Route path="/Branches-Management" element={<Branches />} />
            <Route path="/Branches-Management/Create-Sucursal" element={<FormSucursal />} />
            <Route path="/Branches-Management/Update-Sucursal/:id" element={<FormSucursal />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default AppRouter;
