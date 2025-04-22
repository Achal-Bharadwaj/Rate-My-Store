import axios from 'axios';

const StoreFinder = axios.create({
  baseURL: 'http://localhost:5000/api/v1/stores',
});

export default StoreFinder;