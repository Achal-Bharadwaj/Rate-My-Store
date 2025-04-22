import axios from 'axios';

const StatsFinder = axios.create({
  baseURL: 'http://localhost:5000/api/v1/admin',
});

export default StatsFinder;