import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function Navigation() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <div className="nav-content">
        <div className="nav-brand">
          <div className="nav-icon">S</div>
          <span>Security Incident Tracker</span>
        </div>
        <div className="nav-right">
          <span className="nav-user">Welcome, {user.name || user.email}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
