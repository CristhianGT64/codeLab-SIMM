import { BrowserRouter as Router, Outlet, Route, Routes } from 'react-router';
import Dashboard from '../pages/Administration/Dashboard';
import Login from '../pages/Login';
import NavBar from '../components/NavBar';
import navBarData from "../data/dataNavBar/NavBarData";
import UserManagement from '../pages/Administration/Users/UserManagement';
import Branches from '../pages/Administration/Branches/BranchManagement';
import FormSucursal from '../pages/Administration/Branches/FormSucursal';
import FormUser from '../pages/Administration/Users/FormUser';
import ProductManagement from '../pages/Administration/Products/ProductManagement';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import PermissionGate from '../components/PermissionGate';
import FormProduct from '../pages/Administration/Products/FormProduct';
import RolesPermisionManagment from '../pages/Administration/RolesPermission/RolesPermisionManagment';
import FormRoles from '../pages/Administration/RolesPermission/FormRoles';
import FormPermissions from '../pages/Administration/RolesPermission/FormPermissions';
import ClientsManagement from '../pages/Facturacion/Clients/ClientsManagement';
import FormClient from '../pages/Facturacion/Clients/FormClient';
import ClientDetail from '../pages/Facturacion/Clients/ClientDetail';
import InventarioManagement from '../pages/Administration/Inventario/InventarioManagement';
import SalidasInventario from '../pages/Administration/Inventario/SalidasInventario';
import EntradaInventario from '../pages/Administration/Inventario/EntradaInventario';
import FifoPromConfig from '../pages/Administration/configuracion/fifo-prom/FifoPromConfig';
import ConfiguracionCAI from '../pages/Administration/Facturacion/ConfiguracionCAI';

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

            {/* Usuarios */}
            <Route path="/Users-Management" element={<PermissionGate permiso="Ver usuarios"><UserManagement /></PermissionGate>} />
            <Route path="/Users-Management/Create-User" element={<PermissionGate permiso="Crear usuarios"><FormUser/></PermissionGate>} />
            <Route path="/Users-Management/Update-User/:id" element={<PermissionGate permiso="Editar usuarios"><FormUser/></PermissionGate>} />

            {/* Sucursales */}
            <Route path="/Branches-Management" element={<PermissionGate permiso="Ver sucursales"><Branches /></PermissionGate>} />
            <Route path="/Branches-Management/Create-Sucursal" element={<PermissionGate permiso="Crear sucursales"><FormSucursal /></PermissionGate>} />
            <Route path="/Branches-Management/Update-Sucursal/:id" element={<PermissionGate permiso="Editar sucursales"><FormSucursal /></PermissionGate>} />


            {/* Clientes */}
            <Route path="/Clients-Management" element={<PermissionGate permiso="Ver clientes"><ClientsManagement /></PermissionGate>} />
            <Route path="/Clients-Management/Create-Client" element={<PermissionGate permiso="Crear clientes"><FormClient /></PermissionGate>} />
            <Route path="/Clients-Management/Update-Client/:id" element={<PermissionGate permiso="Editar clientes"><FormClient /></PermissionGate>} />
            <Route path="/Clients-Management/Detail-Client/:id" element={<PermissionGate permiso="Ver clientes"><ClientDetail /></PermissionGate>} />

            {/* Productos */}
            <Route path="/Product-Management" element={<PermissionGate permiso="Ver productos"><ProductManagement /></PermissionGate>} />
            <Route path="/Product-Management/Create-Product" element={<PermissionGate permiso="Crear productos"><FormProduct /></PermissionGate>} />
            <Route path="/Product-Management/Update-Product/:id" element={<PermissionGate permiso="Editar productos"><FormProduct /></PermissionGate>} />

            {/* Roles y Permisos */}
            <Route path="/RolesPermision-Management/" element={<PermissionGate permiso="Ver roles"><RolesPermisionManagment /></PermissionGate>} />
            <Route path="/RolesPermision-Management/Create-Permisssion" element={<PermissionGate permiso="Crear permisos"><FormPermissions /></PermissionGate>} />
            <Route path="/RolesPermision-Management/Create-Roles" element={<PermissionGate permiso="Crear roles"><FormRoles /></PermissionGate>} />
            <Route path="/RolesPermision-Management/Update-Roles/:id" element={<PermissionGate permiso="Editar roles"><FormRoles /></PermissionGate>} />

            {/* Gestion de inventarios */}
            <Route path="/Inventario-Management" element={<PermissionGate permiso="Movimientos inventario"><InventarioManagement /></PermissionGate>} />
            <Route path="/Inventario-Management/Salida-Inventario" element={<PermissionGate permiso="Salida inventario"><SalidasInventario /></PermissionGate>} />
            <Route path="/Inventario-Management/Entrada-Inventario" element={<PermissionGate permiso="Entrada inventario"><EntradaInventario /></PermissionGate>} />
            <Route path="/Configuracion/Inventario/FIFO-PEPS" element={<PermissionGate permiso="Movimientos inventario"><FifoPromConfig /></PermissionGate>} />

            {/* Configuración de CAI */}
            <Route path="/Configuracion/CAI" element={<PermissionGate permiso="Ver configuración CAI"><ConfiguracionCAI /></PermissionGate>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default AppRouter;
