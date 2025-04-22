import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import StoreList from '../components/StoreList';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Header />
      <div className="container mt-5">
        {user && (
          <div className="mb-4">
            {(user.role === 'admin' || user.role === 'owner') && (
              <Link to="/stores/add" className="btn btn-primary me-2">Add Store</Link>
            )}
            <Link to="/users/password" className="btn btn-primary me-2">Update Password</Link>
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" className="btn btn-primary me-2">Admin Dashboard</Link>
            )}
            {user.role === 'owner' && (
              <Link to="/owner/dashboard" className="btn btn-primary">Owner Dashboard</Link>
            )}
          </div>
        )}
        <StoreList />
      </div>
    </div>
  );
};

export default Home;