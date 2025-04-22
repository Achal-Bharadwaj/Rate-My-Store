import React, { useContext, useEffect, useState } from 'react';
import StatsFinder from '../apis/StatsFinder';
import UserFinder from '../apis/UserFinder';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await StatsFinder.get('/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsResponse.data.data);

        const usersResponse = await UserFinder.get('/users', {
          headers: { Authorization: `Bearer ${token}` },
          params: filters,
        });
        setUsers(usersResponse.data.data.users);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [filters, token]);

  if (!stats) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Statistics</h5>
          <p>Total Users: {stats.total_users}</p>
          <p>Total Stores: {stats.total_stores}</p>
          <p>Total Ratings: {stats.total_ratings}</p>
        </div>
      </div>
      <div className="mb-4">
        <Link to="/admin/add-user" className="btn btn-secondary">Add User</Link>
      </div>
      <h3 className="mb-3">Users</h3>
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
            placeholder="Filter by email"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
          </select>
        </div>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;