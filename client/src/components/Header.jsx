import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Rate My Store</Link>
        <div className="navbar-nav ms-auto">
          {user ? (
            <>
              <span className="nav-link">Hello, {user.role}</span>
              <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login"style={{ color: 'white' }}>Login</Link>
              <Link className="nav-link" to="/signup"style={{ color: 'white' }}>Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;