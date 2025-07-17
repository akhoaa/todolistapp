import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // Đúng với backend hiện tại
  withCredentials: true,
});

// Simple event emitter for global error handling
export const listeners = [];
export function onAxiosError(fn) { listeners.push(fn); }

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        listeners.forEach(fn => fn('401'));
      }
      if (error.response.status === 403) {
        listeners.forEach(fn => fn('403'));
      }
    }
    return Promise.reject(error);
  }
);

export default instance; 