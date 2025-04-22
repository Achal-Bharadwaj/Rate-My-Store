import React, { useContext, useEffect, useState } from 'react';
import UserFinder from '../apis/UserFinder';
import { AuthContext } from '../context/AuthContext';

const UserList = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', role: '', sort: 'name_asc' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserFinder.get('/users', {
          headers: { Authorization: `Bearer ${token}` },
          params: filters,
        });
        setUsers(response.data.data.users);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [filters, token]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Users</h2>
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by email"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          />
        </div>
        <div className="col-md-3">
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
        <div className="col-md-3">
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
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Address</th>
            <th>Owner Rating</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.address}</td>
              <td>{user.owner_rating ? user.owner_rating.toFixed(1) : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;