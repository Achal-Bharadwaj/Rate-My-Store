import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const OwnerDashboard = () => {
  const { token } = useContext(AuthContext);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/owner/stores/ratings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRatings(response.data.data.ratings);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRatings();
  }, [token]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Owner Dashboard</h2>
      <h3 className="mb-3">Your Store Ratings</h3>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Store</th>
            <th>User</th>
            <th>Rating</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map(rating => (
            <tr key={rating.id}>
              <td>{rating.store_name}</td>
              <td>{rating.user_name}</td>
              <td>{rating.rating}/5</td>
              <td>{rating.comment || 'No comment'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerDashboard;