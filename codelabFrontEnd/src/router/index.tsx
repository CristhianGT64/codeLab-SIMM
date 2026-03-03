import { BrowserRouter as Router, Outlet, Route, Routes } from 'react-router';
import Home from '../pages/Home';
import Dashboard from '../pages/Administration/Dashboard';
import Login from '../pages/Login';
import NavBar from '../components/NavBar';
import navBarData from "../data/dataNavBar/NavBarData";
import UserManagement from '../pages/Administration/Users/UserManagement';
import Branches from '../pages/Administration/Branches/Dashboard'; 

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
  <Router>
    <Routes>
      {/* Ruta para el Login */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas/administrativas con Layout común */}
      <Route element={<AppLayout />}>
        {/* Ruta Home */}
        <Route path="/" element={<Home />} />
        
        {/* Ruta dashboard principal */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Ruta gestión de usuarios */}
        <Route path="/Users-Management" element={<UserManagement />} />
        
        {/* Ruta gestión de sucursales --- */}
        <Route path="/Branches-Management" element={<Branches />} />
        
      </Route>
    </Routes>
  </Router>
);

export default AppRouter;