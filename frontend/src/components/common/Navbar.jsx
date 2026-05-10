import { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import './Navbar.css';
                                                                                      // hernique agostinetto piva
export default function Navbar() {
  const { isAuth, logout } = useContext(AuthContext);
  const { mode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuth) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMenu = () => setIsOpen(false);
  const menuItems = ['dashboard', 'funcionarios', 'clientes', 'produtos', 'comandas', 'caixa', 'perfil'];

  return (
    <nav className="metal-navbar">
      <h1 className="metal-brand">comandas</h1>

      <button className="metal-hamburger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <CloseIcon fontSize="inherit" /> : <MenuIcon fontSize="inherit" />}
      </button>

      <div className={`metal-menu ${isOpen ? 'open' : ''}`}>
        {menuItems.map((item) => (
          <NavLink 
            key={item} 
            to={`/${item}`} 
            className={({ isActive }) => `metal-nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {item}
          </NavLink>
        ))}

        <button onClick={toggleTheme} className="theme-toggle-btn">
          {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
        </button>

        <img 
          src="/henriqueagostinettopiva.png" 
          alt="perfil" 
          className="metal-profile-pic" 
        />

        <button onClick={handleLogout} className="metal-logout-btn">
          sair
        </button>
      </div>
    </nav>
  );
}