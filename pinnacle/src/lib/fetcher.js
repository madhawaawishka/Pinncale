import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default fetcher;
