// publicAxios.js
import axios from 'axios';
const BASE_API_URL = import.meta.env.VITE_API_URL;

const publicAxios = axios.create({
  baseURL:  `${BASE_API_URL}/api`,
});

export default publicAxios;