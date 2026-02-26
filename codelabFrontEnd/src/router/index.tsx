import { BrowserRouter as Router, Outlet, Route, Routes } from 'react-router';
import Home from '../pages/Home';
import Dashboard from '../pages/Administration/Dashboard';
import Login from '../pages/Login';
import NavBar from '../components/NavBar';
import navBarData from "../data/dataNavBar/NavBarData";
import UserManagement from '../pages/Administration/Users/UserManagement';
import Branches from '../pages/Administration/Branches/Dashboard';

const AppLayout = () => (
  <div className="min-h-screen bg-[#f4f6fb]">
    <NavBar {...navBarData} />
    <Outlet />
  </div>
);

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Users-Management" element={<UserManagement />} />
        <Route path="/Branches-Management" element={<Branches />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRouter;