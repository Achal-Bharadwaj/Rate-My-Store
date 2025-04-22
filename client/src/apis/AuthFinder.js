import axios from 'axios';

const AuthFinder = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

export default AuthFinder;