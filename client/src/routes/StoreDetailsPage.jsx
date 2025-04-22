import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StoreFinder from '../apis/StoreFinder';
import Header from '../components/Header';
import Ratings from '../components/Ratings';
import AddRating from '../components/AddRating';
import StarRating from '../components/StarRating';
import { AuthContext } from '../context/AuthContext';
import { StoresContext } from '../context/StoresContext';

const StoreDetailsPage = () => {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const { setSelectedStore } = useContext(StoresContext);
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await StoreFinder.get(`/${id}`);
        setStoreData(response.data.data);
        setSelectedStore(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch store');
      }
    };
    fetchStore();
  }, [id, setSelectedStore]);

  const handleDelete = async () => {
    try {
      await StoreFinder.delete(`/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete store');
    }
  };

  const handleRatingAdded = async () => {
    try {
      const response = await StoreFinder.get(`/${id}`);
      setStoreData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to refresh ratings');
    }
  };

  if (!storeData) return <div className="container mt-5">Loading...</div>;

  return (
    <div>
      <Header />
      <div className="container mt-5">
        {error && <div className="alert alert-danger">{error}</div>}
        <h2 className="text-center mb-4">{storeData.store.name}</h2>
        <div className="text-center mb-4">
          <StarRating rating={storeData.store.average_rating || 0} />
          <span className="ms-2">
            ({storeData.ratings.length} ratings)
          </span>
        </div>
        <p><strong>Address:</strong> {storeData.store.address}</p>
        <p><strong>Email:</strong> {storeData.store.email}</p>
        <p><strong>Owner:</strong> {storeData.store.owner_name}</p>
        {(user?.role === 'admin' || (user?.role === 'owner' && storeData.store.owner_id === user.id)) && (
          <div className="mb-4">
            <button
              className="btn btn-warning me-2"
              onClick={() => navigate(`/stores/${id}/update`)}
            >
              Update
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
        {user?.role === 'user' && (
          <AddRating storeId={id} onRatingAdded={handleRatingAdded} />
        )}
        <Ratings ratings={storeData.ratings} />
      </div>
    </div>
  );
};

export default StoreDetailsPage;