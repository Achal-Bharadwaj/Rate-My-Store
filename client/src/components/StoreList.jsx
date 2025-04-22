import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StoreFinder from '../apis/StoreFinder';
import { StoresContext } from '../context/StoresContext';
import { AuthContext } from '../context/AuthContext';

const StoreList = () => {
  const { stores, setStores } = useContext(StoresContext);
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ name: '', address: '', sort: 'name_asc' });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await StoreFinder.get('/', {
          headers: { Authorization: `Bearer ${token}` },
          params: filters,
        });
        setStores(response.data.data.stores);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchStores();
  }, [filters, setStores, token, user]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await StoreFinder.delete(`/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(stores.filter(store => store.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    navigate(`/stores/${id}/update`);
  };

  const handleStoreSelect = (id) => {
    navigate(`/stores/${id}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Stores</h2>
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by address"
            value={filters.address}
            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
          </select>
        </div>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Store</th>
            <th>Address</th>
            <th>Email</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            {(user?.role === 'admin' || user?.role === 'owner') && (
              <>
                <th>Edit</th>
                <th>Delete</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id} onClick={() => handleStoreSelect(store.id)} style={{ cursor: 'pointer' }}>
              <td>{store.name}</td>
              <td>{store.address}</td>
              <td>{store.email}</td>
              <td>{store.average_rating ? store.average_rating.toFixed(1) : 'N/A'}</td>
              <td>{store.user_rating ? store.user_rating : 'Not rated'}</td>
              {(user?.role === 'admin' || (user?.role === 'owner' && store.owner_id === user.id)) && (
                <>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={(e) => handleUpdate(e, store.id)}
                    >
                      Update
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => handleDelete(e, store.id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreList;